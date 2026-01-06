/**
 * Supabase admin utilities for content management
 * These functions perform direct database operations from the frontend
 */

import { supabaseClient } from './client';
import type {
  ProductCategoryRow,
  ProductRequirementRow,
  BlogPostRow,
  DocumentRow,
  SupabaseOperationResponse
} from './types';

// Blog Post Management
export async function fetchBlogPosts(includeUnpublished: boolean = false): Promise<SupabaseOperationResponse> {
  try {
    let query = supabaseClient
      .from('blog_posts')
      .select('*');

    // Filter for published posts only if specified
    if (!includeUnpublished) {
      query = query.eq('is_published', true)
    }

    // Order by published_at date (most recent first)
    query = query.order('published_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching blog posts:', error.message);
      return {
        success: false,
        message: `Błąd podczas pobierania wpisów bloga: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie pobrano wpisy bloga',
      data: data as BlogPostRow[]
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error('Exception fetching blog posts:', errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas pobierania wpisów bloga: ${errorMessage}`,
      error: e
    };
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<SupabaseOperationResponse> {
  try {
    const { data, error } = await supabaseClient
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error.message);
      return {
        success: false,
        message: `Błąd podczas pobierania wpisu bloga: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie pobrano wpis bloga',
      data: data as BlogPostRow
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception fetching blog post with slug ${slug}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas pobierania wpisu bloga: ${errorMessage}`,
      error: e
    };
  }
}

export async function createBlogPost(post: Omit<BlogPostRow, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseOperationResponse> {
  try {
    // Check if slug is unique
    const { data: existingPost } = await supabaseClient
      .from('blog_posts')
      .select('id')
      .eq('slug', post.slug)
      .maybeSingle();

    if (existingPost) {
      return {
        success: false,
        message: `Wpis o podobnym adresie URL (${post.slug}) już istnieje. Użyj innego adresu URL.`
      };
    }

    // Set published date if post is published
    const postData = {
      ...post,
      published_at: post.is_published ? new Date().toISOString() : null
    };

    const { data, error } = await supabaseClient
      .from('blog_posts')
      .insert(postData)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating blog post:', error.message);
      return {
        success: false,
        message: `Błąd podczas tworzenia wpisu bloga: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie utworzono wpis bloga',
      data: data as BlogPostRow
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error('Exception creating blog post:', errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas tworzenia wpisu bloga: ${errorMessage}`,
      error: e
    };
  }
}

export async function updateBlogPost(id: number, post: Partial<Omit<BlogPostRow, 'id' | 'created_at' | 'updated_at'>>): Promise<SupabaseOperationResponse> {
  try {
    // If slug is being updated, check if it's unique
    if (post.slug) {
      const { data: existingPost } = await supabaseClient
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .neq('id', id)
        .maybeSingle();

      if (existingPost) {
        return {
          success: false,
          message: `Wpis o podobnym adresie URL (${post.slug}) już istnieje. Użyj innego adresu URL.`
        };
      }
    }

    // Update the post with current timestamp
    const postData = {
      ...post,
      updated_at: new Date().toISOString(),
      // If published status is changing to true, update published_at
      published_at: post.is_published === true ?
        new Date().toISOString() :
        (post.is_published === false ? null : undefined)
    };

    const { data, error } = await supabaseClient
      .from('blog_posts')
      .update(postData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating blog post ${id}:`, error.message);
      return {
        success: false,
        message: `Błąd podczas aktualizacji wpisu bloga: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie zaktualizowano wpis bloga',
      data: data as BlogPostRow
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception updating blog post ${id}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas aktualizacji wpisu bloga: ${errorMessage}`,
      error: e
    };
  }
}

export async function deleteBlogPost(id: number): Promise<SupabaseOperationResponse> {
  try {
    const { error } = await supabaseClient
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting blog post ${id}:`, error.message);
      return {
        success: false,
        message: `Błąd podczas usuwania wpisu bloga: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie usunięto wpis bloga'
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception deleting blog post ${id}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas usuwania wpisu bloga: ${errorMessage}`,
      error: e
    };
  }
}

// Document Management
export async function fetchDocuments(includeUnpublished: boolean = false): Promise<SupabaseOperationResponse> {
  try {
    let query = supabaseClient
      .from('documents')
      .select('*');

    // Filter for published documents only if specified
    if (!includeUnpublished) {
      query = query.eq('is_published', true)
    }

    // Order by created_at date (most recent first)
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching documents:', error.message);
      return {
        success: false,
        message: `Błąd podczas pobierania dokumentów: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie pobrano dokumenty',
      data: data as DocumentRow[]
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error('Exception fetching documents:', errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas pobierania dokumentów: ${errorMessage}`,
      error: e
    };
  }
}

export async function fetchDocumentById(id: number): Promise<SupabaseOperationResponse> {
  try {
    const { data, error } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching document with id ${id}:`, error.message);
      return {
        success: false,
        message: `Błąd podczas pobierania dokumentu: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie pobrano dokument',
      data: data as DocumentRow
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception fetching document with id ${id}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas pobierania dokumentu: ${errorMessage}`,
      error: e
    };
  }
}

export async function createDocument(document: Omit<DocumentRow, 'id' | 'created_at' | 'updated_at' | 'download_count'>): Promise<SupabaseOperationResponse> {
  try {
    // Initialize fields
    const documentData = {
      ...document,
      download_count: 0
    };

    const { data, error } = await supabaseClient
      .from('documents')
      .insert(documentData)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating document:', error.message);
      return {
        success: false,
        message: `Błąd podczas dodawania dokumentu: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie dodano dokument',
      data: data as DocumentRow
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error('Exception creating document:', errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas dodawania dokumentu: ${errorMessage}`,
      error: e
    };
  }
}

export async function updateDocument(id: number, document: Partial<Omit<DocumentRow, 'id' | 'created_at' | 'updated_at' | 'download_count'>>): Promise<SupabaseOperationResponse> {
  try {
    // Update the document with current timestamp
    const documentData = {
      ...document,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseClient
      .from('documents')
      .update(documentData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating document ${id}:`, error.message);
      return {
        success: false,
        message: `Błąd podczas aktualizacji dokumentu: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie zaktualizowano dokument',
      data: data as DocumentRow
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception updating document ${id}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas aktualizacji dokumentu: ${errorMessage}`,
      error: e
    };
  }
}

export async function deleteDocument(id: number): Promise<SupabaseOperationResponse> {
  try {
    // Get the document to find its file_key
    const { data: document, error: fetchError } = await supabaseClient
      .from('documents')
      .select('file_key')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error(`Error fetching document ${id} before delete:`, fetchError.message);
      return {
        success: false,
        message: `Błąd podczas pobierania informacji o dokumencie: ${fetchError.message}`,
        error: fetchError
      };
    }

    // Delete the document record
    const { error: deleteError } = await supabaseClient
      .from('documents')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(`Error deleting document ${id}:`, deleteError.message);
      return {
        success: false,
        message: `Błąd podczas usuwania dokumentu: ${deleteError.message}`,
        error: deleteError
      };
    }

    // Delete the file from storage if file_key exists
    if (document?.file_key) {
      const { error: storageError } = await supabaseClient
        .storage
        .from('documents')
        .remove([document.file_key]);

      if (storageError) {
        console.error(`Error deleting document file ${document.file_key}:`, storageError.message);
        return {
          success: true,
          message: 'Dokument został usunięty z bazy danych, ale nie udało się usunąć pliku z magazynu.'
        };
      }
    }

    return {
      success: true,
      message: 'Pomyślnie usunięto dokument wraz z plikiem'
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception deleting document ${id}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas usuwania dokumentu: ${errorMessage}`,
      error: e
    };
  }
}

// Increment download count for document
export async function incrementDocumentDownloadCount(id: number): Promise<SupabaseOperationResponse> {
  try {
    const { data, error } = await supabaseClient.rpc('increment_download_count', { document_id: id });

    if (error) {
      console.error(`Error incrementing download count for document ${id}:`, error.message);
      // Silently fail, don't show error to user
      return {
        success: false,
        message: `Nie udało się zaktualizować licznika pobrań: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie zaktualizowano licznik pobrań',
      data
    };
  } catch (e) {
    // Silently fail, this isn't critical functionality
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception incrementing download count for document ${id}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas aktualizacji licznika pobrań: ${errorMessage}`,
      error: e
    };
  }
}

// Product Category Management
export async function fetchProductCategories(includeUnpublished: boolean = false): Promise<SupabaseOperationResponse> {
  try {
    let query = supabaseClient
      .from('product_categories')
      .select('*');

    // Filter for published categories only if specified
    if (!includeUnpublished) {
      query = query.eq('is_published', true)
    }

    // Order by name
    query = query.order('name');

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching product categories:', error.message);
      return {
        success: false,
        message: `Błąd podczas pobierania kategorii produktów: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie pobrano kategorie produktów',
      data: data as ProductCategoryRow[]
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error('Exception fetching product categories:', errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas pobierania kategorii produktów: ${errorMessage}`,
      error: e
    };
  }
}

export async function fetchProductCategoryById(id: number): Promise<SupabaseOperationResponse> {
  try {
    const { data, error } = await supabaseClient
      .from('product_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching product category with id ${id}:`, error.message);
      return {
        success: false,
        message: `Błąd podczas pobierania kategorii produktu: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie pobrano kategorię produktu',
      data: data as ProductCategoryRow
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception fetching product category with id ${id}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas pobierania kategorii produktu: ${errorMessage}`,
      error: e
    };
  }
}

