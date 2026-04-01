/**
 * blogLoader.ts
 *
 * In PRODUCTION: loads posts via fetch() from pre-generated JSON files
 *   dist/posts/meta.json      — all metadata, no content (~50 KB total)
 *   dist/posts/<slug>.json    — individual post with full content (~10-15 KB)
 *
 * In DEVELOPMENT: falls back to import.meta.glob() for hot-reload support.
 *
 * This reduces data loaded per blog post from ~564 KB (all 55 posts) to ~15 KB.
 */

/**
 * Simple browser-compatible frontmatter parser (used in dev mode only).
 */
function parseFrontmatter(fileContent: string): { data: Record<string, unknown>; content: string } {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = fileContent.match(frontmatterRegex);

    if (!match) {
        return { data: {}, content: fileContent };
    }

    const yamlStr = match[1];
    const content = match[2];

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
            if (currentKey && currentArray) {
                data[currentKey] = currentArray;
            }
            currentKey = keyValueMatch[1];
            const value = keyValueMatch[2].trim();

            if (value === '') {
                currentArray = [];
            } else if (value.startsWith('[') && value.endsWith(']')) {
                try {
                    data[currentKey] = JSON.parse(value);
                } catch {
                    data[currentKey] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
                }
                currentArray = null;
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
    reviewed?: string;
    is_published: boolean;
    category: string;
    image_url: string;
    tags?: string[];
    template?: string;
    sources?: string[];
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
    reviewed?: string;
    sources?: string[];
}

// ── In-memory cache ────────────────────────────────────────────────────────────
// Populated on first call, re-used on every subsequent navigation (SPA).
let metaCache: BlogPost[] | null = null;
const postCache: Map<string, BlogPost> = new Map();

// ── Dev-mode fallback (import.meta.glob) ──────────────────────────────────────

async function loadAllPostsDev(): Promise<BlogPost[]> {
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
                updated_at: (metadata as Record<string, unknown>).updated as string ?? undefined,
                reviewed: metadata.reviewed ?? undefined,
                is_published: true,
                category: metadata.category,
                image_url: metadata.image_url,
                tags: Array.isArray(metadata.tags) ? metadata.tags : [],
                template: metadata.template,
                sources: Array.isArray(metadata.sources) ? metadata.sources : undefined,
            });
        } catch (err) {
            console.error(`Error parsing ${path}:`, err);
        }
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return posts
        .filter(post => new Date(post.published_at) <= today)
        .sort((a, b) =>
            new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Get all blog posts (metadata only in prod, full posts in dev).
 * Used for blog listing, category/tag filtering, related posts.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
    if (metaCache) return metaCache;

    if (import.meta.env.PROD) {
        try {
            const res = await fetch('/posts/meta.json');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const posts = await res.json() as BlogPost[];

            const today = new Date();
            today.setHours(23, 59, 59, 999);

            metaCache = posts
                .filter(post => new Date(post.published_at) <= today)
                .sort((a, b) =>
                    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
                );
            return metaCache;
        } catch (error) {
            console.error('Error loading posts/meta.json:', error);
            // Reload once on failure — likely stale assets after a new deployment
            const RELOAD_KEY = 'blogloader_reloaded';
            if (!sessionStorage.getItem(RELOAD_KEY)) {
                sessionStorage.setItem(RELOAD_KEY, '1');
                window.location.reload();
            }
            return [];
        }
    }

    // Dev mode: use import.meta.glob
    const posts = await loadAllPostsDev();
    metaCache = posts;
    return posts;
}

/**
 * Get a single blog post by slug — includes full markdown content.
 * In prod: fetches only the requested post's JSON (~10-15 KB).
 * In dev: loads all posts via glob and filters.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (postCache.has(slug)) return postCache.get(slug)!;

    if (import.meta.env.PROD) {
        try {
            const res = await fetch(`/posts/${slug}.json`);
            if (!res.ok) return null;
            const post = await res.json() as BlogPost;
            postCache.set(slug, post);
            return post;
        } catch (error) {
            console.error(`Error loading posts/${slug}.json:`, error);
            const RELOAD_KEY = 'blogloader_reloaded';
            if (!sessionStorage.getItem(RELOAD_KEY)) {
                sessionStorage.setItem(RELOAD_KEY, '1');
                window.location.reload();
            }
            return null;
        }
    }

    // Dev mode: load all and filter
    const posts = await loadAllPostsDev();
    return posts.find(post => post.slug === slug) || null;
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
    const posts = await getAllPosts();
    return posts.filter(post => post.category === category);
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
    const posts = await getAllPosts();
    return posts.filter(post => post.tags?.includes(tag));
}

/**
 * Get all unique categories
 */
export async function getAllCategories(): Promise<string[]> {
    const posts = await getAllPosts();
    const categories = new Set(posts.map(post => post.category));
    return Array.from(categories);
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
    const posts = await getAllPosts();
    const tags = new Set(posts.flatMap(post => post.tags || []));
    return Array.from(tags);
}
