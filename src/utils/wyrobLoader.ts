/**
 * Simple browser-compatible frontmatter parser.
 * Mirrors the pattern from blogLoader.ts but loads from /content/wyroby/*.md
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
            } else if (value.startsWith('[')) {
                // Inline JSON array: normy: ["EN 13956", "EN 13967"]
                try {
                    data[currentKey] = JSON.parse(value);
                } catch {
                    data[currentKey] = value;
                }
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
export interface ProductFamily {
    id: string;
    slug: string;
    title: string;
    family_number: number;
    family_name_en: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    category: string;
    avs_system: string;
    normy: string[];
    tags: string[];
    image_url: string;
}

export interface WyrobiMetadata {
    title: string;
    family_number: number;
    family_name_en: string;
    date: string;
    author: string;
    category: string;
    avs_system: string;
    normy: string[];
    tags: string[];
    excerpt: string;
    image_url: string;
}

export async function getAllWyroby(): Promise<ProductFamily[]> {
    try {
        const markdownFiles = import.meta.glob('/content/wyroby/*.md', {
            query: '?raw',
            import: 'default'
        });

        const wyroby: ProductFamily[] = [];

        for (const path in markdownFiles) {
            try {
                const fileContent = await markdownFiles[path]() as string;
                const { data, content } = parseFrontmatter(fileContent);
                const metadata = data as unknown as WyrobiMetadata;

                const filename = path.split('/').pop();
                const slug = filename?.replace('.md', '') || '';

                wyroby.push({
                    id: slug,
                    slug,
                    title: metadata.title ?? '',
                    family_number: metadata.family_number ?? 0,
                    family_name_en: metadata.family_name_en ?? '',
                    excerpt: metadata.excerpt ?? "",
                    content: content,
                    author: metadata.author ?? "",
                    date: metadata.date ?? "",
                    category: metadata.category ?? "",
                    avs_system: metadata.avs_system ?? "",
                    normy: metadata.normy ?? [],
                    tags: metadata.tags ?? [],
                    image_url: metadata.image_url ?? "",
                });
            } catch (err) {
                console.error("Error parsing "+path+":", err);
            }
        }

        return wyroby.sort((a, b) => a.family_number - b.family_number);
    } catch (error) {
        console.error("Error loading wyroby:", error);
        return [];
    }
}

export async function getWyrob(slug: string): Promise<ProductFamily | null> {
    const wyroby = await getAllWyroby();
    return wyroby.find(w => w.slug === slug) || null;
}

export async function getWyrobyByCategory(category: string): Promise<ProductFamily[]> {
    const wyroby = await getAllWyroby();
    return wyroby.filter(w => w.category === category);
}
