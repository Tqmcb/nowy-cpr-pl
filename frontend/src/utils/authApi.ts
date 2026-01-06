import { API_URL } from 'app';
import brain from 'brain';

// Typy
export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData extends LoginData {
  full_name?: string;
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Funkcje pomocnicze do komunikacji z poprawionym API
export async function apiSignIn(credentials: LoginData): Promise<{ data: any; error: any }> {
  try {
    console.log('Signing in with fixed API URL:', API_URL);
    const response = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });

    let responseData: AuthApiResponse;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      // Jeśli response.text() zawiedzie, użyj alternatywnego komunikatu o błędzie
      let errorText = 'Niepoprawna odpowiedź z serwera';
      try {
        errorText = await response.text();
      } catch {}
      
      return {
        data: null,
        error: { message: `Błąd przetwarzania odpowiedzi: ${errorText}` }
      };
    }
    
    console.log('Auth API response:', responseData);

    if (!responseData.success) {
      return { 
        data: null, 
        error: { message: responseData.message || 'Błąd logowania' } 
      };
    }

    // Format response to match Supabase AuthResponse format
    if (!responseData.data || !responseData.data.access_token) {
      return { 
        data: null, 
        error: { message: 'Brak danych autentykacji w odpowiedzi' } 
      };
    }

    // Return data in Supabase-compatible format
    const formattedData = {
      session: {
        access_token: responseData.data.access_token,
        refresh_token: responseData.data.refresh_token,
        expires_in: responseData.data.expires_in,
        expires_at: responseData.data.expires_at,
        token_type: responseData.data.token_type || 'bearer',
      },
      user: responseData.data.user
    };

    return { data: formattedData, error: null };
  } catch (err) {
    console.error('Error during login:', err);
    return { 
      data: null, 
      error: { message: err instanceof Error ? err.message : 'Nieznany błąd podczas logowania' } 
    };
  }
}

export async function apiSignUp(data: SignupData): Promise<{ data: any; error: any }> {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        full_name: data.full_name || ''
      }),
      credentials: 'include'
    });

    let responseData: AuthApiResponse;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      console.error('Error parsing signup JSON response:', jsonError);
      // Jeśli response.text() zawiedzie, użyj alternatywnego komunikatu o błędzie
      let errorText = 'Niepoprawna odpowiedź z serwera';
      try {
        errorText = await response.text();
      } catch {}
      
      return {
        data: null,
        error: { message: `Błąd rejestracji: ${errorText}` }
      };
    }
    
    if (!responseData.success) {
      return { 
        data: null, 
        error: { message: responseData.message || 'Błąd rejestracji' } 
      };
    }

    return { data: responseData.data, error: null };
  } catch (err) {
    console.error('Error during signup:', err);
    return { 
      data: null, 
      error: { message: err instanceof Error ? err.message : 'Nieznany błąd podczas rejestracji' } 
    };
  }
}

export async function apiVerifyAuth(token: string): Promise<{ data: any; error: any }> {
  try {
    console.log('Verifying auth token with API');
    console.log('Token to verify (first 15 chars):', token ? token.substring(0, 15) + '...' : 'None');
    
    // Get stored Supabase service role key to send to API if available
    let serviceRoleKey = localStorage.getItem('supabaseServiceRoleKey');
    console.log('Service role key available for verification:', !!serviceRoleKey);
    
    // Spróbuj bezpośredniego wywołania API
    const response = await fetch(`${API_URL}/verify-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token,
        service_role_key: serviceRoleKey || undefined
      }),
      credentials: 'include'
    });
    
    let responseData: AuthApiResponse;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      console.error('Error parsing verification JSON response:', jsonError);
      // Jeśli response.text() zawiedzie, użyj alternatywnego komunikatu o błędzie
      let errorText = 'Niepoprawna odpowiedź z serwera';
      try {
        errorText = await response.text();
      } catch {}
      
      return {
        data: null,
        error: { message: `Błąd weryfikacji tokenu: ${errorText}` }
      };
    }
    
    console.log('Auth verification response:', responseData);
    
    if (responseData.success) {
      return { data: responseData.data, error: null };
    } else {
      return { 
        data: null, 
        error: { message: responseData.message || 'Token nieprawidłowy' } 
      };
    }
  } catch (err) {
    console.error('Error during token verification:', err);
    return { 
      data: null, 
      error: { message: err instanceof Error ? err.message : 'Nieznany błąd podczas weryfikacji tokenu' } 
    };
  }
}

export async function apiResetPassword(email: string): Promise<{ data: any; error: any }> {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'include'
    });
    
    let responseData: AuthApiResponse;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      console.error('Error parsing reset password JSON response:', jsonError);
      // Jeśli response.text() zawiedzie, użyj alternatywnego komunikatu o błędzie
      let errorText = 'Niepoprawna odpowiedź z serwera';
      try {
        errorText = await response.text();
      } catch {}
      
      return {
        data: null,
        error: { message: `Błąd resetowania hasła: ${errorText}` }
      };
    }
    
    if (!responseData.success) {
      return { 
        data: null, 
        error: { message: responseData.message || 'Błąd resetowania hasła' } 
      };
    }

    return { data: responseData.data || true, error: null };
  } catch (err) {
    console.error('Error during password reset:', err);
    return { 
      data: null, 
      error: { message: err instanceof Error ? err.message : 'Nieznany błąd podczas resetowania hasła' } 
    };
  }
}
