/**
 * Utility functions for slugifying titles and building SEO-friendly watch URLs.
 * Example: Movie "Spider-Man: Across the Spider-Verse" (2023, ID 569094)
 * -> /watch/spider-man-across-the-spider-verse-2023-569094
 */

export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')       // Remove special chars
    .replace(/[\s_-]+/g, '-')       // Replace spaces and underscores with -
    .replace(/^-+|-+$/g, '');       // Trim leading/trailing -
}

export function getMediaWatchUrl(item, season = 1, episode = 1) {
  if (!item || !item.id) return '/';
  
  const title = item.title || item.name || 'title';
  const year = (item.release_date || item.first_air_date || '').substring(0, 4);
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  
  const titleWithYear = year ? `${title} ${year}` : title;
  const slug = slugify(titleWithYear);
  const combinedSlug = `${slug}-${item.id}`;

  if (mediaType === 'tv') {
    return `/watch/tv/${combinedSlug}?s=${season}&e=${episode}`;
  }
  return `/watch/${combinedSlug}`;
}

export function extractIdFromSlug(slugParam) {
  if (!slugParam) return null;
  // If slugParam is already a pure numeric ID e.g. "569094"
  if (/^\d+$/.test(slugParam)) return slugParam;
  
  // Extract trailing digits after last hyphen e.g. "spider-man-2023-569094" -> "569094"
  const match = slugParam.match(/-(\d+)$/);
  if (match && match[1]) {
    return match[1];
  }
  return slugParam;
}
