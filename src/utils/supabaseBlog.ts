/**
 * Supabase Blog Service
 * Handles all blog post operations with Supabase including scheduling
 */

import { supabase } from './supabase';

export interface SupabaseBlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    image_url: string;
    author_name: string;
    author_avatar?: string;
    tags: string[];
    reading_time: number;
    published: boolean;
    scheduled_for: string | null;
    created_at: string;
    updated_at: string;
}

export interface BlogPostInput {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category?: string;
    image_url?: string;
    author_name?: string;
    author_avatar?: string;
    tags?: string[];
    reading_time?: number;
    published?: boolean;
    scheduled_for?: string | null;
}

/**
 * Fetch all published posts that are past their scheduled date
 * This is what the public blog page uses
 */
export async function fetchPublishedBlogPosts(): Promise<SupabaseBlogPost[]> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .or('scheduled_for.is.null,scheduled_for.lte.now()')
        .order('scheduled_for', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching published blog posts:', error);
        return [];
    }

    return data || [];
}

/**
 * Fetch all blog posts (for admin panel)
 * Includes unpublished and scheduled posts
 */
export async function fetchAllBlogPosts(): Promise<SupabaseBlogPost[]> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('scheduled_for', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all blog posts:', error);
        return [];
    }

    return data || [];
}

/**
 * Fetch a single blog post by slug
 */
export async function fetchBlogPostBySlug(slug: string): Promise<SupabaseBlogPost | null> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching blog post by slug:', error);
        return null;
    }

    return data;
}

/**
 * Create a new blog post
 */
export async function createBlogPost(post: BlogPostInput): Promise<SupabaseBlogPost | null> {
    const { data, error } = await supabase
        .from('blog_posts')
        .insert({
            ...post,
            tags: post.tags || [],
            reading_time: post.reading_time || 5,
            published: post.published ?? false,
            category: post.category || 'CPR',
            author_name: post.author_name || 'CPR Expert'
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating blog post:', error);
        return null;
    }

    return data;
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(id: string, updates: Partial<BlogPostInput>): Promise<SupabaseBlogPost | null> {
    const { data, error } = await supabase
        .from('blog_posts')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating blog post:', error);
        return null;
    }

    return data;
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting blog post:', error);
        return false;
    }

    return true;
}

/**
 * Schedule a blog post for future publication
 */
export async function scheduleBlogPost(id: string, scheduledFor: Date): Promise<SupabaseBlogPost | null> {
    return updateBlogPost(id, {
        scheduled_for: scheduledFor.toISOString(),
        published: true
    });
}

/**
 * Publish a blog post immediately
 */
export async function publishBlogPostNow(id: string): Promise<SupabaseBlogPost | null> {
    return updateBlogPost(id, {
        scheduled_for: new Date().toISOString(),
        published: true
    });
}

/**
 * Unpublish a blog post
 */
export async function unpublishBlogPost(id: string): Promise<SupabaseBlogPost | null> {
    return updateBlogPost(id, {
        published: false
    });
}

/**
 * Import multiple blog posts at once (for bulk import)
 */
export async function importBlogPosts(posts: BlogPostInput[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const post of posts) {
        const result = await createBlogPost(post);
        if (result) {
            success++;
        } else {
            failed++;
        }
    }

    return { success, failed };
}

/**
 * Check if a slug is already taken
 */
export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    let query = supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug);

    if (excludeId) {
        query = query.neq('id', excludeId);
    }

    const { data } = await query;
    return (data?.length || 0) > 0;
}

/**
 * Generate a unique slug from a title
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[ąą]/g, 'a')
        .replace(/[ćć]/g, 'c')
        .replace(/[ęę]/g, 'e')
        .replace(/[łł]/g, 'l')
        .replace(/[ńń]/g, 'n')
        .replace(/[óó]/g, 'o')
        .replace(/[śś]/g, 's')
        .replace(/[źżźż]/g, 'z')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);
}
