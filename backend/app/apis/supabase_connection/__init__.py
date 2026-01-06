from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from supabase import create_client
import databutton as db

router = APIRouter()

# Model danych dla zapytania testującego połączenie
class SupabaseConnectionRequest(BaseModel):
    supabase_url: str
    supabase_anon_key: str

# Model odpowiedzi dla zapytania testującego połączenie
class SupabaseConnectionResponse(BaseModel):
    success: bool
    message: str
    tables_count: int = 0

@router.post("/check-supabase-connection")
def check_supabase_connection_status(request: SupabaseConnectionRequest) -> SupabaseConnectionResponse:
    """Sprawdza połączenie z bazą danych Supabase używając podanych parametrów"""
    try:
        # Sanityzuj URL
        url = request.supabase_url
        if not url.startswith('http'):
            url = f"https://{url}"
            
        # Stwórz klienta Supabase z podanymi parametrami
        supabase = create_client(url, request.supabase_anon_key)
        
        # Spróbuj wykonać proste zapytanie, aby sprawdzić połączenie
        # Próbujemy znaleźć tabelę product_categories, ale możemy sprawdzić kilka innych tabel
        tables_to_check = [
            'product_categories',
            'product_requirements',
            'blog_posts',
            'documents'
        ]
        
        total_tables = 0
        found_tables = []
        
        for table in tables_to_check:
            try:
                # Wykonaj zapytanie tylko o liczbę rekordów (head=True)
                response = supabase.table(table).select("count", count="exact").limit(1).execute()
                if not response.error:
                    total_tables += 1
                    found_tables.append(table)
            except Exception as table_error:
                print(f"Nie można sprawdzić tabeli {table}: {str(table_error)}")
                continue
        
        # Jeśli znaleziono przynajmniej jedną tabelę, uznaj połączenie za udane
        if total_tables > 0:
            tables_str = ", ".join(found_tables)
            return SupabaseConnectionResponse(
                success=True,
                message=f"Połączenie udane. Znaleziono tabele: {tables_str}",
                tables_count=total_tables
            )
        else:
            # Jeśli nie znaleziono żadnej tabeli, wykonaj jeszcze jedno proste zapytanie
            # aby sprawdzić, czy w ogóle można połączyć się z Supabase
            try:
                # Pobierz listę tabel
                response = supabase.rpc('get_schema_names').execute()
                if not response.error:
                    return SupabaseConnectionResponse(
                        success=True,
                        message="Połączenie udane, ale nie znaleziono wymaganych tabel. Konieczne może być zaimportowanie danych.",
                        tables_count=0
                    )
            except Exception as rpc_error:
                print(f"Nie można wykonać RPC: {str(rpc_error)}")
            
            # Jeśli nawet to się nie udało, zwróć informację o niepowodzeniu
            return SupabaseConnectionResponse(
                success=False,
                message="Połączenie udane, ale baza danych nie zawiera wymaganych tabel. Konieczne jest zaimportowanie danych.",
                tables_count=0
            )
    
    except Exception as e:
        # W przypadku błędu zwróć informację o niepowodzeniu
        error_message = str(e)
        print(f"Błąd podczas testowania połączenia z Supabase: {error_message}")
        
        # Dodaj przyjazny dla użytkownika komunikat błędu
        user_message = "Nie udało się połączyć z bazą danych Supabase. "
        
        if "JWT" in error_message or "token" in error_message.lower():
            user_message += "Sprawdź poprawność klucza API."
        elif "Invalid URL" in error_message or "URLError" in error_message:
            user_message += "Sprawdź poprawność adresu URL."
        elif "Connection refused" in error_message:
            user_message += "Serwer odrzucił połączenie. Sprawdź, czy serwis Supabase jest dostępny."
        elif "Timeout" in error_message:
            user_message += "Przekroczono czas oczekiwania na odpowiedź. Sprawdź połączenie internetowe."
        else:
            user_message += f"Szczegóły błędu: {error_message}"
        
        return SupabaseConnectionResponse(
            success=False,
            message=user_message,
            tables_count=0
        )
