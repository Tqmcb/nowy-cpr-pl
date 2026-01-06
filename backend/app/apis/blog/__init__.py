from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import APIKeyHeader
import databutton as db
import json
import os
import requests
from datetime import datetime, timezone
from uuid import uuid4

# Create router
router = APIRouter()

# Admin key security
API_KEY_NAME = "X-Admin-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

# Models
class BlogPost(BaseModel):
    id: Optional[str]
    title: str
    slug: str
    excerpt: Optional[str] = ""
    content: str
    image_url: Optional[str] = ""
    author: Optional[str] = "Zespół Multicert"
    published_at: Optional[str] = None
    updated_at: Optional[str] = None
    is_published: Optional[bool] = True
    category: Optional[str] = "Ogólne"

class BlogImportRequest(BaseModel):
    admin_key: str

class BlogImportResponse(BaseModel):
    success: bool
    message: str
    imported_count: Optional[int] = 0

# Helper function to verify admin key
def verify_admin_key(api_key: str = Depends(api_key_header)):
    # Get admin key from db.secrets with try/except for safety
    try:
        admin_key = db.secrets.get("ADMIN_KEY")
    except Exception as e:
        print(f"Error getting admin key from secrets: {e}")
        admin_key = ""
        
        # Try to get admin key from storage as fallback (for development or if secrets failed)
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

