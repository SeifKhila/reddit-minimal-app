// this file handles simple api calls to reddit
// use allorigins proxy to avoid cors in production
export const API_ROOT = 'https://api.allorigins.win/raw?url=https://www.reddit.com';

const redditHeaders = {
  'User-Agent': 'reddit-client',
};

// Normalize Reddit paths like "/r/pics/" -> "/r/pics"
// so we can safely append ".json" without producing "/.json".
const normalizeRedditPath = (path) => {
  if (!path) return '';
  return path.endsWith('/') ? path.slice(0, -1) : path;
};

const fetchRedditJson = async (url) => {
  // Simple fetch wrapper that adds the headers Reddit expects.
  const response = await fetch(url, { headers: redditHeaders });
  if (!response.ok) {
    throw new Error(`Reddit request failed (${response.status})`);
  }
  return response.json();
};

export const getSubredditPosts = async (subreddit) => {
  // this gets posts from reddit api
  const normalized = normalizeRedditPath(subreddit);
  const url = `${API_ROOT}${normalized}.json`;

  try {
    // fetch posts from reddit
    const json = await fetchRedditJson(url);
    return json.data.children.map((post) => post.data);
  } catch (error) {
    // Optional fallback if the first request is blocked
    // Example: ?raw_json=1
    const fallbackUrl = `${url}?raw_json=1`;
    const json = await fetchRedditJson(fallbackUrl);
    return json.data.children.map((post) => post.data);
  }
};

export const getSubreddits = async () => {
  // this gets subreddit list for sidebar
  const url = `${API_ROOT}/subreddits.json`;
  const json = await fetchRedditJson(url);
  return json.data.children.map((subreddit) => subreddit.data);
};

export const getPostComments = async (permalink) => {
  // this gets comments for one post
  const normalized = normalizeRedditPath(permalink);
  const url = `${API_ROOT}${normalized}.json`;

  try {
    const json = await fetchRedditJson(url);
    // json[1] is the comments listing for the submission.
    // Each child has a "data" object with the comment info.
    if (!json[1] || !json[1].data || !json[1].data.children) return [];
    return json[1].data.children.map((entry) => entry.data);
  } catch (error) {
    const fallbackUrl = `${url}?raw_json=1`;
    const json = await fetchRedditJson(fallbackUrl);
    if (!json[1] || !json[1].data || !json[1].data.children) return [];
    return json[1].data.children.map((entry) => entry.data);
  }
};
