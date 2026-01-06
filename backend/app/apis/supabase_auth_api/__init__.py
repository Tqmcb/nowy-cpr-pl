from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
import databutton as db
import supabase
import json
from typing import Optional

router = APIRouter(prefix="/auth")

# Models
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    metadata: Optional[dict] = None

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    user_id: str
    email: str
    metadata: Optional[dict] = None
    message: str

class LogoutResponse(BaseModel):
    success: bool
    message: str

# Helper function to get Supabase client
def get_supabase_client():
    try:
        # Get Supabase configuration from storage
        config = db.storage.json.get("supabase_config", default={})
        
        if not config or not config.get("url") or not config.get("key"):
            raise HTTPException(
                status_code=500,
                detail="Supabase not configured. Please set up Supabase configuration first."
            )
        
        # Create Supabase client
        client = supabase.create_client(config.get("url"), config.get("key"))
        return client
    
    except Exception as e:
        print(f"Error creating Supabase client: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to initialize Supabase client: {str(e)}"
        )

@router.post("/signup", response_model=AuthResponse)
async def signup_api(request: SignUpRequest):
    """
    Register a new user in Supabase.
    """
    try:
        client = get_supabase_client()
        
        # Sign up user
        auth_response = client.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": request.metadata or {}
            }
        })
        
        if auth_response.user is None:
            raise HTTPException(
                status_code=400, 
                detail="Failed to create user"
            )
        
        # Return user data and tokens
        return AuthResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            user_id=auth_response.user.id,
            email=auth_response.user.email,
            metadata=auth_response.user.user_metadata,
            message="User registered successfully"
        )
    
    except supabase.errors.APIError as e:
        error_message = str(e)
        if "User already registered" in error_message:
            raise HTTPException(
                status_code=409,
                detail="User with this email already exists"
            )
        raise HTTPException(
            status_code=400,
            detail=f"Supabase API error: {error_message}"
        )
    
    except Exception as e:
        print(f"Error in signup: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to register user: {str(e)}"
        )

@router.post("/login", response_model=AuthResponse)
async def login(request: SignInRequest):
    """
    Sign in an existing user.
    """
    try:
        client = get_supabase_client()
        
        # Sign in user
        auth_response = client.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        # Return user data and tokens
        return AuthResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            user_id=auth_response.user.id,
            email=auth_response.user.email,
            metadata=auth_response.user.user_metadata,
            message="Login successful"
        )
    
    except supabase.errors.AuthApiError as e:
        print(f"Auth API error: {e}")
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
    
    except Exception as e:
        print(f"Error in login: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/logout", response_model=LogoutResponse)
async def logout(jwt: Optional[str] = Header(None, alias="Authorization")):
    """
    Log out a user by invalidating their session.
    """
    if not jwt:
        raise HTTPException(
            status_code=401,
            detail="No authentication token provided"
        )
    
    # Remove 'Bearer ' prefix if present
    if jwt.startswith("Bearer "):
        jwt = jwt[7:]
    
    try:
        client = get_supabase_client()
        
        # Set the auth token manually
        client.auth.set_session(jwt, None)
        
        # Sign out
        client.auth.sign_out()
        
        return LogoutResponse(
            success=True,
            message="Logged out successfully"
        )
    
    except Exception as e:
        print(f"Error in logout: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Logout failed: {str(e)}"
        )

@router.get("/verify")
async def verify_auth_api(jwt: Optional[str] = Header(None, alias="Authorization")):
    """
    Verify a JWT token and return user information if valid.
    """
    if not jwt:
        raise HTTPException(
            status_code=401,
            detail="No authentication token provided"
        )
    
    # Remove 'Bearer ' prefix if present
    if jwt.startswith("Bearer "):
        jwt = jwt[7:]
    
    try:
        client = get_supabase_client()
        
        # Set the auth session
        client.auth.set_session(jwt, None)
        
        # Get user
        user = client.auth.get_user()
        
        if not user or not user.user:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired token"
            )
        
        return {
            "success": True,
            "user_id": user.user.id,
            "email": user.user.email,
            "metadata": user.user.user_metadata
        }
    
    except Exception as e:
        print(f"Error verifying token: {e}")
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
