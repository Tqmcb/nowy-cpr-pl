
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  updated_at?: string;
  is_published: boolean;
  category: string;
  image_url: string;
  tags?: string[];
}

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // In production, this fetches from the static JSON file in the public directory
    const response = await fetch('/content/posts.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
};

export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const posts = await fetchBlogPosts();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
};
