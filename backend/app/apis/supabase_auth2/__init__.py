# Plik wyłączony z użycia - korzystaj z supabase_auth_fixed
# Ten plik powoduje duplikację endpointów

from fastapi import APIRouter

# Tworzymy pusty router, żeby nie generować endpointów
# Nie usuwamy pliku, bo może być używany w innych miejscach
router = APIRouter(include_in_schema=False)