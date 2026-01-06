from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import databutton as db

# We've consolidated the Supabase endpoints into the supabase API
# This file is kept for backward compatibility but routes are redirected
router = APIRouter()

# Forward routes to the main supabase API
@router.get('/health-check')
def check_health_status22():
    """Redirect to the main supabase API health check"""
    from app.apis.supabase import check_supabase_connection
    return check_supabase_connection()