import brain from "brain";

// Types
export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserData {
  user_id: string;
  email: string;
  metadata?: Record<string, any>;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token?: string;
  user_id: string;
  email: string;
  metadata?: Record<string, any>;
}

// Service functions
export const authService = {
  /**
   * Register a new user
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const response = await brain.signup({
        email: data.email,
        password: data.password,
        full_name: data.full_name
      });
      return await response.json();
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  },

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const response = await brain.login({
        email: data.email,
        password: data.password
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Logowanie nie powiodło się');
      }
      return result;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ success: boolean; message: string }> {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        return { success: true, message: "No active session" };
      }

      const response = await brain.logout(
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Clear local storage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      
      return await response.json();
    } catch (error) {
      console.error("Sign out error:", error);
      // Still clear storage even if API call fails
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      throw error;
    }
  },

  /**
   * Verify the current authentication token
   */
  async verifyAuth(): Promise<{ success: boolean; user_id: string; email: string; metadata?: Record<string, any> }> {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await brain.verify_auth(
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error("Verify auth error:", error);
      throw error;
    }
  },

  /**
   * Get the current authenticated user from local storage
   */
  getCurrentUser(): UserData | null {
    const userData = localStorage.getItem("user_data");
    if (!userData) {
      return null;
    }
    
    try {
      return JSON.parse(userData) as UserData;
    } catch {
      return null;
    }
  },

  /**
   * Save authentication data to local storage
   */
  saveAuthData(authResponse: AuthResponse): void {
    if (!authResponse.access_token) {
      console.error('No access token in auth response');
      return;
    }
    
    localStorage.setItem("auth_token", authResponse.access_token);
    
    const userData: UserData = {
      user_id: authResponse.user_id,
      email: authResponse.email,
      metadata: authResponse.metadata
    };
    
    localStorage.setItem("user_data", JSON.stringify(userData));
    
    // Also save the session in Supabase format for compatibility
    if (authResponse.access_token) {
      const supabaseSession = {
        access_token: authResponse.access_token,
        refresh_token: authResponse.refresh_token || '',
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        expires_in: 3600
      };
      localStorage.setItem('sb-qiekotzsywbhuwnxxdda-auth-token', JSON.stringify(supabaseSession));
    }
  },

  /**
   * Check if the user is authenticated (has token)
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }
};
