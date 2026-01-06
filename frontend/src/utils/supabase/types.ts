/**
 * Common type definitions for Supabase tables
 */

// Product category row type
export interface ProductCategoryRow {
  id: number;
  category_code: string;
  name: string;
  description: string | null;
  parent_id: number | null;
  is_published: boolean;
  created_at: string; // ISO date string
  updated_at: string | null; // ISO date string
  metadata: Record<string, any> | null;
}

// Product requirement row type
export interface ProductRequirementRow {
  id: number;
  category_id: number;
  requirement_code: string;
  name: string;
  description: string | null;
  details: string | null;
  is_mandatory: boolean;
  order_index: number;
  is_published: boolean;
  created_at: string; // ISO date string
  updated_at: string | null; // ISO date string
  metadata: Record<string, any> | null;
}

// Blog post row type
export interface BlogPostRow {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author: string | null;
  published_at: string | null; // ISO date string
  is_published: boolean;
  featured_image_url: string | null;
  tags: string[] | null;
  created_at: string; // ISO date string
  updated_at: string | null; // ISO date string
  metadata: Record<string, any> | null;
}

// Document row type
export interface DocumentRow {
  id: number;
  title: string;
  description: string | null;
  file_key: string; // Storage key
  file_name: string;
  file_size: number;
  file_type: string;
  category: string | null;
  is_published: boolean;
  download_count: number;
  created_at: string; // ISO date string
  updated_at: string | null; // ISO date string
  metadata: Record<string, any> | null;
}

// User profile row type
export interface UserProfileRow {
  id: string; // User ID from auth
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: string | null;
  is_admin: boolean;
  last_login_at: string | null; // ISO date string
  created_at: string; // ISO date string
  updated_at: string | null; // ISO date string
  metadata: Record<string, any> | null;
}

// Database operations response type
export interface SupabaseOperationResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}
