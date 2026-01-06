from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
import databutton as db
import httpx
import requests
import json

router = APIRouter()

class CreateAdminRequest(BaseModel):
    email: str
    password: str
    full_name: str = ''
    supabase_url: str = ''
    supabase_key: str = ''
    service_role_key: str = ''

class CreateAdminResponse(BaseModel):
    success: bool
    message: str

@router.post('/create-admin')
async def create_admin(body: CreateAdminRequest) -> CreateAdminResponse:
    print(f"Attempting to create admin account for {body.email}")
    # Prioritize keys from request, then config, then secrets
    supabase_url = None
    supabase_key = None
    
    # 1. First check if keys are provided in the request
    if body.service_role_key and body.supabase_url:  
        # Use service role key if provided (best option for admin operations)
        supabase_url = body.supabase_url
        supabase_key = body.service_role_key
        print(f"Using Supabase service role key from request: URL={supabase_url}, Key={supabase_key[:10] if supabase_key else 'None'}...")
    elif body.supabase_key and body.supabase_url:
        # Fall back to regular key from request
        supabase_url = body.supabase_url
        supabase_key = body.supabase_key
        print(f"Using Supabase key from request: URL={supabase_url}, Key={supabase_key[:10] if supabase_key else 'None'}...")
    else:    
        # 2. Try to get from storage
        try:
            supabase_config = db.storage.json.get("supabase_config", default={})
            if supabase_config and supabase_config.get("url"):
                supabase_url = supabase_config.get("url")
                
                # Try service_role_key first (needed for user creation)
                if supabase_config.get("service_role_key"):
                    supabase_key = supabase_config.get("service_role_key")
                    print(f"Using Supabase service role key from storage: URL={supabase_url}, Key={supabase_key[:10] if supabase_key else 'None'}...")
                # Fall back to regular key
                elif supabase_config.get("key"):    
                    supabase_key = supabase_config.get("key")
                    print(f"Using Supabase anon key from storage: URL={supabase_url}, Key={supabase_key[:10] if supabase_key else 'None'}...")
            else:
                # 3. Try to get from secrets as fallback
                supabase_key = db.secrets.get('SUPABASE_KEY')
                supabase_url = 'https://qiekotzsywbhuwnxxdda.supabase.co'
                print("Using Supabase key from secrets")
        except Exception as e:
            print(f"Error retrieving Supabase config: {e}")
            supabase_key = None
            supabase_url = None
    
    if not supabase_key:
        return CreateAdminResponse(
            success=False,
            message="Klucz Supabase nie jest skonfigurowany. Proszę skonfigurować go w ustawieniach aplikacji."
        )
    
    try:
        # Create user via Supabase Admin API
        # Make sure URL has https:// prefix
        if not supabase_url.startswith('http'):
            supabase_url = f"https://{supabase_url}"
            
        url = f"{supabase_url}/auth/v1/admin/users"
        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        user_data = {
            "email": body.email,
            "password": body.password,
            "email_confirm": True,  # Auto-confirm email
            "user_metadata": {
                "full_name": body.full_name,
                "is_admin": True
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers=headers,
                json=user_data
            )
            
            # If the response is HTML instead of JSON, it's likely an error
            if response.headers.get('content-type', '').startswith('text/html'):
                print(f"Error: Received HTML response instead of JSON. Status code: {response.status_code}")
                return CreateAdminResponse(
                    success=False,
                    message="Błąd połączenia z Supabase: Otrzymano odpowiedź HTML zamiast JSON. Sprawdź konfigurację."
                )
            
        if response.status_code not in [200, 201]:
            return CreateAdminResponse(
                success=False,
                message=f"Błąd tworzenia konta administratora: {response.status_code} - {response.text}"
            )
        
        # Check if profiles table exists, if not create it
        try:
            # First check if table exists
            check_table_url = f"{supabase_url}/rest/v1/profiles?limit=1"
            table_check_response = requests.get(
                check_table_url,
                headers={
                    "apikey": supabase_key,
                    "Authorization": f"Bearer {supabase_key}"
                }
            )
            
            # If table doesn't exist (404), create it
            if table_check_response.status_code == 404:
                print("Profiles table doesn't exist, creating it...")
                sql = """
                CREATE TABLE IF NOT EXISTS profiles (
                    id UUID PRIMARY KEY REFERENCES auth.users(id),
                    full_name TEXT,
                    email TEXT UNIQUE NOT NULL,
                    is_admin BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                """
                
                sql_url = f"{supabase_url}/rest/v1/rpc/execute_sql"
                sql_headers = {
                    "apikey": supabase_key,
                    "Authorization": f"Bearer {supabase_key}",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                }
                
                sql_payload = {"query": sql, "params": []}
                sql_response = requests.post(sql_url, headers=sql_headers, json=sql_payload)
                
                if sql_response.status_code not in [200, 201]:
                    print(f"Error creating profiles table: {sql_response.status_code} - {sql_response.text}")
        except Exception as e:
            print(f"Error checking/creating profiles table: {str(e)}")
        
        # Now, create an entry in the 'profiles' table
        try:
            profiles_url = f"{supabase_url}/rest/v1/profiles"
            
            user_id = response.json().get("id")
            profile_data = {
                "id": user_id,
                "full_name": body.full_name,
                "email": body.email,
                "is_admin": True
            }
            
            async with httpx.AsyncClient() as client:
                profile_response = await client.post(
                    profiles_url,
                    headers=headers,
                    json=profile_data
                )
                
            if profile_response.status_code not in [200, 201]:
                print(f"Warning: Failed to create profile for admin: {profile_response.status_code} - {profile_response.text}")
        except Exception as e:
            print(f"Error creating profile: {str(e)}")
        
        return CreateAdminResponse(
            success=True,
            message="Konto administratora zostało utworzone pomyślnie. Możesz się teraz zalogować."
        )
            
    except Exception as e:
        print(f"Błąd podczas tworzenia konta administratora: {str(e)}")
        return CreateAdminResponse(
            success=False,
            message=f"Błąd podczas tworzenia konta administratora: {str(e)}"
        )
