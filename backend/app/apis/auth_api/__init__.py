from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional, Dict, Any
from pydantic import BaseModel
import databutton as db
import requests
import json
from datetime import datetime, timedelta

router = APIRouter()

# Models
class UserLogin(BaseModel):
    email: str
    password: str

class UserSignup(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class AuthResponse(BaseModel):
    success: bool
    message: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    user_id: Optional[str] = None
    email: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class TokenData(BaseModel):
    token: Optional[str] = None

def get_supabase_config():
    # Try to get from storage first
    try:
        supabase_config = db.storage.json.get("supabase_config", default={})
        if supabase_config and supabase_config.get("url") and supabase_config.get("key"):
            return {
                "url": supabase_config.get("url"),
                "key": supabase_config.get("key"),
                "service_role_key": supabase_config.get("service_role_key")
            }
    except Exception as e:
        print(f"Error getting Supabase config from storage: {str(e)}")
    
    # Try to get from secrets
    try:
        supabase_key = db.secrets.get("SUPABASE_KEY")
        if supabase_key:
            return {
                "url": "https://qiekotzsywbhuwnxxdda.supabase.co",
                "key": supabase_key,
                "service_role_key": None
            }
    except Exception as e:
        print(f"Error getting Supabase key from secrets: {str(e)}")
    
    # Return None if not found
    return None

@router.post("/signup", response_model=AuthResponse)
async def signup(user_data: UserSignup):
    config = get_supabase_config()
    if not config:
        raise HTTPException(status_code=500, detail="Supabase configuration not found")
    
    try:
        # Prepare request to Supabase
        headers = {
            "apikey": config["key"],
            "Content-Type": "application/json"
        }
        
        body = {
            "email": user_data.email,
            "password": user_data.password,
            "data": {}
        }
        
        if user_data.full_name:
            body["data"]["full_name"] = user_data.full_name
        
        response = requests.post(
            f"{config['url']}/auth/v1/signup",
            headers=headers,
            json=body
        )
        
        if response.status_code == 200:
            user = response.json()
            return AuthResponse(
                success=True,
                message="Rejestracja zakończona pomyślnie. Sprawdź swój email, aby potwierdzić konto.",
                user_id=user.get("id"),
                email=user.get("email"),
                metadata=user.get("user_metadata")
            )
        else:
            error_data = response.json()
            error_msg = error_data.get("message", "Unknown error")
            
            # Provide user-friendly error messages
            if "already registered" in error_msg.lower():
                error_msg = "Ten adres email jest już zarejestrowany."
            elif "password" in error_msg.lower():
                error_msg = "Hasło musi mieć co najmniej 6 znaków."
            
            return AuthResponse(
                success=False,
                message=error_msg
            )
    except Exception as e:
        print(f"Signup error: {str(e)}")
        return AuthResponse(
            success=False,
            message=f"Wystąpił błąd podczas rejestracji: {str(e)}"
        )

@router.post("/login", response_model=AuthResponse)
async def login(user_data: UserLogin):
    config = get_supabase_config()
    if not config:
        raise HTTPException(status_code=500, detail="Supabase configuration not found")
    
    try:
        # Prepare request to Supabase
        headers = {
            "apikey": config["key"],
            "Content-Type": "application/json"
        }
        
        body = {
            "email": user_data.email,
            "password": user_data.password,
        }
        
        response = requests.post(
            f"{config['url']}/auth/v1/token?grant_type=password",
            headers=headers,
            json=body
        )
        
        if response.status_code == 200:
            auth_data = response.json()
            return AuthResponse(
                success=True,
                message="Logowanie zakończone pomyślnie.",
                access_token=auth_data.get("access_token"),
                refresh_token=auth_data.get("refresh_token"),
                user_id=auth_data.get("user", {}).get("id"),
                email=auth_data.get("user", {}).get("email"),
                metadata=auth_data.get("user", {}).get("user_metadata")
            )
        else:
            # Check if this is a potential admin account that needs to be created
            if user_data.email.endswith('@multicert.pl'):
                try:
                    # Create admin account
                    signup_headers = {
                        "apikey": config["key"],
                        "Content-Type": "application/json"
                    }
                    
                    signup_body = {
                        "email": user_data.email,
                        "password": user_data.password,
                        "data": {"is_admin": True, "full_name": "Administrator"}
                    }
                    
                    signup_response = requests.post(
                        f"{config['url']}/auth/v1/signup",
                        headers=signup_headers,
                        json=signup_body
                    )
                    
                    if signup_response.status_code == 200:
                        # Try login again
                        login_response = requests.post(
                            f"{config['url']}/auth/v1/token?grant_type=password",
                            headers=headers,
                            json=body
                        )
                        
                        if login_response.status_code == 200:
                            auth_data = login_response.json()
                            return AuthResponse(
                                success=True,
                                message="Konto administratora utworzone i zalogowane pomyślnie.",
                                access_token=auth_data.get("access_token"),
                                refresh_token=auth_data.get("refresh_token"),
                                user_id=auth_data.get("user", {}).get("id"),
                                email=auth_data.get("user", {}).get("email"),
                                metadata=auth_data.get("user", {}).get("user_metadata")
                            )
                except Exception as admin_err:
                    print(f"Admin account creation error: {str(admin_err)}")
            
            # If we reach here, login failed
            error_msg = "Nieprawidłowy email lub hasło."
            return AuthResponse(
                success=False,
                message=error_msg
            )
    except Exception as e:
        print(f"Login error: {str(e)}")
        return AuthResponse(
            success=False,
            message=f"Wystąpił błąd podczas logowania: {str(e)}"
        )

@router.post("/logout")
async def logout(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return {"success": True, "message": "No active session"}
    
    token = authorization.replace("Bearer ", "")
    config = get_supabase_config()
    
    if not config:
        return {"success": False, "message": "Supabase configuration not found"}
    
    try:
        headers = {
            "apikey": config["key"],
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{config['url']}/auth/v1/logout",
            headers=headers
        )
        
        # Supabase returns 204 on successful logout
        if response.status_code == 204:
            return {"success": True, "message": "Wylogowano pomyślnie."}
        else:
            return {"success": False, "message": "Wystąpił błąd podczas wylogowywania."}
    except Exception as e:
        print(f"Logout error: {str(e)}")
        return {"success": False, "message": f"Wystąpił błąd podczas wylogowywania: {str(e)}"}

@router.post("/verify-auth")
async def verify_auth(token_data: TokenData):
    config = get_supabase_config()
    if not config:
        return {"success": False, "message": "Supabase configuration not found"}
    
    if not token_data.token:
        return {"success": False, "message": "No token provided"}
    
    try:
        headers = {
            "apikey": config["key"],
            "Authorization": f"Bearer {token_data.token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"{config['url']}/auth/v1/user",
            headers=headers
        )
        
        if response.status_code == 200:
            user_data = response.json()
            return {
                "success": True, 
                "message": "Token verified",
                "user_id": user_data.get("id"),
                "email": user_data.get("email"),
                "metadata": user_data.get("user_metadata")
            }
        else:
            return {"success": False, "message": "Invalid or expired token"}
    except Exception as e:
        print(f"Token verification error: {str(e)}")
        return {"success": False, "message": f"Error verifying token: {str(e)}"}

@router.get("/health-check")
async def health_check():
    return {"status": "ok", "message": "Auth API is healthy"}
