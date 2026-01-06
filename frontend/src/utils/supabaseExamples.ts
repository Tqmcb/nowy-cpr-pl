/**
 * Example file demonstrating how to use the Supabase utilities
 * 
 * This file is meant for reference only and should not be imported or used directly.
 * It shows patterns for authentication and database operations using the Supabase utilities.
 */

// Import everything from the supabaseUtils index
import { supabase, supabaseAuth, supabaseDb, type ProductCategoryRow } from 'utils/supabaseUtils';

/**
 * Authentication Examples
 */

// Sign up a new user
async function exampleSignUp() {
  const { data, error } = await supabaseAuth.signUp(
    'user@example.com', 
    'securePassword123',
    { full_name: 'Example User' }
  );
  
  if (error) {
    console.error('Sign up error:', error.message);
    return;
  }
  
  console.log('Sign up successful:', data);
}

// Sign in a user
async function exampleSignIn() {
  const { data, error } = await supabaseAuth.signIn('user@example.com', 'securePassword123');
  
  if (error) {
    console.error('Sign in error:', error.message);
    return;
  }
  
  console.log('Sign in successful:', data);
}

// Get the current user's session
async function exampleGetSession() {
  const { data, error } = await supabaseAuth.getSession();
  
  if (error) {
    console.error('Get session error:', error.message);
    return;
  }
  
  console.log('Current session:', data.session);
  
  // Check if user is authenticated
  const isAuthenticated = !!data.session;
  console.log('Is authenticated:', isAuthenticated);
}

// Sign out a user
async function exampleSignOut() {
  const { error } = await supabaseAuth.signOut();
  
  if (error) {
    console.error('Sign out error:', error.message);
    return;
  }
  
  console.log('Sign out successful');
}

/**
 * Database Examples
 */

// Fetch all product categories
async function exampleFetchCategories() {
  const { data, error } = await supabaseDb.getRecords<ProductCategoryRow>('product_categories');
  
  if (error) {
    console.error('Fetch categories error:', error.message);
    return;
  }
  
  console.log('Product categories:', data);
}

// Fetch a single product category
async function exampleFetchCategory(id: string) {
  const { data, error } = await supabaseDb.getRecord<ProductCategoryRow>('product_categories', id);
  
  if (error) {
    console.error('Fetch category error:', error.message);
    return;
  }
  
  console.log('Product category:', data);
}

// Insert a new product category
async function exampleInsertCategory() {
  const newCategory = {
    name: 'Example Category',
    code: 'EX-CAT',
    description: 'An example product category',
    requirement_id: 'some-requirement-id'
  };
  
  const { data, error } = await supabaseDb.insertRecord<ProductCategoryRow>(
    'product_categories', 
    newCategory
  );
  
  if (error) {
    console.error('Insert category error:', error.message);
    return;
  }
  
  console.log('Inserted category:', data);
}

// Update a product category
async function exampleUpdateCategory(id: string) {
  const updates = {
    name: 'Updated Category Name',
    description: 'This category has been updated'
  };
  
  const { data, error } = await supabaseDb.updateRecord<ProductCategoryRow>(
    'product_categories', 
    id, 
    updates
  );
  
  if (error) {
    console.error('Update category error:', error.message);
    return;
  }
  
  console.log('Updated category:', data);
}

// Delete a product category
async function exampleDeleteCategory(id: string) {
  const { error } = await supabaseDb.deleteRecord('product_categories', id);
  
  if (error) {
    console.error('Delete category error:', error.message);
    return;
  }
  
  console.log('Category deleted successfully');
}

/**
 * Direct Supabase Client Usage (for complex queries)
 * 
 * For more complex operations not covered by the utility functions,
 * you can still use the supabase client directly.
 */
async function exampleComplexQuery() {
  const { data, error } = await supabase
    .from('product_categories')
    .select(`
      id,
      name,
      code,
      requirement:requirement_id (
        id,
        title,
        description
      )
    `)
    .order('name', { ascending: true })
    .limit(10);
  
  if (error) {
    console.error('Complex query error:', error.message);
    return;
  }
  
  console.log('Query results:', data);
}

// Setting up a real-time subscription
function exampleRealtimeSubscription() {
  const subscription = supabase
    .channel('table-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'product_categories'
      },
      (payload) => {
        console.log('Change received:', payload);
        // Handle the change, e.g., update UI
      }
    )
    .subscribe();
  
  // Remember to unsubscribe when appropriate (e.g., component unmount)
  // subscription.unsubscribe();
  
  return subscription;
}
