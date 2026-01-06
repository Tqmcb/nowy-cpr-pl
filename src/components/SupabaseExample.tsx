/**
 * This file demonstrates how to use the Supabase utilities in various contexts
 * It's intended as a reference for developers working with the application
 */

import { useState, useEffect } from 'react';
import { 
  // Auth utilities
  useAuth,
  signIn,
  signUp,
  signOut,
  resetPassword,
  
  // Database utilities
  fetchProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  
  // Direct Supabase client access
  supabase
} from '../utils/supabaseUtils';

/**
 * Example component showing authentication usage
 */
export function AuthExample() {
  // Use the auth context hook to access authentication state and methods
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Example login handler
  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await signIn({ email, password });
      if (error) throw error;
      console.log('Successfully logged in:', data);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error };
    }
  };
  
  // Example registration handler
  const handleSignUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await signUp({ 
        email, 
        password, 
        options: { 
          data: { full_name: fullName } 
        }
      });
      if (error) throw error;
      console.log('Successfully registered:', data);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error };
    }
  };
  
  // Example logout handler
  const handleLogout = async () => {
    try {
      await signOut();
      console.log('Successfully logged out');
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, error };
    }
  };
  
  // Example password reset handler
  const handlePasswordReset = async (email: string) => {
    try {
      const { data, error } = await resetPassword(email);
      if (error) throw error;
      console.log('Password reset email sent');
      return { success: true };
    } catch (error) {
      console.error('Password reset failed:', error);
      return { success: false, error };
    }
  };
  
  // Render differently based on authentication state
  if (isLoading) {
    return <div>Loading authentication state...</div>;
  }
  
  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.email}!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }
  
  return (
    <div>
      <p>Please login or register</p>
      {/* Login/Register forms would go here */}
    </div>
  );
}

/**
 * Example component showing database operations
 */
export function DatabaseExample() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load product categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await fetchProductCategories();
        if (error) throw error;
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);
  
  // Example function to add a new category
  const handleAddCategory = async (name: string, description: string) => {
    try {
      const newCategory = {
        name,
        description,
        is_active: true,
        sort_order: categories.length + 1
      };
      
      const { data, error } = await createProductCategory(newCategory);
      if (error) throw error;
      
      // Update local state
      setCategories([...categories, data]);
      return { success: true, data };
    } catch (err) {
      console.error('Failed to create category:', err);
      return { success: false, error: err };
    }
  };
  
  // Example function to update a category
  const handleUpdateCategory = async (id: string, updates: any) => {
    try {
      const { data, error } = await updateProductCategory(id, updates);
      if (error) throw error;
      
      // Update local state
      setCategories(categories.map(cat => cat.id === id ? { ...cat, ...updates } : cat));
      return { success: true, data };
    } catch (err) {
      console.error('Failed to update category:', err);
      return { success: false, error: err };
    }
  };
  
  // Example function to delete a category
  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await deleteProductCategory(id);
      if (error) throw error;
      
      // Update local state
      setCategories(categories.filter(cat => cat.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Failed to delete category:', err);
      return { success: false, error: err };
    }
  };
  
  // Example of direct Supabase client usage for a custom query
  const runCustomQuery = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('id, name')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      console.log('Custom query result:', data);
      return { success: true, data };
    } catch (err) {
      console.error('Custom query failed:', err);
      return { success: false, error: err };
    }
  };
  
  if (loading) {
    return <div>Loading categories...</div>;
  }
  
  if (error) {
    return <div>Error loading categories: {error.message}</div>;
  }
  
  return (
    <div>
      <h2>Product Categories</h2>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {category.name}
            <button onClick={() => handleUpdateCategory(category.id, { name: `${category.name} (updated)` })}>Update</button>
            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => handleAddCategory('New Category', 'A new category')}>Add Category</button>
      <button onClick={runCustomQuery}>Run Custom Query</button>
    </div>
  );
}
