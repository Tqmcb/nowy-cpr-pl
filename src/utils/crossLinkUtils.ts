import type { BlogPost } from "./blogLoader";
import type { ProductFamily } from "./wyrobLoader";

/**
 * Find related blog posts for a given wyrob (product family).
 * Matching logic: shared tags (case-insensitive), mentioned standards (normy) in blog content.
 * Returns up to `limit` posts sorted by relevance score.
 */
export function findRelatedBlogPosts(
  wyrob: ProductFamily,
  allPosts: BlogPost[],
  limit = 3
): BlogPost[] {
  const wyrobTags = new Set(wyrob.tags.map((t) => t.toLowerCase()));
  const wyrobNormy = wyrob.normy ?? [];

  const scored = allPosts.map((post) => {
    let score = 0;

    // Tag overlap (strongest signal)
    const postTags = (post.tags ?? []).map((t) => t.toLowerCase());
    for (const tag of postTags) {
      if (wyrobTags.has(tag)) score += 3;
    }

    // Standard (norma) mentioned in blog content
    for (const norma of wyrobNormy) {
      if (post.content.includes(norma) || post.title.includes(norma)) {
        score += 2;
      }
    }

    // Category keyword overlap (weak signal)
    if (
      wyrob.category &&
      (post.content.toLowerCase().includes(wyrob.category.toLowerCase()) ||
        post.title.toLowerCase().includes(wyrob.category.toLowerCase()))
    ) {
      score += 1;
    }

    return { post, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}

/**
 * Find related product families for a given blog post.
 * Matching logic: shared tags, standards mentioned in blog content, category keywords.
 * Returns up to `limit` wyroby sorted by relevance score.
 */
export function findRelatedWyroby(
  post: BlogPost,
  allWyroby: ProductFamily[],
  limit = 3
): ProductFamily[] {
  const postTags = new Set((post.tags ?? []).map((t) => t.toLowerCase()));
  const postContent = (post.content + " " + post.title).toLowerCase();

  const scored = allWyroby.map((wyrob) => {
    let score = 0;

    // Tag overlap
    for (const tag of wyrob.tags) {
      if (postTags.has(tag.toLowerCase())) score += 3;
    }

    // Standard mentioned in blog
    for (const norma of wyrob.normy ?? []) {
      if (postContent.includes(norma.toLowerCase())) {
        score += 2;
      }
    }

    // Product title/keywords mentioned in blog
    const titleWords = wyrob.title
      .toLowerCase()
      .split(/[\s–—,]+/)
      .filter((w) => w.length > 4);
    for (const word of titleWords) {
      if (postContent.includes(word)) score += 1;
    }

    return { wyrob, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.wyrob);
}
