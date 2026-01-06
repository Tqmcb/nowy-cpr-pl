from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
import databutton as db
import os
import httpx

router = APIRouter()

class CheckAuthRequest(BaseModel):
    email: str

class CheckAuthResponse(BaseModel):
    exists: bool
    message: str

@router.post('/check-auth2')
async def check_auth2(body: CheckAuthRequest) -> CheckAuthResponse:
    # Get Supabase configuration from storage first, then fallback to secrets
    try:
        supabase_config = db.storage.json.get("supabase_config", default={})
        if supabase_config and supabase_config.get("url") and supabase_config.get("service_role_key"):
            supabase_url = supabase_config.get("url")
            supabase_key = supabase_config.get("service_role_key")
            print("Using Supabase service role key from storage config")
        elif supabase_config and supabase_config.get("url") and supabase_config.get("key"):
            supabase_url = supabase_config.get("url")
            supabase_key = supabase_config.get("key")
            print("Using Supabase anon key from storage config")
        else:
            # Fallback to secrets
            supabase_key = db.secrets.get('SUPABASE_KEY')
            supabase_url = 'https://qiekotzsywbhuwnxxdda.supabase.co'
            print("Using Supabase key from secrets")
    except Exception as e:
        print(f"Error getting Supabase config: {e}")
        # Fallback to secrets
        supabase_key = db.secrets.get('SUPABASE_KEY')
        supabase_url = 'https://qiekotzsywbhuwnxxdda.supabase.co'
    
    if not supabase_key:
        return CheckAuthResponse(
            exists=False,
            message="Klucz Supabase nie jest skonfigurowany. Proszę skonfigurować go w ustawieniach aplikacji."
        )
    
    # Check if user exists in Supabase
    try:
        # Admin API request to check if user exists
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
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers=headers,
                params={"email": body.email}
            )
            
            # If the response is HTML instead of JSON, it's likely an error
            if response.headers.get('content-type', '').startswith('text/html'):
                print(f"Error: Received HTML response instead of JSON. Status code: {response.status_code}")
                return CheckAuthResponse(
                    exists=False,
                    message="Błąd połączenia z Supabase: Otrzymano odpowiedź HTML zamiast JSON. Sprawdź konfigurację."
                )
            
        if response.status_code != 200:
            return CheckAuthResponse(
                exists=False,
                message=f"Błąd połączenia z Supabase: {response.status_code} - {response.text}"
            )
            
        users = response.json()
        if not users or len(users) == 0:
            return CheckAuthResponse(
                exists=False,
                message="Konto użytkownika nie istnieje. Należy się zarejestrować."
            )
        
        return CheckAuthResponse(
            exists=True,
            message="Konto użytkownika istnieje. Jeśli nie możesz się zalogować, sprawdź czy hasło jest poprawne lub zresetuj hasło."
        )
            
    except Exception as e:
        print(f"Błąd podczas weryfikacji konta: {str(e)}")
        return CheckAuthResponse(
            exists=False,
            message=f"Błąd podczas weryfikacji konta: {str(e)}"
        )
