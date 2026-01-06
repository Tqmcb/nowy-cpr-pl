from typing import Optional, Dict, Any, List, Union
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import APIKeyHeader
import databutton as db
import json
import os
import requests

# Create router
router = APIRouter()

# Admin key security
API_KEY_NAME = "X-Admin-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

# Models
class AdminResponse(BaseModel):
    success: bool
    message: str

class BlogPostBase(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: bool = True
    featured_image_url: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BlogPostBase):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None

class BlogPost(BlogPostBase):
    id: int
    published_at: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None

class DocumentBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_name: str
    file_size: int
    file_type: str
    category: Optional[str] = None
    is_published: bool = True
    metadata: Optional[Dict[str, Any]] = None

class DocumentCreate(DocumentBase):
    file_key: str

class DocumentUpdate(DocumentBase):
    title: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    file_type: Optional[str] = None

class Document(DocumentBase):
    id: int
    file_key: str
    download_count: int
    created_at: str
    updated_at: Optional[str] = None

class ProductCategoryBase(BaseModel):
    name: str
    category_code: str
    description: Optional[str] = None
    parent_id: Optional[int] = None
    is_published: bool = True
    metadata: Optional[Dict[str, Any]] = None

class ProductCategoryCreate(ProductCategoryBase):
    pass

class ProductCategoryUpdate(ProductCategoryBase):
    name: Optional[str] = None
    category_code: Optional[str] = None

class ProductCategory(ProductCategoryBase):
    id: int
    created_at: str
    updated_at: Optional[str] = None

class ProductRequirementBase(BaseModel):
    category_id: int
    requirement_code: str
    name: str
    description: Optional[str] = None
    details: Optional[str] = None
    is_mandatory: bool = True
    order_index: int = 0
    is_published: bool = True
    metadata: Optional[Dict[str, Any]] = None

class ProductRequirementCreate(ProductRequirementBase):
    pass

class ProductRequirementUpdate(ProductRequirementBase):
    requirement_code: Optional[str] = None
    name: Optional[str] = None
    is_mandatory: Optional[bool] = None

class ProductRequirement(ProductRequirementBase):
    id: int
    created_at: str
    updated_at: Optional[str] = None

# Helper function to verify admin key
def verify_admin_key(api_key: str = Depends(api_key_header)):
    try:
        admin_key = db.secrets.get("ADMIN_KEY")
    except Exception as e:
        print(f"Error getting admin key from secrets: {e}")
        admin_key = ""
        
        # Try to get admin key from storage as fallback 
        try:
            admin_key = db.storage.text.get("admin_key", default="")
            print("Using admin key from storage instead of secrets")
        except Exception as e:
            print(f"Error getting admin key from storage: {e}")
    
    # If no admin key is set in secrets, check if it's provided in the request
    if not admin_key and not api_key:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )
    
    # If admin key is set, verify it against the provided key
    if admin_key and api_key != admin_key:
        raise HTTPException(
            status_code=401,
            detail="Invalid admin key"
        )
    
    return True

# Get Supabase client helper function
def get_supabase_client():
    supabase_config = db.storage.json.get("supabase_config", default={})
    if not supabase_config or not supabase_config.get("url") or not supabase_config.get("key"):
        raise HTTPException(
            status_code=400,
            detail="Supabase not configured. Please configure Supabase in the admin panel."
        )
    
    return {
        "url": supabase_config["url"],
        "key": supabase_config["key"],
        "service_role_key": supabase_config.get("service_role_key", "")
    }

