/**
 * Example file demonstrating use of the Supabase utilities
 * 
 * This file shows various examples of how to use the unified Supabase utilities.
 * It is intended for reference only and is not used in the actual application.
 */

import { supabaseClient, supabaseAuth, supabaseDb, type ProductCategoryRow, type BlogPostRow } from './index';

// AUTHENTICATION EXAMPLES

/**
 * Sign up a new user
 */
async function signUpExample() {
  const { data, error } = await supabaseAuth.signUp(
    'user@example.com', 
    'securePassword',
    { full_name: 'John Doe' }
  );
  
  if (error) {
    console.error('Error signing up:', error.message);
    return;
  }
  
  console.log('User signed up successfully:', data);
}

/**
 * Sign in a user
 */
async function signInExample() {
  const { data, error } = await supabaseAuth.signIn('user@example.com', 'securePassword');
  
  if (error) {
    console.error('Error signing in:', error.message);
    return;
  }
  
  console.log('User signed in successfully:', data?.user);
}

/**
 * Check if user is admin
 */
function checkAdminExample() {
  const isAdmin = supabaseAuth.isAdmin('admin@multicert.pl');
  console.log('Is admin:', isAdmin); // true
  
  const isNotAdmin = supabaseAuth.isAdmin('user@example.com');
  console.log('Is admin:', isNotAdmin); // false
}

// DATABASE EXAMPLES

/**
 * Fetch product categories
 */
async function fetchCategoriesExample() {
  const { data, error } = await supabaseDb.getRecords<ProductCategoryRow>(
    'product_categories',
    '*',
    [{ column: 'is_published', operator: 'eq', value: true }],
    { orderBy: 'name', ascending: true }
  );
  
  if (error) {
    console.error('Error fetching categories:', error.message);
    return;
  }
  
  console.log('Categories:', data);
}

/**
 * Insert a blog post
 */
async function insertBlogPostExample() {
  const newPost = {
    title: 'New CPR Regulations 2024',
    slug: 'new-cpr-regulations-2024',
    content: 'Content goes here...',
    excerpt: 'A short preview of the article',
    author: 'Admin',
    is_published: true,
    tags: ['regulations', 'cpr2024']
  };
  
  const { data, error } = await supabaseDb.insertRecord<BlogPostRow>('blog_posts', newPost);
  
  if (error) {
    console.error('Error creating blog post:', error.message);
    return;
  }
  
  console.log('Blog post created:', data);
}

/**
 * Upload a document file
 */
async function uploadDocumentExample(file: File) {
  // Upload file to storage
  const fileName = `${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabaseDb.uploadFile(
    'documents',
    fileName,
    file
  );
  
  if (uploadError) {
    console.error('Error uploading file:', uploadError.message);
    return;
  }
  
  // Get public URL
  const { publicUrl } = supabaseDb.getFileUrl('documents', fileName);
  
  // Save document metadata
  const newDocument = {
    title: 'Sample Document',
    description: 'A sample document for demonstration',
    file_key: fileName,
    file_name: file.name,
    file_size: file.size,
    file_type: file.type,
    category: 'Samples',
    is_published: true,
    download_count: 0
  };
  
  const { data, error } = await supabaseDb.insertRecord('documents', newDocument);
  
  if (error) {
    console.error('Error creating document record:', error.message);
    // Delete the uploaded file if metadata insertion fails
    await supabaseDb.deleteFile('documents', fileName);
    return;
  }
  
  console.log('Document uploaded:', data);
  console.log('Public URL:', publicUrl);
}

// COMBINED EXAMPLES

/**
 * Register a user and create their profile
 */
async function registerUserWithProfileExample() {
  // First sign up the user
  const { data: authData, error: authError } = await supabaseAuth.signUp(
    'user@example.com',
    'securePassword',
    { full_name: 'John Doe' }
  );
  
  if (authError) {
    console.error('Error signing up:', authError.message);
    return;
  }
  
  // Then create their profile record
  const userId = authData?.user?.id;
  
  if (!userId) {
    console.error('User ID not available after signup');
    return;
  }
  
  const profileData = {
    id: userId,
    email: 'user@example.com',
    full_name: 'John Doe',
    company_name: 'ACME Inc.',
    role: 'Manager',
    is_admin: false
  };
  
  const { data: profileData, error: profileError } = await supabaseDb.insertRecord(
    'user_profiles',
    profileData
  );
  
  if (profileError) {
    console.error('Error creating user profile:', profileError.message);
    return;
  }
  
  console.log('User registered with profile:', profileData);
}