export async function createProductCategory(category: Omit<ProductCategoryRow, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseOperationResponse> {
  try {
    // Check if category code is unique
    const { data: existingCategory } = await supabaseClient
      .from('product_categories')
      .select('id')
      .eq('category_code', category.category_code)
      .maybeSingle();

    if (existingCategory) {
      return {
        success: false,
        message: `Kategoria o kodzie "${category.category_code}" już istnieje. Użyj innego kodu.`
      };
    }

    const { data, error } = await supabaseClient
      .from('product_categories')
      .insert(category)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating product category:', error.message);
      return {
        success: false,
        message: `Błąd podczas tworzenia kategorii produktu: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie utworzono kategorię produktu',
      data: data as ProductCategoryRow
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error('Exception creating product category:', errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas tworzenia kategorii produktu: ${errorMessage}`,
      error: e
    };
  }
}

export async function updateProductCategory(id: number, category: Partial<Omit<ProductCategoryRow, 'id' | 'created_at' | 'updated_at'>>): Promise<SupabaseOperationResponse> {
  try {
    // If category_code is being updated, check if it's unique
    if (category.category_code) {
      const { data: existingCategory } = await supabaseClient
        .from('product_categories')
        .select('id')
        .eq('category_code', category.category_code)
        .neq('id', id)
        .maybeSingle();

      if (existingCategory) {
        return {
          success: false,
          message: `Kategoria o kodzie "${category.category_code}" już istnieje. Użyj innego kodu.`
        };
      }
    }

    // Update the category with current timestamp
    const categoryData = {
      ...category,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseClient
      .from('product_categories')
      .update(categoryData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating product category ${id}:`, error.message);
      return {
        success: false,
        message: `Błąd podczas aktualizacji kategorii produktu: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie zaktualizowano kategorię produktu',
      data: data as ProductCategoryRow
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception updating product category ${id}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas aktualizacji kategorii produktu: ${errorMessage}`,
      error: e
    };
  }
}

export async function deleteProductCategory(id: number): Promise<SupabaseOperationResponse> {
  try {
    // Check if there are any product requirements that depend on this category
    const { data: dependentRequirements, error: reqCheckError } = await supabaseClient
      .from('product_requirements')
      .select('id')
      .eq('category_id', id);

    if (reqCheckError) {
      console.error(`Error checking dependent requirements for category ${id}:`, reqCheckError.message);
      return {
        success: false,
        message: `Błąd podczas sprawdzania powiązanych wymagań: ${reqCheckError.message}`,
        error: reqCheckError
      };
    }

    // If there are dependent requirements, delete them first
    if (dependentRequirements && dependentRequirements.length > 0) {
      const { error: deleteReqError } = await supabaseClient
        .from('product_requirements')
        .delete()
        .eq('category_id', id);

      if (deleteReqError) {
        console.error(`Error deleting dependent requirements for category ${id}:`, deleteReqError.message);
        return {
          success: false,
          message: `Błąd podczas usuwania powiązanych wymagań: ${deleteReqError.message}`,
          error: deleteReqError
        };
      }
    }

    // Now delete the category
    const { error } = await supabaseClient
      .from('product_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting product category ${id}:`, error.message);
      return {
        success: false,
        message: `Błąd podczas usuwania kategorii produktu: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie usunięto kategorię produktu wraz z powiązanymi wymaganiami'
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception deleting product category ${id}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas usuwania kategorii produktu: ${errorMessage}`,
      error: e
    };
  }
}

// Product Requirement Management
export async function fetchProductRequirementsByCategory(categoryId: number): Promise<SupabaseOperationResponse> {
  try {
    const { data, error } = await supabaseClient
      .from('product_requirements')
      .select('*')
      .eq('category_id', categoryId)
      .order('order_index');

    if (error) {
      console.error(`Error fetching product requirements for category ${categoryId}:`, error.message);
      return {
        success: false,
        message: `Błąd podczas pobierania wymagań dla kategorii: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie pobrano wymagania dla kategorii',
      data: data as ProductRequirementRow[]
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception fetching product requirements for category ${categoryId}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas pobierania wymagań dla kategorii: ${errorMessage}`,
      error: e
    };
  }
}

export async function fetchProductRequirementById(id: number): Promise<SupabaseOperationResponse> {
  try {
    const { data, error } = await supabaseClient
      .from('product_requirements')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching product requirement with id ${id}:`, error.message);
      return {
        success: false,
        message: `Błąd podczas pobierania wymagania produktu: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie pobrano wymaganie produktu',
      data: data as ProductRequirementRow
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception fetching product requirement with id ${id}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas pobierania wymagania produktu: ${errorMessage}`,
      error: e
    };
  }
}

export async function createProductRequirement(requirement: Omit<ProductRequirementRow, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseOperationResponse> {
  try {
    // Check if code is unique within this category
    const { data: existingRequirement } = await supabaseClient
      .from('product_requirements')
      .select('id')
      .eq('category_id', requirement.category_id)
      .eq('requirement_code', requirement.requirement_code)
      .maybeSingle();

    if (existingRequirement) {
      return {
        success: false,
        message: `Wymaganie o kodzie "${requirement.requirement_code}" już istnieje w tej kategorii. Użyj innego kodu.`
      };
    }

    const { data, error } = await supabaseClient
      .from('product_requirements')
      .insert(requirement)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating product requirement:', error.message);
      return {
        success: false,
        message: `Błąd podczas tworzenia wymagania produktu: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie utworzono wymaganie produktu',
      data: data as ProductRequirementRow
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error('Exception creating product requirement:', errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas tworzenia wymagania produktu: ${errorMessage}`,
      error: e
    };
  }
}

export async function updateProductRequirement(id: number, requirement: Partial<Omit<ProductRequirementRow, 'id' | 'created_at' | 'updated_at'>>): Promise<SupabaseOperationResponse> {
  try {
    // If requirement_code is being updated, check if it's unique within the category
    if (requirement.requirement_code || requirement.category_id) {
      // First get the current requirement to know which category it belongs to
      const { data: currentRequirement, error: fetchError } = await supabaseClient
        .from('product_requirements')
        .select('category_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error(`Error fetching requirement ${id} before update:`, fetchError.message);
        return {
          success: false,
          message: `Błąd podczas pobierania informacji o wymaganiu: ${fetchError.message}`,
          error: fetchError
        };
      }

      // Check for code uniqueness within category
      const categoryId = requirement.category_id || currentRequirement.category_id;
      if (requirement.requirement_code) {
        const { data: existingRequirement } = await supabaseClient
          .from('product_requirements')
          .select('id')
          .eq('category_id', categoryId)
          .eq('requirement_code', requirement.requirement_code)
          .neq('id', id)
          .maybeSingle();

        if (existingRequirement) {
          return {
            success: false,
            message: `Wymaganie o kodzie "${requirement.requirement_code}" już istnieje w tej kategorii. Użyj innego kodu.`
          };
        }
      }
    }

    // Update the requirement with current timestamp
    const requirementData = {
      ...requirement,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseClient
      .from('product_requirements')
      .update(requirementData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating product requirement ${id}:`, error.message);
      return {
        success: false,
        message: `Błąd podczas aktualizacji wymagania produktu: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie zaktualizowano wymaganie produktu',
      data: data as ProductRequirementRow
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception updating product requirement ${id}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas aktualizacji wymagania produktu: ${errorMessage}`,
      error: e
    };
  }
}

export async function deleteProductRequirement(id: number): Promise<SupabaseOperationResponse> {
  try {
    const { error } = await supabaseClient
      .from('product_requirements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting product requirement ${id}:`, error.message);
      return {
        success: false,
        message: `Błąd podczas usuwania wymagania produktu: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Pomyślnie usunięto wymaganie produktu'
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception deleting product requirement ${id}:`, errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas usuwania wymagania produktu: ${errorMessage}`,
      error: e
    };
  }
}

export async function addDocument(documentData: { title: string; description: string; category: string; file: File }): Promise<SupabaseOperationResponse> {
  try {
    // First upload the file
    const fileResult = await uploadDocumentFile(documentData.file);

    if (!fileResult.success) {
      return fileResult; // Return the error from file upload
    }

    // Now create the document record
    const document = {
      title: documentData.title,
      description: documentData.description || null,
      category: documentData.category,
      file_key: fileResult.data.key,
      file_name: fileResult.data.name,
      file_size: fileResult.data.size,
      file_type: fileResult.data.type,
      is_published: true
    };

    return await createDocument(document);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error('Exception adding document:', errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas dodawania dokumentu: ${errorMessage}`,
      error: e
    };
  }
}

export async function getDocumentDownloadUrl(id: number): Promise<string | null> {
  try {
    // First get the document to find its file_key
    const result = await fetchDocumentById(id);

    if (!result.success || !result.data) {
      console.error(`Error fetching document ${id}:`, result.message);
      return null;
    }

    const document = result.data as DocumentRow;

    // Increment download count (don't await, fire and forget)
    incrementDocumentDownloadCount(id).catch(err => {
      console.error(`Error incrementing download count for document ${id}:`, err);
    });

    // Return the public URL
    const { data } = supabaseClient
      .storage
      .from('documents')
      .getPublicUrl(document.file_key);

    return data.publicUrl;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error(`Exception getting document download URL for ${id}:`, errorMessage);
    return null;
  }
}

// Storage helper function for document files
export async function uploadDocumentFile(file: File, folder: string = 'documents'): Promise<SupabaseOperationResponse> {
  try {
    // Create a unique file name to avoid collisions (timestamp + original filename)
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `${timestamp}_${file.name}`;

    // Upload the file
    const { data, error } = await supabaseClient
      .storage
      .from(folder)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading document file:', error.message);
      return {
        success: false,
        message: `Błąd podczas przesyłania pliku: ${error.message}`,
        error
      };
    }

    // Get the public URL for the file
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from(folder)
      .getPublicUrl(data.path);

    return {
      success: true,
      message: 'Pomyślnie przesłano plik',
      data: {
        key: data.path,
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl
      }
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Nieznany błąd';
    console.error('Exception uploading document file:', errorMessage);
    return {
      success: false,
      message: `Wystąpił błąd podczas przesyłania pliku: ${errorMessage}`,
      error: e
    };
  }
}

export async function fetchProductWithRequirements(id: string): Promise<any> {
  try {
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      throw new Error("Invalid category ID");
    }

    const { data: category, error } = await supabaseClient
      .from('product_categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) {
      console.error(`Error fetching product category with requirements ${id}:`, error.message);
      return null;
    }

    // Mock requirements if not present in metadata or separate table
    // In a real app, this would fetch from product_requirements or parse metadata
    const requirements = category.metadata?.requirements || {
      title: "Wymagania CPR",
      description: "Szczegółowe wymagania dla tej kategorii będą dostępne wkrótce.",
      mandatoryTests: [],
      documentationRequired: [],
      cprChanges: [],
      certificationSystems: []
    };

    return {
      ...category,
      code: category.category_code,
      requirements
    };
  } catch (e) {
    console.error(`Exception in fetchProductWithRequirements:`, e);
    return null;
  }
}