@router.post("/import-blog-posts")
def import_blog_posts(data: BlogImportRequest, authenticated: bool = Depends(verify_admin_key)) -> BlogImportResponse:
    try:
        # Get Supabase configuration
        supabase_config = db.storage.json.get("supabase_config", default={})
        if not supabase_config or not supabase_config.get("url") or not supabase_config.get("key"):
            return BlogImportResponse(
                success=False,
                message="Konfiguracja Supabase nie została znaleziona. Proszę najpierw skonfigurować Supabase.",
                imported_count=0
            )
            
        # Check if service role key is available
        service_role_key = db.secrets.get("SUPABASE_SERVICE_KEY", default=None)
        if not service_role_key and not supabase_config.get("service_role_key"):
            print("Warning: Service role key is missing")
            return BlogImportResponse(
                success=False,
                message="Brak klucza Service Role w konfiguracji Supabase. Ten klucz jest wymagany do tworzenia tabel. Proszę skonfigurować Supabase ponownie z poprawnym kluczem Service Role.",
                imported_count=0
            )
            
        # Use service key from secret or from config
        if service_role_key:
            api_key = service_role_key
        else:
            api_key = supabase_config.get("service_role_key")
            
        # Pobierz przykładowe wpisy bloga
        try:
            blog_posts = db.storage.json.get("sample_blog_posts")
            print(f"Pobrano {len(blog_posts)} wpisów do importu.")
        except Exception as e:
            print(f"Błąd pobierania wpisów z storage: {e}")
            return BlogImportResponse(
                success=False,
                message="Nie znaleziono przykładowych wpisów na blog w storage. Proszę najpierw przygotować artykuły.",
                imported_count=0
            )
        
        # Supabase URL and headers
        supabase_url = supabase_config["url"]
        headers = {
            "apikey": api_key,
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        # Check if blog_posts table exists
        def check_table_exists(table_name):
            try:
                # Use Supabase REST API to check if table exists
                check_url = f"{supabase_url}/rest/v1/{table_name}?limit=0"
                response = requests.get(check_url, headers=headers)
                
                # 200 means table exists, 404 means it doesn't
                return response.status_code == 200
            except Exception as e:
                print(f"Error checking if table {table_name} exists: {e}")
                return False
        
        # Create table if it doesn't exist
        if not check_table_exists("blog_posts"):
            try:
                # Create blog_posts table with SQL
                create_table_query = """
                CREATE TABLE IF NOT EXISTS blog_posts (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    title TEXT NOT NULL,
                    slug TEXT NOT NULL UNIQUE,
                    excerpt TEXT,
                    content TEXT NOT NULL,
                    image_url TEXT,
                    author TEXT,
                    published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                    is_published BOOLEAN DEFAULT false,
                    category TEXT
                );
                """
                
                sql_url = f"{supabase_url}/rest/v1/rpc/execute_sql"
                payload = {"query": create_table_query}
                
                response = requests.post(sql_url, headers=headers, json=payload)
                if response.status_code not in [200, 201]:
                    print(f"Error creating blog_posts table: {response.status_code} - {response.text}")
                    return BlogImportResponse(
                        success=False,
                        message=f"Błąd podczas tworzenia tabeli blog_posts: {response.text}",
                        imported_count=0
                    )
            except Exception as e:
                print(f"Exception creating blog_posts table: {e}")
                return BlogImportResponse(
                    success=False,
                    message=f"Błąd podczas tworzenia tabeli blog_posts: {str(e)}",
                    imported_count=0
                )
        
        # Import blog posts
        imported_count = 0
        insert_url = f"{supabase_url}/rest/v1/blog_posts"
        
        for post in blog_posts:
            try:
                # Ensure all posts have published_at and updated_at
                if not post.get('published_at'):
                    post['published_at'] = datetime.now(timezone.utc).isoformat()
                if not post.get('updated_at'):
                    post['updated_at'] = datetime.now(timezone.utc).isoformat()
                
                # Ensure each post has an ID
                if not post.get('id'):
                    post['id'] = str(uuid4())
                
                response = requests.post(insert_url, headers=headers, json=post)
                
                if response.status_code in [200, 201, 204]:
                    imported_count += 1
                    print(f"Successfully imported blog post: {post['title']}")
                else:
                    print(f"Error importing blog post: {post['title']} - {response.status_code} - {response.text}")
            except Exception as e:
                print(f"Exception importing blog post {post.get('title', 'unknown')}: {e}")
        
        if imported_count == 0:
            return BlogImportResponse(
                success=False,
                message="Nie udało się zaimportować żadnego wpisu na blog.",
                imported_count=0
            )
        elif imported_count < len(blog_posts):
            return BlogImportResponse(
                success=True,
                message=f"Częściowo zaimportowano wpisy na blog. Zaimportowano {imported_count} z {len(blog_posts)} wpisów.",
                imported_count=imported_count
            )
        else:
            return BlogImportResponse(
                success=True,
                message=f"Pomyślnie zaimportowano wszystkie {imported_count} wpisów na blog.",
                imported_count=imported_count
            )
    except Exception as e:
        print(f"Error importing blog posts: {e}")
        return BlogImportResponse(
            success=False,
            message=f"Błąd podczas importu wpisów na blog: {str(e)}",
            imported_count=0
        )

@router.get("/posts")
def get_blog_posts():
    try:
        # Get Supabase configuration
        supabase_config = db.storage.json.get("supabase_config", default={})
        if not supabase_config or not supabase_config.get("url") or not supabase_config.get("key"):
            return {"success": False, "message": "Konfiguracja Supabase nie została znaleziona.", "posts": []}
        
        # Use anon key for public reading
        supabase_url = supabase_config["url"]
        anon_key = supabase_config["key"]
        
        headers = {
            "apikey": anon_key,
            "Authorization": f"Bearer {anon_key}",
            "Content-Type": "application/json"
        }
        
        # Get all published blog posts ordered by published_at
        posts_url = f"{supabase_url}/rest/v1/blog_posts?select=*&is_published=eq.true&order=published_at.desc"
        response = requests.get(posts_url, headers=headers)
        
        if response.status_code == 200:
            posts = response.json()
            return {"success": True, "message": "Pobrano wpisy bloga.", "posts": posts}
        else:
            print(f"Error getting blog posts: {response.status_code} - {response.text}")
            return {"success": False, "message": f"Błąd podczas pobierania wpisów bloga: {response.text}", "posts": []}
    except Exception as e:
        print(f"Exception getting blog posts: {e}")
        return {"success": False, "message": f"Błąd podczas pobierania wpisów bloga: {str(e)}", "posts": []}

@router.get("/post/{slug}")
def get_blog_post_by_slug(slug: str):
    try:
        # Get Supabase configuration
        supabase_config = db.storage.json.get("supabase_config", default={})
        if not supabase_config or not supabase_config.get("url") or not supabase_config.get("key"):
            return {"success": False, "message": "Konfiguracja Supabase nie została znaleziona.", "post": None}
        
        # Use anon key for public reading
        supabase_url = supabase_config["url"]
        anon_key = supabase_config["key"]
        
        headers = {
            "apikey": anon_key,
            "Authorization": f"Bearer {anon_key}",
            "Content-Type": "application/json"
        }
        
        # Get the blog post by slug
        post_url = f"{supabase_url}/rest/v1/blog_posts?slug=eq.{slug}&limit=1"
        response = requests.get(post_url, headers=headers)
        
        if response.status_code == 200:
            posts = response.json()
            if len(posts) > 0:
                return {"success": True, "message": "Pobrano wpis bloga.", "post": posts[0]}
            else:
                return {"success": False, "message": "Nie znaleziono wpisu o podanym adresie URL.", "post": None}
        else:
            print(f"Error getting blog post: {response.status_code} - {response.text}")
            return {"success": False, "message": f"Błąd podczas pobierania wpisu bloga: {response.text}", "post": None}
    except Exception as e:
        print(f"Exception getting blog post: {e}")
        return {"success": False, "message": f"Błąd podczas pobierania wpisu bloga: {str(e)}", "post": None}
