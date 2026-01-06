from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException
import databutton as db
import requests

# Create router
router = APIRouter()

# Models
class AuthResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

class UserData(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class SessionCheckResponse(BaseModel):
    is_authenticated: bool
    user: Optional[Dict[str, Any]] = None
    message: str = "Session check completed"
    
class VerifyAuthRequest(BaseModel):
    token: str

@router.post("/signup")
def signup(data: UserData) -> AuthResponse:
    try:
        # Get Supabase configuration from storage
        try:
            # Default values as fallback - hardcoded to ensure they work
            default_url = "https://qiekotzsywbhuwnxxdda.supabase.co"
            default_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZWtvdHpzeXdiaHV3bnh4ZGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4NzI5OTQsImV4cCI6MjAyNjQ0ODk5NH0.1Jh9SsvYMPvUvWOZY1Jmmu1dz4QF4xnxQiC1mQQRLMk"
            
            # First try to get from storage (this is where SupabaseConfig page stores it)
            supabase_config = db.storage.json.get("supabase_config", default={})
            
            # If not found in storage, try secrets as fallback
            if not supabase_config or not supabase_config.get("key"):
                try:
                    supabase_key = db.secrets.get("SUPABASE_KEY")
                    supabase_url = default_url
                    print("Using Supabase key from secrets")
                except Exception as e:
                    print(f"Error retrieving SUPABASE_KEY from secrets: {str(e)}")
                    # Użyj wartości domyślnych
                    supabase_key = default_key
                    supabase_url = default_url
                    print("Using default Supabase credentials")
            else:
                # Use from storage
                supabase_key = supabase_config.get("key")
                supabase_url = supabase_config.get("url")
                print(f"Using Supabase config from storage: URL={supabase_url}, Key={supabase_key[:15]}...")
        except Exception as e:
            print(f"Error retrieving Supabase config: {str(e)}")
            supabase_key = None
            supabase_url = None
        
        if not supabase_key:
            return AuthResponse(
                success=False,
                message="Brak konfiguracji Supabase. Skonfiguruj Supabase przed rejestracją."
            )
        
        # Prepare data for Supabase
        signup_data = {
            "email": data.email,
            "password": data.password,
            "data": {"full_name": data.full_name} if data.full_name else {}
        }
        
        # Call Supabase auth signup endpoint
        headers = {
            "apikey": supabase_key,
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{supabase_url}/auth/v1/signup",
            headers=headers,
            json=signup_data
        )
        
        # Handle response
        print(f"Supabase auth verify response status: {response.status_code}")
        if response.status_code == 200:
            user_data = response.json()
            return AuthResponse(
                success=True,
                message="Rejestracja przebiegła pomyślnie. Sprawdź swój email, aby potwierdzić konto.",
                data={"user": user_data}
            )
        else:
            error_msg = response.json().get("message", "Unknown error")
            if "unique constraint" in error_msg.lower():
                error_msg = "Ten adres email jest już zarejestrowany."
            elif "password" in error_msg.lower():
                error_msg = "Hasło musi mieć co najmniej 6 znaków."
                
            return AuthResponse(
                success=False,
                message=f"Błąd rejestracji: {error_msg}"
            )
            
    except Exception as e:
        print(f"Signup error: {e}")
        return AuthResponse(
            success=False,
            message=f"Wystąpił błąd podczas rejestracji: {str(e)}"
        )

@router.post("/signin", response_model=AuthResponse)
def signin(data: UserData) -> AuthResponse:
    print(f"Sign-in attempt for user: {data.email}")
    try:
        # Check if email ends with @multicert.pl - if so, we'll try to create admin account if login fails
        is_multicert_email = data.email.endswith('@multicert.pl')
        print(f"Is Multicert email: {is_multicert_email}")
        # Get Supabase configuration from storage
        try:
            # Default values as fallback - hardcoded to ensure they work
            default_url = "https://qiekotzsywbhuwnxxdda.supabase.co"
            default_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZWtvdHpzeXdiaHV3bnh4ZGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4NzI5OTQsImV4cCI6MjAyNjQ0ODk5NH0.1Jh9SsvYMPvUvWOZY1Jmmu1dz4QF4xnxQiC1mQQRLMk"
            
            # First try to get from storage (this is where SupabaseConfig page stores it)
            supabase_config = db.storage.json.get("supabase_config", default={})
            
            # If not found in storage, try secrets as fallback
            if not supabase_config or not supabase_config.get("key"):
                try:
                    supabase_key = db.secrets.get("SUPABASE_KEY")
                    supabase_url = default_url
                    print("Using Supabase key from secrets for signin")
                except Exception as e:
                    print(f"Error retrieving SUPABASE_KEY from secrets: {str(e)}")
                    # Użyj wartości domyślnych
                    supabase_key = default_key
                    supabase_url = default_url
                    print("Using default Supabase credentials for signin")
            else:
                # Use from storage
                supabase_key = supabase_config.get("key")
                supabase_url = supabase_config.get("url")
                print(f"Using Supabase config from storage for signin: URL={supabase_url}, Key={supabase_key[:15] if supabase_key else 'None'}...")
        except Exception as e:
            print(f"Error retrieving Supabase config: {str(e)}")
            supabase_key = None
            supabase_url = None
        
        if not supabase_key:
            return AuthResponse(
                success=False,
                message="Brak konfiguracji Supabase. Skonfiguruj Supabase przed logowaniem."
            )
        
        # Prepare data for Supabase
        signin_data = {
            "email": data.email,
            "password": data.password,
        }
        
        # Call Supabase auth signin endpoint
        headers = {
            "apikey": supabase_key,
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{supabase_url}/auth/v1/token?grant_type=password",
            headers=headers,
            json=signin_data
        )
        
        # Handle response
        if response.status_code == 200:
            auth_data = response.json()
            return AuthResponse(
                success=True,
                message="Logowanie pomyślne.",
                data=auth_data
            )
        elif is_multicert_email and response.status_code in [400, 401, 403, 404]:
            # Jeśli adres kończy się na @multicert.pl i logowanie się nie powiodło,
            # spróbujmy utworzyć konto administratora
            print(f"Attempting to create admin account for: {data.email}")
            
            # Sign up the user with the same credentials
            signup_data = {
                "email": data.email,
                "password": data.password,
                "data": {"is_admin": True, "full_name": "Administrator"}
            }
            
            signup_response = requests.post(
                f"{supabase_url}/auth/v1/signup",
                headers=headers,
                json=signup_data
            )
            
            if signup_response.status_code == 200:
                print(f"Created admin account for: {data.email}, trying to login now")
                
                # Try to login again with the same credentials
                login_retry = requests.post(
                    f"{supabase_url}/auth/v1/token?grant_type=password",
                    headers=headers,
                    json=signin_data
                )
                
                if login_retry.status_code == 200:
                    auth_data = login_retry.json()
                    return AuthResponse(
                        success=True,
                        message="Konto administratora utworzone i zalogowane pomyślnie.",
                        data=auth_data
                    )
            
            # If we get here, either account creation or second login attempt failed
            print(f"Failed to create or login to admin account: {signup_response.status_code}")
            error_msg = "Nie udało się utworzyć konta administratora. Skontaktuj się z administratorem systemu."
        else:
            error_msg = "Nieprawidłowy email lub hasło."
            try:
                if response.status_code == 400:
                    error_data = response.json()
                    if "email" in error_data.get("message", "").lower():
                        error_msg = "Nieprawidłowy format adresu email."
            except Exception as e:
                print(f"Error parsing response JSON: {e}")
                error_msg = f"Błąd podczas logowania: {response.status_code}"
                    
            return AuthResponse(
                success=False,
                message=error_msg
            )
            
    except Exception as e:
        print(f"Signin error: {e}")
        try:
            return AuthResponse(
                success=False,
                message=f"Wystąpił błąd podczas logowania: {str(e)}"
            )
        except Exception as final_e:
            # Ostateczna obręcz ratunkowa - zwróć słownik zamiast modelu Pydantic
            print(f"Final error handler triggered: {final_e}")
            # Ostateczna obręcz ratunkowa - krótszy komunikat o błędzie dla użytkownika, pełny dla logowania
            error_details = str(e)
            print(f"Critical login error details: {error_details}")
            return {
                "success": False,
                "message": "Wystąpił błąd podczas logowania. Spróbuj ponownie lub skontaktuj się z administratorem.",
                "data": None
            }

@router.post("/reset-password")
def reset_password(data: UserData) -> AuthResponse:
    try:
        # Get Supabase configuration from storage
        try:
            # Default values as fallback - hardcoded to ensure they work
            default_url = "https://qiekotzsywbhuwnxxdda.supabase.co"
            default_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZWtvdHpzeXdiaHV3bnh4ZGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4NzI5OTQsImV4cCI6MjAyNjQ0ODk5NH0.1Jh9SsvYMPvUvWOZY1Jmmu1dz4QF4xnxQiC1mQQRLMk"
            
            # First try to get from storage (this is where SupabaseConfig page stores it)
            supabase_config = db.storage.json.get("supabase_config", default={})
            
            # If not found in storage, try secrets as fallback
            if not supabase_config or not supabase_config.get("key"):
                try:
                    supabase_key = db.secrets.get("SUPABASE_KEY")
                    supabase_url = default_url
                    print("Using Supabase key from secrets for reset password")
                except Exception as e:
                    print(f"Error retrieving SUPABASE_KEY from secrets: {str(e)}")
                    # Użyj wartości domyślnych
                    supabase_key = default_key
                    supabase_url = default_url
                    print("Using default Supabase credentials for reset password")
            else:
                # Use from storage
                supabase_key = supabase_config.get("key")
                supabase_url = supabase_config.get("url")
                print(f"Using Supabase config from storage for reset password: URL={supabase_url}, Key={supabase_key[:15] if supabase_key else 'None'}...")
        except Exception as e:
            print(f"Error retrieving Supabase config: {str(e)}")
            supabase_key = None
            supabase_url = None
        
        if not supabase_key:
            return AuthResponse(
                success=False,
                message="Brak konfiguracji Supabase. Skonfiguruj Supabase przed resetowaniem hasła."
            )
        
        # Prepare data for Supabase
        reset_data = {
            "email": data.email,
        }
        
        # Call Supabase auth reset password endpoint
        headers = {
            "apikey": supabase_key,
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{supabase_url}/auth/v1/recover",
            headers=headers,
            json=reset_data
        )
        
        # Handle response - typically returns 200 even if email doesn't exist for security reasons
        if response.status_code == 200:
            return AuthResponse(
                success=True,
                message="Jeśli ten adres email istnieje w naszej bazie, otrzymasz link do zresetowania hasła."
            )
        else:
            return AuthResponse(
                success=False,
                message="Wystąpił błąd podczas wysyłania linku resetującego. Spróbuj ponownie później."
            )
            
    except Exception as e:
        print(f"Reset password error: {e}")
        return AuthResponse(
            success=False,
            message=f"Wystąpił błąd podczas resetowania hasła: {str(e)}"
        )

@router.get("/verify-auth")
def verify_auth_get() -> SessionCheckResponse:
    # This is a compatibility endpoint for older code
    return SessionCheckResponse(
        is_authenticated=False,
        message="Please use POST /verify-auth with token in body"
    )

@router.post("/verify-auth")
def verify_auth(data: VerifyAuthRequest) -> AuthResponse:
    print(f"Token verification request received: {data.token[:15]}..." if data.token else "No token provided")
    try:
        # Get Supabase configuration from storage
        try:
            # Default values as fallback - hardcoded to ensure they work
            default_url = "https://qiekotzsywbhuwnxxdda.supabase.co"
            default_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZWtvdHpzeXdiaHV3bnh4ZGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4NzI5OTQsImV4cCI6MjAyNjQ0ODk5NH0.1Jh9SsvYMPvUvWOZY1Jmmu1dz4QF4xnxQiC1mQQRLMk"
            
            # First try to get from storage (this is where SupabaseConfig page stores it)
            supabase_config = db.storage.json.get("supabase_config", default={})
            
            # If not found in storage, try secrets as fallback
            if not supabase_config or not supabase_config.get("key"):
                try:
                    supabase_key = db.secrets.get("SUPABASE_KEY")
                    supabase_url = default_url
                    print("Using Supabase key from secrets for verify auth")
                except Exception as e:
                    print(f"Error retrieving SUPABASE_KEY from secrets: {str(e)}")
                    # Użyj wartości domyślnych
                    supabase_key = default_key
                    supabase_url = default_url
                    print("Using default Supabase credentials for verify auth")
            else:
                # Use from storage
                supabase_key = supabase_config.get("key")
                supabase_url = supabase_config.get("url")
                print(f"Using Supabase config from storage for verify auth: URL={supabase_url}, Key={supabase_key[:15] if supabase_key else 'None'}...")
        except Exception as e:
            print(f"Error retrieving Supabase config: {str(e)}")
            return AuthResponse(
                success=False,
                message=f"Błąd pobierania konfiguracji Supabase: {str(e)}"
            )
        
        if not supabase_key:
            return AuthResponse(
                success=False,
                message="Brak konfiguracji Supabase. Skonfiguruj Supabase przed weryfikacją tokenu."
            )

        # First try to verify token via service role key if available
        service_role_key = supabase_config.get("service_role_key")
        if service_role_key:
            try:
                print("Attempting to verify token with service role key")
                admin_headers = {
                    "apikey": service_role_key,
                    "Authorization": f"Bearer {service_role_key}",
                    "Content-Type": "application/json"
                }
                
                admin_response = requests.get(
                    f"{supabase_url}/auth/v1/admin/users/{data.token}",
                    headers=admin_headers
                )
                
                if admin_response.status_code == 200:
                    user_data = admin_response.json()
                    print("Token verified using service role key")
                    return AuthResponse(
                        success=True,
                        message="Token ważny (zweryfikowany jako admin)",
                        data={"user": user_data}
                    )
                else:
                    print(f"Service role verification failed with status {admin_response.status_code}, trying standard verification")
            except Exception as e:
                print(f"Error in service role verification: {e}, trying standard verification")
        
        # Standard token verification
        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {data.token}",
            "Content-Type": "application/json"
        }
        
        print(f"Making request to Supabase with token: {data.token[:15]}..." if data.token else "No token provided")
        
        response = requests.get(
            f"{supabase_url}/auth/v1/user",
            headers=headers
        )
        
        # Handle response
        if response.status_code == 200:
            user_data = response.json()
            return AuthResponse(
                success=True,
                message="Token ważny",
                data={"user": user_data}
            )
        else:
            error_msg = "Token nieważny lub wygasł."
            return AuthResponse(
                success=False,
                message=error_msg
            )
    except Exception as e:
        print(f"Verify auth error: {e}")
        return AuthResponse(
            success=False,
            message=f"Wystąpił błąd podczas weryfikacji tokenu: {str(e)}"
        )

@router.get("/health-status")
def check_health_status() -> dict:
    return {"status": "ok", "message": "Auth API is working"}
