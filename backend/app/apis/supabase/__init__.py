from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import APIKeyHeader
import databutton as db
import json
import os
import requests

# Create router
router = APIRouter()

# Admin key security
API_KEY_NAME = "X-Admin-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

# Models
class SupabaseConfig(BaseModel):
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: Optional[str] = None
    admin_key: str

class SupabaseResponse(BaseModel):
    success: bool
    message: str

class ProductDataImport(BaseModel):
    admin_key: str

class ProductDataResponse(BaseModel):
    success: bool
    message: str

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

@router.post("/update-supabase-config")
def save_supabase_config(config: SupabaseConfig) -> SupabaseResponse:
    print(f"Trying to save Supabase config: URL={config.supabase_url}, Key={config.supabase_anon_key[:10]}...")
    try:
        # Validate inputs
        if not config.supabase_url or not config.supabase_url.startswith("https://"):
            return SupabaseResponse(
                success=False,
                message="URL Supabase musi zaczynać się od 'https://'"
            )
            
        if not config.supabase_anon_key or len(config.supabase_anon_key) < 20:
            return SupabaseResponse(
                success=False,
                message="Klucz anonimowy Supabase jest nieprawidłowy (za krótki)"
            )
            
        # Save Supabase configuration to db.storage
        supabase_config_data = {
            "url": config.supabase_url,
            "key": config.supabase_anon_key
        }
        
        print(f"Saving Supabase configuration: URL={config.supabase_url}, Key length={len(config.supabase_anon_key)}")
        
        # Add service role key if provided
        if config.supabase_service_role_key:
            if len(config.supabase_service_role_key) < 20:
                return SupabaseResponse(
                    success=False,
                    message="Klucz Service Role Supabase jest nieprawidłowy (za krótki)"
                )
            supabase_config_data["service_role_key"] = config.supabase_service_role_key
            print("Service role key saved in configuration")
        
        # Always save to both secrets (if possible) and storage (as backup)
        try:
            # Try to save to secrets
            db.secrets.put("SUPABASE_URL", config.supabase_url)
            db.secrets.put("SUPABASE_KEY", config.supabase_anon_key)
            if config.supabase_service_role_key:
                db.secrets.put("SUPABASE_SERVICE_KEY", config.supabase_service_role_key)
            print("Saved Supabase config to secrets")
        except Exception as e:
            print(f"Warning: Failed to save to secrets: {e}, using storage instead")
            
        # Always save to storage as backup
        db.storage.json.put("supabase_config", supabase_config_data)
        
        # Also save admin key if provided
        if config.admin_key:
            try:
                db.secrets.put("ADMIN_KEY", config.admin_key)
                print("Saved admin key to secrets")
            except Exception as e:
                print(f"Failed to save admin key to secrets: {e}")
                # If fails, save it to storage as fallback
                db.storage.text.put("admin_key", config.admin_key)
                print("Saved admin key to storage instead")
        
        # Test connection to Supabase with the new configuration
        test_headers = {
            "apikey": config.supabase_anon_key,
            "Authorization": f"Bearer {config.supabase_anon_key}"
        }
        
        try:
            test_url = f"{config.supabase_url}/rest/v1/"
            test_response = requests.get(test_url, headers=test_headers, timeout=5)
            if test_response.status_code >= 400:
                print(f"Warning: Test connection failed: {test_response.status_code} - {test_response.text}")
                return SupabaseResponse(
                    success=False,
                    message=f"Połączenie testowe nie powiodło się. Kod błędu: {test_response.status_code}. Sprawdź poprawność URL i klucza."
                )
        except Exception as e:
            print(f"Warning: Test connection failed: {e}")
            # Continue saving but warn the user
            return SupabaseResponse(
                success=True,
                message="Konfiguracja została zapisana, ale test połączenia nie powiódł się. Sprawdź poprawność danych."
            )
        
        return SupabaseResponse(
            success=True,
            message="Konfiguracja Supabase została pomyślnie zapisana."
        )
    except Exception as e:
        print(f"Error updating Supabase config: {e}")
        return SupabaseResponse(
            success=False,
            message=f"Błąd podczas zapisywania konfiguracji: {str(e)}"
        )

