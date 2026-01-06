from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import databutton as db
from supabase import create_client, Client

# Router for endpoints
router = APIRouter()

# Initialize Supabase client
def get_supabase_client():
    try:
        # Get config from storage first
        supabase_config = db.storage.json.get("supabase_config", default={})
        
        # If not found in storage, try secrets
        if not supabase_config or not supabase_config.get("url") or not supabase_config.get("key"):
            try:
                supabase_url = db.secrets.get("SUPABASE_API_URL")
                supabase_key = db.secrets.get("SUPABASE_API_KEY")
                if not supabase_url or not supabase_key:
                    raise ValueError("Supabase credentials not found in secrets")
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Supabase configuration not found: {str(e)}"
                )
        else:
            supabase_url = supabase_config.get("url")
            supabase_key = supabase_config.get("key")
            
        # Create client
        return create_client(supabase_url, supabase_key)
    except Exception as e:
        print(f"Error creating Supabase client: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to initialize Supabase client: {str(e)}"
        )

# Define Pydantic models
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str


class SignUpResponse(BaseModel):
    message: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    message: str
    session_token: str | None
    user_data: dict | None


class LogoutRequest(BaseModel):
    session_token: str


class LogoutResponse(BaseModel):
    message: str


# Create Log In endpoint
@router.post("/log-in", response_model=LoginResponse)
def log_in(body: LoginRequest):
    try:
        supabase = get_supabase_client()
        response = supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})
        if response.user is None:
            raise HTTPException(status_code=400, detail="Invalid login credentials.")
        session_token = response.session.access_token if response.session else None
        user_data = response.user.__dict__
        return LoginResponse(
            message="User logged in successfully.",
            session_token=session_token,
            user_data=user_data,
        )
    except Exception as e:
        print(f"Error during login: {str(e)}")  # Log the detailed error message
        raise HTTPException(status_code=500, detail=str(e))


# Create Sign Up endpoint
@router.post("/sign-up", response_model=SignUpResponse)
def sign_up(body: SignUpRequest):
    try:
        supabase = get_supabase_client()
        response = supabase.auth.sign_up({"email": body.email, "password": body.password})
        if response.user is None:
            raise HTTPException(status_code=400, detail="User creation failed.")
        return SignUpResponse(message="User created successfully.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Create Log Out endpoint
@router.post("/log-out", response_model=LogoutResponse)
def log_out(body: LogoutRequest):
    try:
        supabase = get_supabase_client()
        # Set the session manually first
        supabase.auth.set_session(body.session_token, None)
        # Then sign out
        response = supabase.auth.sign_out()
        print("Sign out response:", response)
        return LogoutResponse(message="User logged out successfully.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Health check endpoint
@router.get("/health")
def health_check():
    return {"status": "ok", "message": "Supabase auth API is working"}