# Init admin tables endpoint
@router.post("/init-admin-tables")
def init_admin_tables(authenticated: bool = Depends(verify_admin_key)) -> AdminResponse:
    try:
        supabase = get_supabase_client()
        service_role_key = supabase.get("service_role_key")
        
        if not service_role_key:
            return AdminResponse(
                success=False,
                message="Service role key is missing from Supabase configuration. This key is required to create tables."
            )
        
        # Create tables using SQL via RPC
        headers = {
            "apikey": service_role_key,
            "Authorization": f"Bearer {service_role_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        # Execute SQL to create tables
        sql_url = f"{supabase['url']}/rest/v1/rpc/execute_sql"
        
        # Create blog_posts table
        blog_posts_sql = """
        CREATE TABLE IF NOT EXISTS blog_posts (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            content TEXT NOT NULL,
            excerpt TEXT,
            author TEXT,
            published_at TIMESTAMP WITH TIME ZONE,
            is_published BOOLEAN DEFAULT TRUE,
            featured_image_url TEXT,
            tags TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE,
            metadata JSONB
        );
        """
        
        # Create documents table
        documents_sql = """
        CREATE TABLE IF NOT EXISTS documents (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            file_key TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            file_type TEXT NOT NULL,
            category TEXT,
            is_published BOOLEAN DEFAULT TRUE,
            download_count INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE,
            metadata JSONB
        );
        """
        
        # Create product_categories table if not exists (improved version)
        product_categories_sql = """
        CREATE TABLE IF NOT EXISTS product_categories (
            id SERIAL PRIMARY KEY,
            category_code TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            description TEXT,
            parent_id INTEGER REFERENCES product_categories(id),
            is_published BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE,
            metadata JSONB
        );
        """
        
        # Create product_requirements table if not exists (improved version)
        product_requirements_sql = """
        CREATE TABLE IF NOT EXISTS product_requirements (
            id SERIAL PRIMARY KEY,
            category_id INTEGER NOT NULL REFERENCES product_categories(id),
            requirement_code TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            details TEXT,
            is_mandatory BOOLEAN DEFAULT TRUE,
            order_index INTEGER DEFAULT 0,
            is_published BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE,
            metadata JSONB,
            UNIQUE(category_id, requirement_code)
        );
        """
        
        # Create indexes for faster searches
        indexes_sql = """
        CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);
        CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts (is_published, published_at);
        CREATE INDEX IF NOT EXISTS product_categories_code_idx ON product_categories (category_code);
        CREATE INDEX IF NOT EXISTS product_requirements_category_idx ON product_requirements (category_id);
        """
        
        # Add RLS policies
        rls_policies_sql = """
        -- Enable Row Level Security
        ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
        ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
        ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
        ALTER TABLE product_requirements ENABLE ROW LEVEL SECURITY;
        
        -- Create policies for blog_posts
        DROP POLICY IF EXISTS "Public can read published blog posts" ON blog_posts;
        CREATE POLICY "Public can read published blog posts" ON blog_posts
            FOR SELECT USING (is_published = TRUE);
        
        DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON blog_posts;
        CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts
            FOR ALL USING (auth.role() = 'authenticated');
        
        -- Create policies for documents
        DROP POLICY IF EXISTS "Public can read published documents" ON documents;
        CREATE POLICY "Public can read published documents" ON documents
            FOR SELECT USING (is_published = TRUE);
        
        DROP POLICY IF EXISTS "Authenticated users can manage documents" ON documents;
        CREATE POLICY "Authenticated users can manage documents" ON documents
            FOR ALL USING (auth.role() = 'authenticated');
        
        -- Create policies for product_categories
        DROP POLICY IF EXISTS "Public can read published product categories" ON product_categories;
        CREATE POLICY "Public can read published product categories" ON product_categories
            FOR SELECT USING (is_published = TRUE);
        
        DROP POLICY IF EXISTS "Authenticated users can manage product categories" ON product_categories;
        CREATE POLICY "Authenticated users can manage product categories" ON product_categories
            FOR ALL USING (auth.role() = 'authenticated');
        
        -- Create policies for product_requirements
        DROP POLICY IF EXISTS "Public can read published product requirements" ON product_requirements;
        CREATE POLICY "Public can read published product requirements" ON product_requirements
            FOR SELECT USING (is_published = TRUE);
        
        DROP POLICY IF EXISTS "Authenticated users can manage product requirements" ON product_requirements;
        CREATE POLICY "Authenticated users can manage product requirements" ON product_requirements
            FOR ALL USING (auth.role() = 'authenticated');
        """
        
        # Define all SQL statements to execute
        all_sql_statements = [
            blog_posts_sql,
            documents_sql,
            product_categories_sql,
            product_requirements_sql,
            indexes_sql,
            rls_policies_sql
        ]
        
        # Execute all SQL statements
        for sql in all_sql_statements:
            try:
                payload = {"query": sql, "params": []}
                response = requests.post(sql_url, headers=headers, json=payload)
                
                if response.status_code not in [200, 201]:
                    print(f"Error executing SQL: {response.status_code} - {response.text}")
                    print(f"Failed SQL:\n{sql}")
                    return AdminResponse(
                        success=False,
                        message=f"Error creating tables: {response.text}"
                    )
            except Exception as e:
                print(f"Exception executing SQL: {e}")
                print(f"Failed SQL:\n{sql}")
                return AdminResponse(
                    success=False,
                    message=f"Exception creating tables: {str(e)}"
                )
        
        return AdminResponse(
            success=True,
            message="Admin tables successfully initialized in Supabase."
        )
    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        print(f"Error initializing admin tables: {e}")
        return AdminResponse(
            success=False,
            message=f"Error initializing admin tables: {str(e)}"
        )

# The following are placeholders for CRUD operations that will be implemented
# for blog posts, documents, product categories, and requirements

@router.get("/health")
def check_health():
    return {"status": "ok", "service": "admin-api"}
