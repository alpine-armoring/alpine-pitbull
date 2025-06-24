import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'cache', 'instagram.json');
const CACHE_TTL = 24 * 60 * 60 * 9000; // 1 day

// Ensure cache directory exists
function ensureCacheDir() {
  const cacheDir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
}

function readCache() {
  try {
    ensureCacheDir();
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      const now = Date.now();

      if (cacheData.timestamp && now - cacheData.timestamp < CACHE_TTL) {
        return cacheData.data;
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading Instagram cache:', error);
    return null;
  }
}

function writeCache(data) {
  try {
    ensureCacheDir();
    const cacheData = {
      data: data,
      timestamp: Date.now(),
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.error('Error writing Instagram cache:', error);
  }
}

// Extract shortcode from Instagram permalink
function extractShortcode(permalink) {
  if (!permalink) return '';
  // Match both /p/SHORTCODE/ and /reel/SHORTCODE/ patterns
  const match = permalink.match(/\/(?:p|reel)\/([^\/\?]+)/);
  return match ? match[1] : '';
}

export async function getInstagramFeedWithFileCache() {
  try {
    // Try to get from cache first
    const cachedData = readCache();
    if (cachedData) {
      return cachedData;
    }

    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost =
      'instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com';
    const userId = '69557331263';

    if (!rapidApiKey) {
      console.error('RapidAPI key not found');
      return cachedData || [];
    }

    const headers = {
      'x-rapidapi-key': rapidApiKey,
      'x-rapidapi-host': rapidApiHost,
    };

    // Fetch both posts and reels in parallel
    const [postsResponse, reelsResponse] = await Promise.allSettled([
      fetch(`https://${rapidApiHost}/posts_by_user_id?user_id=${userId}`, {
        method: 'GET',
        headers,
      }),
      fetch(
        `https://${rapidApiHost}/reels?user_id=${userId}&include_feed_video=true`,
        {
          method: 'GET',
          headers,
        }
      ),
    ]);

    let allContent = [];

    console.log(postsResponse);

    // Process regular posts
    if (postsResponse.status === 'fulfilled' && postsResponse.value.ok) {
      try {
        const postsData = await postsResponse.value.json();
        const posts = transformInstagramPosts(
          postsData.data || postsData.items || []
        );
        allContent.push(...posts);
      } catch (error) {
        console.warn('Error parsing posts data:', error);
      }
    }

    // Process reels
    if (reelsResponse.status === 'fulfilled' && reelsResponse.value.ok) {
      try {
        const reelsData = await reelsResponse.value.json();

        // Find reels array in the response
        let reelsArray = null;
        if (reelsData.items && Array.isArray(reelsData.items)) {
          reelsArray = reelsData.items;
        } else if (reelsData.data && Array.isArray(reelsData.data)) {
          reelsArray = reelsData.data;
        } else if (
          reelsData.data &&
          reelsData.data.items &&
          Array.isArray(reelsData.data.items)
        ) {
          reelsArray = reelsData.data.items;
        }

        if (reelsArray && reelsArray.length > 0) {
          const reels = transformInstagramReels(reelsArray);
          allContent.push(...reels);
        }
      } catch (error) {
        console.warn('Error parsing reels data:', error);
      }
    }

    // Deduplicate and sort content
    const uniqueContent = [];
    const seenIds = new Set();
    const seenCodes = new Set();

    // Sort all content by timestamp first
    const sortedContent = allContent.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Deduplicate by ID and shortcode, preferring reels over posts
    for (const item of sortedContent) {
      if (!item || !item.id) continue;

      const shortcode = extractShortcode(item.permalink);
      const isDuplicate =
        seenIds.has(item.id) || (shortcode && seenCodes.has(shortcode));

      if (!isDuplicate) {
        seenIds.add(item.id);
        if (shortcode) seenCodes.add(shortcode);
        uniqueContent.push(item);
      } else {
        // Check if we should replace existing item
        const existingByIdIndex = uniqueContent.findIndex(
          (existing) => existing.id === item.id
        );
        const existingByCodeIndex = shortcode
          ? uniqueContent.findIndex(
              (existing) => extractShortcode(existing.permalink) === shortcode
            )
          : -1;

        const existingIndex =
          existingByIdIndex !== -1 ? existingByIdIndex : existingByCodeIndex;

        if (existingIndex !== -1) {
          const existing = uniqueContent[existingIndex];
          // Prefer reels over posts for the same content
          if (item.is_reel && !existing.is_reel) {
            uniqueContent[existingIndex] = item;
          }
        }
      }
    }

    // Take top 6 after deduplication
    const finalContent = uniqueContent.slice(0, 6);

    // Save to cache
    if (finalContent.length > 0) {
      writeCache(finalContent);
      return finalContent;
    }

    // If no new content but we have cached data, return it
    const fallbackCache = readCache();
    return fallbackCache || [];
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    // Try to return cached data as fallback
    const cachedData = readCache();
    return cachedData || [];
  }
}

// Transform regular posts
function transformInstagramPosts(posts) {
  if (!Array.isArray(posts)) return [];

  return posts.map((post) => {
    // Determine media type
    let mediaType = 'IMAGE';
    let mediaUrl =
      post.display_url || post.image_versions2?.candidates?.[0]?.url;
    let thumbnailUrl = mediaUrl;

    // Check if it's a video post
    if (post.is_video || post.media_type === 2 || post.video_url) {
      mediaType = 'VIDEO';
      mediaUrl = post.video_url || mediaUrl;
      thumbnailUrl =
        post.display_url || post.image_versions2?.candidates?.[0]?.url;
    }

    // Check for carousel
    if (post.carousel_media || post.edge_sidecar_to_children) {
      mediaType = 'CAROUSEL_ALBUM';
    }

    return {
      id:
        post.id || post.pk || `post_${Math.random().toString(36).substr(2, 9)}`,
      media_type: mediaType,
      media_url: mediaUrl,
      thumbnail_url: thumbnailUrl,
      permalink: `https://instagram.com/p/${post.code || post.shortcode}/`,
      caption:
        post.caption?.text ||
        post.edge_media_to_caption?.edges?.[0]?.node?.text ||
        '',
      timestamp: post.taken_at
        ? new Date(post.taken_at * 1000).toISOString()
        : new Date().toISOString(),
      like_count: post.like_count || post.edge_media_preview_like?.count || 0,
      comments_count:
        post.comment_count || post.edge_media_to_comment?.count || 0,
      is_reel: false,
      content_source: 'post',
    };
  });
}

// Transform reels
function transformInstagramReels(reels) {
  if (!Array.isArray(reels)) return [];

  return reels.map((item) => {
    // The reel data might be directly in the item or nested in a 'media' property
    const reel = item.media || item;

    // Get video URL from video_versions array
    const videoUrl = reel.video_versions?.[0]?.url || reel.video_url;

    // Get thumbnail from image_versions2
    const thumbnailUrl =
      reel.image_versions2?.candidates?.[0]?.url || reel.display_url;

    return {
      id:
        reel.pk || reel.id || `reel_${Math.random().toString(36).substr(2, 9)}`,
      media_type: 'VIDEO',
      media_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      permalink: `https://instagram.com/reel/${reel.code}/`,
      caption: reel.caption?.text || '',
      timestamp: reel.taken_at
        ? new Date(reel.taken_at * 1000).toISOString()
        : new Date().toISOString(),
      like_count: reel.like_count || reel.play_count || 0,
      comments_count: reel.comment_count || 0,
      is_reel: true,
      content_source: 'reel',
    };
  });
}

// Helper function to manually clear cache
export function clearInstagramCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error clearing Instagram cache:', error);
    return false;
  }
}

// Helper function to get cache info
export function getInstagramCacheInfo() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      const now = Date.now();
      const age = now - cacheData.timestamp;
      const isValid = age < CACHE_TTL;

      return {
        exists: true,
        isValid,
        ageMinutes: Math.floor(age / (1000 * 60)),
        itemCount: cacheData.data?.length || 0,
        lastUpdated: new Date(cacheData.timestamp).toISOString(),
      };
    }
    return { exists: false };
  } catch (error) {
    console.error('Error getting cache info:', error);
    return { exists: false, error: error.message };
  }
}
