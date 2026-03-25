// This file handles API calls for the Reddit-style feed,
// but it uses DummyJSON instead of the real Reddit API.

const DUMMYJSON_BASE = 'https://dummyjson.com';

const fetchDummyJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`DummyJSON request failed (${response.status})`);
  }
  return response.json();
};

const createFakeCreatedUtc = (index) => {
  // Fake "recent" timestamps so the UI looks alive.
  // Example: now - index * 2 hours.
  const now = Math.floor(Date.now() / 1000);
  return now - index * 2 * 60 * 60;
};

const normalizePost = async (post, index) => {
  // The UI expects a Reddit-like shape, so we map DummyJSON fields into
  // whatever `Post.jsx` and the Redux slice already use.
  let author = 'user';
  try {
    const user = await fetchDummyJson(`${DUMMYJSON_BASE}/users/${post.userId}`);
    author =
      user.username ||
      user.fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(' ') ||
      'user';
  } catch (e) {
    // If user lookup fails, keep the app usable.
  }

  return {
    id: post.id,
    title: post.title,
    body: post.body,
    author,
    created_utc: createFakeCreatedUtc(index),
    ups: post.reactions?.likes || 0,
    num_comments: 0,
    permalink: String(post.id),
    preview: null,
    tags: post.tags || [],
    views: post.views || 0,
    // Visual cards: use Picsum so every post has an image.
    image: `https://picsum.photos/seed/post-${post.id}/600/400`,
    thumbnail: `https://picsum.photos/seed/post-${post.id}/400/260`,
    showingComments: false,
    comments: [],
    loadingComments: false,
    errorComments: false,
    commentsLoaded: false,
  };
};

const normalizeComment = (comment, index) => {
  // Keep comment shape small and consistent for `Comment.jsx`.
  const author =
    comment.user?.username || comment.user?.fullName || 'user';

  return {
    id: comment.id,
    author,
    body: comment.body,
    created_utc: createFakeCreatedUtc(index),
  };
};

// Feed behavior:
// - selectedFeed === "popular" => GET /posts?limit=20
// - otherwise => GET /posts/tag/{slug}
export const getSubredditPosts = async (selectedFeed) => {
  const feed = selectedFeed || 'popular';
  const isPopular = feed === 'popular';
  const url = isPopular
    ? `${DUMMYJSON_BASE}/posts?limit=20`
    : `${DUMMYJSON_BASE}/posts/tag/${feed}`;

  // This fetch returns DummyJSON "posts", then we normalize them into the
  // same shape the app already renders.
  const json = await fetchDummyJson(url);
  const posts = json.posts || [];

  // Normalize so existing UI/components can stay mostly unchanged.
  return Promise.all(posts.map((post, index) => normalizePost(post, index)));
};

// Sidebar behavior:
// Fetch tags from DummyJSON and return a small tidy list.
export const getSubreddits = async () => {
  // DummyJSON provides tags, but the app calls them "subreddits".
  // We still return the same sidebar-friendly fields.
  const tags = await fetchDummyJson(`${DUMMYJSON_BASE}/posts/tags`);

  const primaryPalette = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#06b6d4',
    '#22c55e',
    '#f97316',
  ];

  const placeholderIconData = (label, color) => {
    const cleanLabel = (label || '?').toUpperCase().slice(0, 1);
    const bg = color || '#e5e7eb';
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><circle cx="22" cy="22" r="20" fill="${bg}"/><text x="22" y="27" font-family="Arial" font-size="16" font-weight="700" text-anchor="middle" fill="#ffffff">${cleanLabel}</text></svg>`
    )}`;
  };

  const selectedSlugs = ['history', 'crime', 'life', 'love', 'mystery', 'nature', 'books'];

  const popular = {
    id: 'popular',
    display_name: 'popular',
    url: 'popular',
    icon_img: placeholderIconData('p', '#3b82f6'),
    community_icon: placeholderIconData('p', '#3b82f6'),
    primary_color: '#3b82f6',
  };

  const normalized = selectedSlugs
    .map((slug, index) => {
      const tag = tags.find((t) => t.slug === slug);
      if (!tag) return null;

      const color = primaryPalette[index % primaryPalette.length];
      return {
        id: slug,
        display_name: tag.name || slug,
        url: slug,
        icon_img: placeholderIconData(tag.name || slug, color),
        community_icon: placeholderIconData(tag.name || slug, color),
        primary_color: color,
      };
    })
    .filter(Boolean);

  return [popular, ...normalized];
};

// Comments behavior:
// When the user opens comments for a post, fetch from:
// GET /posts/{id}/comments
export const getPostComments = async (postId) => {
  // Comments are loaded on demand when the user expands a post.
  const url = `${DUMMYJSON_BASE}/posts/${postId}/comments`;
  const json = await fetchDummyJson(url);
  const comments = json.comments || [];
  return comments.map((comment, index) => normalizeComment(comment, index));
};
