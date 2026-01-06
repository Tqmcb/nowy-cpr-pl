from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import APIKeyHeader
import databutton as db
from datetime import datetime
import uuid
import re

# Create router
router = APIRouter()

# Admin key security
API_KEY_NAME = "X-Admin-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

# Storage key for blog posts
BLOG_POSTS_STORAGE_KEY = "blog_posts"

# Models
class BlogPost(BaseModel):
    id: Optional[str] = None
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

class BlogPostCreate(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = ""
    image_url: Optional[str] = ""
    author: Optional[str] = "Zespół Multicert"
    is_published: Optional[bool] = True
    category: Optional[str] = "Ogólne"

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    author: Optional[str] = None
    is_published: Optional[bool] = None
    category: Optional[str] = None

class BlogPostResponse(BaseModel):
    success: bool
    message: str
    post: Optional[Dict[str, Any]] = None

class BlogPostsResponse(BaseModel):
    success: bool
    message: str
    posts: List[Dict[str, Any]] = []

class BlogAdminKeyRequest(BaseModel):
    admin_key: str

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

# Helper function to create slug from title
def create_slug(title: str) -> str:
    # Convert to lowercase, replace spaces with hyphens, and remove non-alphanumeric characters
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[\s_]+', '-', slug)
    return slug

# Helper function to get blog posts
def get_all_blog_posts():
    try:
        posts = db.storage.json.get(BLOG_POSTS_STORAGE_KEY, default=[])
        return posts
    except Exception as e:
        print(f"Error getting blog posts: {e}")
        return []

# Helper function to save blog posts
def save_blog_posts(posts):
    try:
        db.storage.json.put(BLOG_POSTS_STORAGE_KEY, posts)
        return True
    except Exception as e:
        print(f"Error saving blog posts: {e}")
        return False

@router.get("/local-posts", response_model=BlogPostsResponse)
def get_blog_posts(
    category: Optional[str] = None,
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    published_only: bool = True
):
    try:
        # Get all blog posts
        all_posts = get_all_blog_posts()
        
        # Filter by category if provided
        if category:
            filtered_posts = [p for p in all_posts if p.get("category") == category]
        else:
            filtered_posts = all_posts
        
        # Filter by published status if needed
        if published_only:
            filtered_posts = [p for p in filtered_posts if p.get("is_published", True)]
        
        # Sort by published_at (newest first)
        sorted_posts = sorted(
            filtered_posts, 
            key=lambda x: x.get("published_at", ""), 
            reverse=True
        )
        
        # Apply pagination
        paginated_posts = sorted_posts[offset:offset + limit]
        
        return BlogPostsResponse(
            success=True,
            message=f"Znaleziono {len(filtered_posts)} wpisów.",
            posts=paginated_posts
        )
    except Exception as e:
        print(f"Error getting blog posts: {e}")
        return BlogPostsResponse(
            success=False,
            message=f"Błąd podczas pobierania wpisów: {str(e)}",
            posts=[]
        )

@router.get("/local-post/{slug}", response_model=BlogPostResponse)
def get_blog_post_by_slug(slug: str):
    try:
        # Get all blog posts
        all_posts = get_all_blog_posts()
        
        # Find the post with the matching slug
        post = next((p for p in all_posts if p.get("slug") == slug), None)
        
        if post is None:
            return BlogPostResponse(
                success=False,
                message="Nie znaleziono wpisu o podanym adresie URL."
            )
        
        return BlogPostResponse(
            success=True,
            message="Znaleziono wpis.",
            post=post
        )
    except Exception as e:
        print(f"Error getting blog post: {e}")
        return BlogPostResponse(
            success=False,
            message=f"Błąd podczas pobierania wpisu: {str(e)}"
        )

@router.post("/local-post", response_model=BlogPostResponse)
def create_blog_post(post: BlogPostCreate, authenticated: bool = Depends(verify_admin_key)):
    try:
        # Get all blog posts
        all_posts = get_all_blog_posts()
        
        # Generate a slug if not provided
        slug = create_slug(post.title)
        
        # Check if a post with this slug already exists
        if any(p.get("slug") == slug for p in all_posts):
            # Add a unique identifier to the slug
            slug = f"{slug}-{len(all_posts) + 1}"
        
        # Create a new post
        current_time = datetime.now().isoformat()
        new_post = {
            "id": str(uuid.uuid4()),
            "title": post.title,
            "slug": slug,
            "excerpt": post.excerpt,
            "content": post.content,
            "image_url": post.image_url,
            "author": post.author,
            "published_at": current_time,
            "updated_at": current_time,
            "is_published": post.is_published,
            "category": post.category
        }
        
        # Add the new post to the list
        all_posts.append(new_post)
        
        # Save the updated list
        if save_blog_posts(all_posts):
            return BlogPostResponse(
                success=True,
                message="Wpis został utworzony pomyślnie.",
                post=new_post
            )
        else:
            return BlogPostResponse(
                success=False,
                message="Błąd podczas zapisywania wpisu."
            )
    except Exception as e:
        print(f"Error creating blog post: {e}")
        return BlogPostResponse(
            success=False,
            message=f"Błąd podczas tworzenia wpisu: {str(e)}"
        )

@router.put("/local-post/{post_id}", response_model=BlogPostResponse)
def update_blog_post(post_id: str, post_update: BlogPostUpdate, authenticated: bool = Depends(verify_admin_key)):
    try:
        # Get all blog posts
        all_posts = get_all_blog_posts()
        
        # Find the post with the matching ID
        post_index = next((i for i, p in enumerate(all_posts) if p.get("id") == post_id), None)
        
        if post_index is None:
            return BlogPostResponse(
                success=False,
                message="Nie znaleziono wpisu o podanym ID."
            )
        
        # Get the existing post
        existing_post = all_posts[post_index]
        
        # Update the fields that were provided
        updated_post = {**existing_post}
        if post_update.title is not None:
            updated_post["title"] = post_update.title
        if post_update.content is not None:
            updated_post["content"] = post_update.content
        if post_update.excerpt is not None:
            updated_post["excerpt"] = post_update.excerpt
        if post_update.image_url is not None:
            updated_post["image_url"] = post_update.image_url
        if post_update.author is not None:
            updated_post["author"] = post_update.author
        if post_update.is_published is not None:
            updated_post["is_published"] = post_update.is_published
        if post_update.category is not None:
            updated_post["category"] = post_update.category
        
        # Update the updated_at time
        updated_post["updated_at"] = datetime.now().isoformat()
        
        # Replace the post in the list
        all_posts[post_index] = updated_post
        
        # Save the updated list
        if save_blog_posts(all_posts):
            return BlogPostResponse(
                success=True,
                message="Wpis został zaktualizowany pomyślnie.",
                post=updated_post
            )
        else:
            return BlogPostResponse(
                success=False,
                message="Błąd podczas zapisywania zaktualizowanego wpisu."
            )
    except Exception as e:
        print(f"Error updating blog post: {e}")
        return BlogPostResponse(
            success=False,
            message=f"Błąd podczas aktualizowania wpisu: {str(e)}"
        )

@router.delete("/local-post/{post_id}", response_model=BlogPostResponse)
def delete_blog_post(post_id: str, authenticated: bool = Depends(verify_admin_key)):
    try:
        # Get all blog posts
        all_posts = get_all_blog_posts()
        
        # Find the post with the matching ID
        post_index = next((i for i, p in enumerate(all_posts) if p.get("id") == post_id), None)
        
        if post_index is None:
            return BlogPostResponse(
                success=False,
                message="Nie znaleziono wpisu o podanym ID."
            )
        
        # Remove the post from the list
        deleted_post = all_posts.pop(post_index)
        
        # Save the updated list
        if save_blog_posts(all_posts):
            return BlogPostResponse(
                success=True,
                message="Wpis został usunięty pomyślnie.",
                post=deleted_post
            )
        else:
            return BlogPostResponse(
                success=False,
                message="Błąd podczas zapisywania zaktualizowanej listy wpisów."
            )
    except Exception as e:
        print(f"Error deleting blog post: {e}")
        return BlogPostResponse(
            success=False,
            message=f"Błąd podczas usuwania wpisu: {str(e)}"
        )

@router.post("/import-sample-posts", response_model=BlogPostsResponse)
def import_sample_posts(admin_data: BlogAdminKeyRequest, authenticated: bool = Depends(verify_admin_key)):
    try:
        # Pobierz przykładowe wpisy bloga
        try:
            sample_posts = db.storage.json.get("sample_blog_posts", default=[])
            if not sample_posts:
                return BlogPostsResponse(
                    success=False,
                    message="Nie znaleziono przykładowych wpisów bloga w storage."
                )
        except Exception as e:
            print(f"Błąd pobierania przykładowych wpisów: {e}")
            return BlogPostsResponse(
                success=False,
                message=f"Błąd pobierania przykładowych wpisów: {str(e)}"
            )
            
        # Get existing posts
        existing_posts = get_all_blog_posts()
        
        # Add current time to posts and generate IDs if missing
        current_time = datetime.now().isoformat()
        processed_posts = []
        slugs = [p.get("slug") for p in existing_posts]
        
        for post in sample_posts:
            # Generate ID if missing
            if "id" not in post:
                post["id"] = str(uuid.uuid4())
                
            # Add timestamps if missing
            if "published_at" not in post:
                post["published_at"] = current_time
            if "updated_at" not in post:
                post["updated_at"] = current_time
                
            # Ensure unique slug
            if "slug" not in post:
                post["slug"] = create_slug(post["title"])
                
            # Make slug unique if it already exists
            original_slug = post["slug"]
            counter = 1
            while post["slug"] in slugs:
                post["slug"] = f"{original_slug}-{counter}"
                counter += 1
                
            slugs.append(post["slug"])
            processed_posts.append(post)
            
        # Merge with existing posts (avoiding duplicates by ID)
        existing_ids = [p.get("id") for p in existing_posts]
        new_posts = [p for p in processed_posts if p.get("id") not in existing_ids]
        combined_posts = existing_posts + new_posts
        
        # Save all posts
        if save_blog_posts(combined_posts):
            return BlogPostsResponse(
                success=True,
                message=f"Zaimportowano {len(new_posts)} nowych wpisów bloga.",
                posts=new_posts
            )
        else:
            return BlogPostsResponse(
                success=False,
                message="Błąd podczas zapisywania wpisów."
            )
    except Exception as e:
        print(f"Error importing sample posts: {e}")
        return BlogPostsResponse(
            success=False,
            message=f"Błąd podczas importowania przykładowych wpisów: {str(e)}"
        )