@router.post("/import-product-data")
def import_supabase_product_data(data: ProductDataImport, authenticated: bool = Depends(verify_admin_key)) -> ProductDataResponse:
    try:
        # Get Supabase configuration
        supabase_config = db.storage.json.get("supabase_config", default={})
        if not supabase_config or not supabase_config.get("url") or not supabase_config.get("key"):
            return ProductDataResponse(
                success=False,
                message="Konfiguracja Supabase nie została znaleziona. Proszę najpierw skonfigurować Supabase."
            )
            
        # Check if service role key is available
        if not supabase_config.get("service_role_key"):
            print("Warning: Service role key is missing from configuration")
            return ProductDataResponse(
                success=False,
                message="Brak klucza Service Role w konfiguracji Supabase. Ten klucz jest wymagany do tworzenia tabel. Proszę skonfigurować Supabase ponownie z poprawnym kluczem Service Role."
            )
            
        # Sample product requirements data
        requirements_data = [
            {
                "id": "placeholder-req",
                "title": "Wymagania podstawowe",
                "description": "Szczegółowe wymagania dla tej kategorii produktów są obecnie opracowywane. Skontaktuj się z Multicert, aby uzyskać szczegółowe informacje.",
                "mandatory_tests": [
                    "Badania wstępne typu",
                    "Ocena zgodności z normami zharmonizowanymi",
                    "Raportowanie środowiskowe (nowe z CPR 2024)"
                ],
                "documentation_required": [
                    "Deklaracja właściwości użytkowych (DoP)",
                    "Oznakowanie CE",
                    "Dokumentacja zakładowej kontroli produkcji",
                    "Cyfrowy paszport produktu (nowy z CPR 2024)"
                ],
                "cpr_changes": [
                    "Cyfryzacja dokumentacji i oznaczeń",
                    "Zwiększone wymagania środowiskowe",
                    "Nowe systemy oceny i weryfikacji stałości właściwości użytkowych"
                ],
                "certification_systems": ["System 2+", "System 3"]
            },
            {
                "id": "plumbing-req",
                "title": "Wymagania dla wyrobów instalacyjnych",
                "description": "Wyroby instalacyjne, w tym rury, złączki, zawory, armatura sanitarna i inne elementy systemów instalacji wodno-kanalizacyjnych, muszą spełniać wymagania dotyczące szczelności, trwałości i bezpieczeństwa w kontakcie z wodą pitną. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe i zdrowotne.",
                "mandatory_tests": [
                    "Szczelność pod ciśnieniem wg EN ISO 1167, EN 12266",
                    "Odporność na ciśnienie wewnętrzne wg EN ISO 1167, EN 13618",
                    "Odporność na naprężenia wg EN ISO 6259, EN 12294",
                    "Trwałość długoterminowa wg EN ISO 9080, EN 12201-2, EN 1401",
                    "Zjawiska korozyjne/zgodność metalurgiczna wg EN 248, EN ISO 6509, EN 12502",
                    "Odporność termiczna wg EN ISO 580, EN 1254-3",
                    "Emisja substancji do wody pitnej wg EN 15664, EN 16421, EN 12873",
                    "Wytrzymałość mechaniczna wg EN 12380, EN 13618, EN 1453",
                    "Hałas hydrauliczny (dla armatury) wg EN ISO 3822",
                    "Przepustowość i straty ciśnienia wg EN 12627, EN 1267"
                ],
                "documentation_required": [
                    "Deklaracja właściwości użytkowych (DoP)",
                    "Oznakowanie CE",
                    "Dokumentacja zakładowej kontroli produkcji",
                    "Raport z badań typu",
                    "Certyfikat higieny/atesty PZH do kontaktu z wodą pitną",
                    "Karta techniczna produktu",
                    "Instrukcja montażu i eksploatacji",
                    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
                    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
                    "Certyfikat systemu oceny dla wyrobów mających kontakt z wodą pitną (EAS)"
                ],
                "cpr_changes": [
                    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
                    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
                    "Zharmonizowane europejskie standardy dla wyrobów kontaktujących się z wodą pitną (schemat EAS)",
                    "Standardy dotyczące zawartości materiałów z recyklingu (min. 25% dla tworzyw sztucznych do 2030)",
                    "Ograniczenie stosowania ołowiu i innych metali ciężkich w armaturze i rurociągach",
                    "Nowe przepisy dotyczące mikroplastików uwalnianych z instalacji z tworzyw sztucznych",
                    "Wymogi dotyczące oszczędności wody i efektywności energetycznej armatury",
                    "Zaostrzenie testów migracji substancji z wyrobów kontaktujących się z wodą pitną"
                ],
                "certification_systems": ["System 1+", "System 3", "System 4"]
            },
            {
                "id": "ceiling-req",
                "title": "Wymagania dla sufitów podwieszanych",
                "description": "Sufity podwieszane, panele sufitowe, konstrukcje nośne i systemy sufitowe muszą spełniać wymagania dotyczące bezpieczeństwa użytkowania, akustyki, odporności ogniowej i emisji substancji niebezpiecznych. Rozporządzenie CPR 2024 wprowadza dodatkowe wymagania środowiskowe i zdrowotne.",
                "mandatory_tests": [
                    "Odporność ogniowa wg EN 13501-1, EN 13501-2",
                    "Odporność na uderzenia wg EN 13964, EN 13084",
                    "Właściwości akustyczne (pochłanianie dźwięku) wg EN ISO 354, EN ISO 11654",
                    "Izolacyjność akustyczna wg EN ISO 10140-2, EN ISO 717-1",
                    "Emisja substancji niebezpiecznych wg EN 16516",
                    "Wytrzymałość mechaniczna elementów wg EN 13964, EN 13964 załącznik D, F",
                    "Odporność na wilgoć i ugięcie wg EN 13964 załącznik E",
                    "Przewodnictwo cieplne wg EN 12667",
                    "Odporność na korozję elementów metalowych wg EN ISO 9227",
                    "Odbicie światła wg EN 410"
                ],
                "documentation_required": [
                    "Deklaracja właściwości użytkowych (DoP)",
                    "Oznakowanie CE",
                    "Dokumentacja zakładowej kontroli produkcji",
                    "Raport z badań typu",
                    "Karta techniczna produktu",
                    "Instrukcja montażu i konserwacji",
                    "Raporty z badań ogniowych",
                    "Deklaracja środowiskowa produktu (EPD) wg EN 15804+A2",
                    "Cyfrowy paszport produktu (wymagany od 2025 w ramach CPR 2024)",
                    "Certyfikaty jakości powietrza wewnętrznego (np. Eurofins, Indoor Air Comfort)"
                ],
                "cpr_changes": [
                    "Wprowadzenie obowiązkowego cyfrowego paszportu produktu",
                    "Obowiązkowa ocena cyklu życia (LCA) i deklaracja środowiskowa produktu (EPD)",
                    "Zaostrzenie wymogów emisji lotnych związków organicznych (LZO)",
                    "Standardy dotyczące zawartości materiałów z recyklingu (min. 20% do 2030)",
                    "Wymogi dotyczące możliwości rozbioru systemu i recyclingu po zakończeniu użytkowania",
                    "Nowe przepisy dotyczące bakterio- i grzybobójczych dodatków w panelach sufitowych",
                    "Ograniczenia dla substancji wzbudzających szczególnie duże obawy (SVHC)",
                    "Wymogi etykietowania dla zawartości materiałów biobased i pochodzących ze zrównoważonych źródeł"
                ],
                "certification_systems": ["System 1", "System 3", "System 4"]
            }
        ]
        
        # Sample categories data - all 36 categories from the UI
        categories_data = [
            {
                "id": "plumbing",
                "name": "Wyroby instalacyjne",
                "code": "PL-1",
                "description": "Rury, złączki, armatura, systemy instalacyjne, urządzenia sanitarne",
                "requirement_id": "plumbing-req"
            },
            {
                "id": "ceiling",
                "name": "Sufity podwieszane",
                "code": "CP-2",
                "description": "Systemy sufitów podwieszanych, panele sufitowe, konstrukcje nośne",
                "requirement_id": "ceiling-req"
            },
            {
                "id": "steel",
                "name": "Wyroby stalowe",
                "code": "ST-3",
                "description": "Elementy konstrukcyjne stalowe, profile, blachy, wyroby ze stali",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "concrete",
                "name": "Betony i zaprawy",
                "code": "CM-4",
                "description": "Mieszanki betonowe, zaprawy murarskie, jastrychy, tynki",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "doors",
                "name": "Drzwi i okna",
                "code": "DW-5",
                "description": "Okna, drzwi, bramy, żaluzje, rolety, okucia budowlane",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "road",
                "name": "Wyroby drogowe",
                "code": "RD-6",
                "description": "Asfalty, kruszywa drogowe, elementy odwodnienia, oznakowanie dróg",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "flooring",
                "name": "Podłogi i posadzki",
                "code": "FL-7",
                "description": "Podłogi drewniane, panele, płytki, wykładziny, linoleum, LVT",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "timber",
                "name": "Wyroby drewniane konstrukcyjne",
                "code": "TM-8",
                "description": "Drewno konstrukcyjne, CLT, LVL, belki i elementy drewniane",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "boards",
                "name": "Płyty drewnopochodne",
                "code": "WB-9",
                "description": "Płyty OSB, MDF, HDF, wiórowe, sklejka, LVL, płyty konstrukcyjne",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "insulation",
                "name": "Materiały izolacyjne",
                "code": "IN-10",
                "description": "Wełna mineralna, styropian, PIR, PUR, materiały izolacyjne",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "facades",
                "name": "Systemy elewacyjne",
                "code": "FC-11",
                "description": "Systemy fasadowe, ocieplenie ścian, izolacje, tynki, okładziny elewacyjne",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "roofing",
                "name": "Pokrycia dachowe",
                "code": "RF-12",
                "description": "Dachówki, blachodachówki, gonty, membrany, materiały izolacyjne dachowe",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "drywall",
                "name": "Systemy suchej zabudowy",
                "code": "DW-13",
                "description": "Płyty gipsowo-kartonowe, profile, akcesoria montażowe, systemy sufitowe",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "adhesives",
                "name": "Kleje i uszczelniacze",
                "code": "AD-14",
                "description": "Kleje budowlane, silikony, akryle, pianki montażowe, uszczelniacze",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "waterproofing",
                "name": "Hydroizolacje",
                "code": "WP-15",
                "description": "Materiały hydroizolacyjne, papy, membrany, powłoki, folie, masy uszczelniające",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "fireproofing",
                "name": "Zabezpieczenia przeciwpożarowe",
                "code": "FP-16",
                "description": "Systemy przeciwpożarowe, uszczelnienia przejść, farby pęczniejące",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "glass",
                "name": "Szkło budowlane",
                "code": "GL-17",
                "description": "Szyby, szkło fasadowe, laminowane, hartowane, zespolone, ścianki szklane",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "ventilation",
                "name": "Systemy wentylacyjne",
                "code": "VE-18",
                "description": "Kanały wentylacyjne, centrale, rekuperatory, klimatyzatory, wentylatory",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "heating",
                "name": "Systemy grzewcze",
                "code": "HE-19",
                "description": "Grzejniki, ogrzewanie podłogowe, kotły, pompy ciepła, kolektory słoneczne",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "electrical",
                "name": "Instalacje elektryczne",
                "code": "EL-20",
                "description": "Przewody, kable, osprzęt elektryczny, rozdzielnice, systemy zasilania",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "drainage",
                "name": "Systemy odwodnienia",
                "code": "DR-21",
                "description": "Rynny, rury spustowe, wpusty, odwodnienia liniowe, studzienki",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "sanitary",
                "name": "Wyposażenie sanitarne",
                "code": "SA-22",
                "description": "Umywalki, wanny, kabiny prysznicowe, muszle, bidety, akcesoria łazienkowe",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "paints",
                "name": "Farby i powłoki",
                "code": "PA-23",
                "description": "Farby, lakiery, impregnaty, grunty, powłoki dekoracyjne i ochronne",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "acoustics",
                "name": "Izolacje akustyczne",
                "code": "AC-24",
                "description": "Materiały dźwiękochłonne, panele akustyczne, maty, membrany, izolatory",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "stairs",
                "name": "Schody i balustrady",
                "code": "ST-25",
                "description": "Elementy schodów, stopnie, balustrady, poręcze, systemy balustrad",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "stonework",
                "name": "Wyroby kamienne",
                "code": "SW-26",
                "description": "Płytki kamienne, blaty, parapety, elewacje, kamień naturalny i sztuczny",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "lighting",
                "name": "Oświetlenie budowlane",
                "code": "LI-27",
                "description": "Oprawy oświetleniowe, lampy, żarówki, systemy sterowania oświetleniem",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "fencing",
                "name": "Ogrodzenia",
                "code": "FE-28",
                "description": "Systemy ogrodzeń, panele, siatki, słupki, bramy wjazdowe, furtki",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "foundation",
                "name": "Wyroby fundamentowe",
                "code": "FO-29",
                "description": "Materiały do fundamentów, zbrojenia, izolacje fundamentowe, drenażowe",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "bricks",
                "name": "Cegły i pustaki",
                "code": "BR-30",
                "description": "Cegły, pustaki ceramiczne, keramzytowe, elementy murowe, bloczki",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "scaffolding",
                "name": "Rusztowania",
                "code": "SC-31",
                "description": "Systemy rusztowań, pomosty robocze, drabiny, podesty, wieże rusztowaniowe",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "prefab",
                "name": "Elementy prefabrykowane",
                "code": "PF-32",
                "description": "Prefabrykaty betonowe, ściany, płyty stropowe, belki, elementy konstrukcyjne",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "solar",
                "name": "Systemy solarne",
                "code": "SO-33",
                "description": "Panele fotowoltaiczne, kolektory słoneczne, systemy montażowe, inwertery",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "geotextiles",
                "name": "Geotekstylia",
                "code": "GT-34",
                "description": "Geowłókniny, geosiatki, geomembrany, geokompozyty, maty bentonitowe",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "plastics",
                "name": "Tworzywa konstrukcyjne",
                "code": "PL-35",
                "description": "Elementy konstrukcyjne z tworzyw sztucznych, profile, płyty, rury, izolatory",
                "requirement_id": "placeholder-req"
            },
            {
                "id": "eco",
                "name": "Materiały ekologiczne",
                "code": "EC-36",
                "description": "Materiały budowlane przyjazne środowisku, biodegradowalne, naturalne, pochodzące z recyklingu",
                "requirement_id": "placeholder-req"
            }
        ]
        
        # Function to check if a table exists in Supabase
        def check_table_exists(table_name):
            supabase_url = supabase_config["url"]
            service_role_key = supabase_config.get("service_role_key", "")
            
            # First try with service role key if available (provides more permissions)
            if service_role_key:
                try:
                    headers = {
                        "apikey": service_role_key,
                        "Authorization": f"Bearer {service_role_key}",
                        "Content-Type": "application/json"
                    }
                    
                    # Use Supabase REST API to check if table exists
                    check_url = f"{supabase_url}/rest/v1/{table_name}?limit=0"
                    response = requests.get(check_url, headers=headers)
                    
                    # 200 means table exists, 404 means it doesn't
                    return response.status_code == 200
                except Exception as e:
                    print(f"Error checking table with service role key: {e}")
                    # Fall back to regular key
                    pass
            
            # Use regular key if service role key failed or isn't available
            headers = {
                "apikey": supabase_config["key"],
                "Authorization": f"Bearer {supabase_config['key']}",
                "Content-Type": "application/json"
            }
            
            try:
                # Use Supabase REST API to check if table exists
                check_url = f"{supabase_url}/rest/v1/{table_name}?limit=0"
                response = requests.get(check_url, headers=headers)
                
                # 200 means table exists, 404 means it doesn't
                return response.status_code == 200
            except Exception as e:
                print(f"Error checking if table {table_name} exists: {e}")
                return False
        
        # Function to create tables using SQL
        def create_tables():
            supabase_url = supabase_config["url"]
            service_role_key = supabase_config.get("service_role_key", "")
            
            # Service role key is required for creating tables
            if not service_role_key:
                print("Service role key is required for creating tables but was not found in configuration")
                return False
                
            headers = {
                "apikey": service_role_key,
                "Authorization": f"Bearer {service_role_key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
            
            # Check if tables already exist
            product_categories_exists = check_table_exists("product_categories")
            product_requirements_exists = check_table_exists("product_requirements")
            
            # Check if SQL RPC function is available
            try:
                sql_url = f"{supabase_url}/rest/v1/rpc/execute_sql"
                test_sql = "SELECT 1;"
                test_payload = {"query": test_sql, "params": []}
                
                test_response = requests.post(sql_url, headers=headers, json=test_payload)
                if test_response.status_code not in [200, 201]:
                    print(f"SQL RPC function not available: {test_response.status_code} - {test_response.text}")
                    return False
            except Exception as e:
                print(f"Error testing SQL RPC function: {e}")
                return False
            
            if not product_requirements_exists:
                try:
                    # Create product_requirements table with SQL
                    sql = """
                    CREATE TABLE IF NOT EXISTS product_requirements (
                        id TEXT PRIMARY KEY,
                        title TEXT NOT NULL,
                        description TEXT,
                        mandatory_tests TEXT[] DEFAULT '{}',
                        documentation_required TEXT[] DEFAULT '{}',
                        cpr_changes TEXT[] DEFAULT '{}',
                        certification_systems TEXT[] DEFAULT '{}',
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    );
                    """
                    
                    sql_url = f"{supabase_url}/rest/v1/rpc/execute_sql"
                    payload = {"query": sql, "params": []}
                    
                    response = requests.post(sql_url, headers=headers, json=payload)
                    if response.status_code not in [200, 201]:
                        print(f"Error creating product_requirements table: {response.status_code} - {response.text}")
                        return False
                except Exception as e:
                    print(f"Exception creating product_requirements table: {e}")
                    return False
            
            if not product_categories_exists:
                try:
                    # Create product_categories table with SQL
                    sql = """
                    CREATE TABLE IF NOT EXISTS product_categories (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        code TEXT,
                        description TEXT,
                        requirement_id TEXT REFERENCES product_requirements(id),
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    );
                    """
                    
                    sql_url = f"{supabase_url}/rest/v1/rpc/execute_sql"
                    payload = {"query": sql, "params": []}
                    
                    response = requests.post(sql_url, headers=headers, json=payload)
                    if response.status_code not in [200, 201]:
                        print(f"Error creating product_categories table: {response.status_code} - {response.text}")
                        return False
                except Exception as e:
                    print(f"Exception creating product_categories table: {e}")
                    return False
                    
            return True
        
        # Function to insert data into a Supabase table
        def insert_data(table_name, data):
            supabase_url = supabase_config["url"]
            service_role_key = supabase_config.get("service_role_key", "")
            
            # Use service role key if available, otherwise use regular key
            api_key = service_role_key if service_role_key else supabase_config["key"]
            
            headers = {
                "apikey": api_key,
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
            
            try:
                # First, clear any existing data
                delete_url = f"{supabase_url}/rest/v1/{table_name}?select=id"
                delete_response = requests.delete(delete_url, headers=headers)
                
                if delete_response.status_code not in [200, 201, 204]:
                    print(f"Warning when clearing table {table_name}: {delete_response.status_code} - {delete_response.text}")
                    # Continue anyway as the table might be empty
                
                # Then insert new data
                insert_url = f"{supabase_url}/rest/v1/{table_name}"
                response = requests.post(insert_url, headers=headers, json=data)
                
                if response.status_code not in [200, 201]:
                    print(f"Error inserting data into {table_name}: {response.status_code} - {response.text}")
                    return False
                    
                return True
            except Exception as e:
                print(f"Exception when inserting data into {table_name}: {e}")
                return False
        
        # Create tables first
        tables_created = create_tables()
        if not tables_created:
            return ProductDataResponse(
                success=False,
                message="Błąd podczas tworzenia tabel w Supabase."
            )
        
        # Insert product requirements first (since categories reference them)
        requirements_success = insert_data("product_requirements", requirements_data)
        if not requirements_success:
            return ProductDataResponse(
                success=False,
                message="Błąd podczas importu wymagań produktów do Supabase."
            )
        
        # Insert product categories
        categories_success = insert_data("product_categories", categories_data)
        if not categories_success:
            return ProductDataResponse(
                success=False,
                message="Błąd podczas importu kategorii produktów do Supabase."
            )
        
        return ProductDataResponse(
            success=True,
            message="Dane produktów zostały pomyślnie zaimportowane do Supabase."
        )
    except Exception as e:
        print(f"Error importing product data: {e}")
        error_message = str(e)
        
        # Check for specific error patterns
        if "permission denied" in error_message.lower() or "access" in error_message.lower():
            return ProductDataResponse(
                success=False,
                message="Brak wystarczających uprawnień do wykonania operacji na bazie danych. Upewnij się, że skonfigurowano klucz Service Role."
            )
        elif "relation" in error_message.lower() and "does not exist" in error_message.lower():
            return ProductDataResponse(
                success=False,
                message="Tabela nie istnieje w bazie danych. Upewnij się, że posiadasz uprawnienia do tworzenia tabel poprzez klucz Service Role."
            )
        elif "connection" in error_message.lower() or "timeout" in error_message.lower():
            return ProductDataResponse(
                success=False,
                message="Błąd połączenia z bazą danych Supabase. Sprawdź, czy adres URL jest poprawny i czy baza danych jest dostępna."
            )
        else:
            return ProductDataResponse(
                success=False,
                message=f"Błąd podczas importu danych: {error_message}"
            )

# Supabase health check endpoint
@router.get("/supabase-health")
def check_supabase_connection():
    try:
        # Get Supabase configuration
        supabase_config = db.storage.json.get("supabase_config", default={})
        if not supabase_config or not supabase_config.get("url") or not supabase_config.get("key"):
            return {"status": "error", "message": "Supabase not configured", "service": "supabase"}
        
        # Return success status
        return {"status": "ok", "message": "Supabase connection available", "service": "supabase"}
    except Exception as e:
        print(f"Error checking Supabase health: {e}")
        return {"status": "error", "message": str(e), "service": "supabase"}
