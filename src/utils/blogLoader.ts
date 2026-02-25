/**
 * Simple browser-compatible frontmatter parser.
 * Replaces gray-matter to avoid Node.js Buffer dependency.
 */
function parseFrontmatter(fileContent: string): { data: Record<string, unknown>; content: string } {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = fileContent.match(frontmatterRegex);

    if (!match) {
        return { data: {}, content: fileContent };
    }

    const yamlStr = match[1];
    const content = match[2];

    // Simple YAML parser for basic key: value pairs and arrays
    const data: Record<string, unknown> = {};
    const lines = yamlStr.split('\n');
    let currentKey: string | null = null;
    let currentArray: string[] | null = null;

    for (const line of lines) {
        const arrayItemMatch = line.match(/^  - (.+)$/);
        const keyValueMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*): ?(.*)$/);

        if (arrayItemMatch && currentKey && currentArray) {
            currentArray.push(arrayItemMatch[1].trim().replace(/^['"]|['"]$/g, ''));
        } else if (keyValueMatch) {
            // Save previous array if any
            if (currentKey && currentArray) {
                data[currentKey] = currentArray;
            }
            currentKey = keyValueMatch[1];
            const value = keyValueMatch[2].trim();

            if (value === '') {
                // Start of an array
                currentArray = [];
            } else if (value === 'true') {
                data[currentKey] = true;
                currentArray = null;
            } else if (value === 'false') {
                data[currentKey] = false;
                currentArray = null;
            } else if (!isNaN(Number(value)) && value !== '') {
                data[currentKey] = Number(value);
                currentArray = null;
            } else {
                data[currentKey] = value.replace(/^['"]|['"]$/g, '');
                currentArray = null;
            }
        }
    }

    // Save last array if any
    if (currentKey && currentArray) {
        data[currentKey] = currentArray;
    }

    return { data, content };
}

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
    template?: string;
}

export interface BlogMetadata {
    title: string;
    date: string;
    author: string;
    category: string;
    tags: string[];
    excerpt: string;
    image_url: string;
    template?: string;
}

/**
 * Get all blog posts from markdown files
 * @returns Array of BlogPost objects sorted by date (newest first)
 */
export async function getAllPosts(): Promise<BlogPost[]> {
    try {
        // Import all markdown files from content/blog directory
        const markdownFiles = import.meta.glob('/content/blog/*.md', {
            query: '?raw',
            import: 'default'
        });

        const posts: BlogPost[] = [];

        for (const path in markdownFiles) {
            try {
                const fileContent = await markdownFiles[path]() as string;
                const { data, content } = parseFrontmatter(fileContent);
                const metadata = data as unknown as BlogMetadata;

                // Extract slug from filename
                const filename = path.split('/').pop();
                const slug = filename?.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '') || '';

                posts.push({
                    id: slug,
                    slug,
                    title: metadata.title,
                    excerpt: metadata.excerpt,
                    content: content,
                    author: metadata.author,
                    published_at: metadata.date,
                    is_published: true,
                    category: metadata.category,
                    image_url: metadata.image_url,
                    tags: metadata.tags || [],
                    template: metadata.template,
                });
            } catch (err) {
                console.error(`Error parsing ${path}:`, err);
            }
        }

        // Sort by date, newest first
        return posts.sort((a, b) =>
            new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
    } catch (error) {
        console.error('Error loading blog posts:', error);
        return [];
    }
}

/**
 * Get a single blog post by slug
 * @param slug - The post slug
 * @returns BlogPost object or null if not found
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await getAllPosts();
    return posts.find(post => post.slug === slug) || null;
}

/**
 * Get posts by category
 * @param category - Category name
 * @returns Array of BlogPost objects
 */
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
    const posts = await getAllPosts();
    return posts.filter(post => post.category === category);
}

/**
 * Get posts by tag
 * @param tag - Tag name
 * @returns Array of BlogPost objects
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
    const posts = await getAllPosts();
    return posts.filter(post => post.tags?.includes(tag));
}

/**
 * Get all unique categories
 * @returns Array of category names
 */
export async function getAllCategories(): Promise<string[]> {
    const posts = await getAllPosts();
    const categories = new Set(posts.map(post => post.category));
    return Array.from(categories);
}

/**
 * Get all unique tags
 * @returns Array of tag names
 */
export async function getAllTags(): Promise<string[]> {
    const posts = await getAllPosts();
    const tags = new Set(posts.flatMap(post => post.tags || []));
    return Array.from(tags);
}
