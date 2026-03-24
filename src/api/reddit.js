// this file handles simple api calls to reddit
// use reddit proxy in local dev, netlify function in production
export const API_ROOT = process.env.NODE_ENV === 'development'
  ? ''
  : '/.netlify/functions/reddit?path=';

const redditHeaders = {
  'User-Agent': 'reddit-client',
};

// normalize reddit path so it works with proxy query param
const normalizeRedditPath = (path) => {
  if (!path) return '';
  const withoutTrailingSlash = path.endsWith('/') ? path.slice(0, -1) : path;
  return withoutTrailingSlash.startsWith('/')
    ? withoutTrailingSlash.slice(1)
    : withoutTrailingSlash;
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
  // fetch posts from reddit
  const json = await fetchRedditJson(url);
  return json.data.children.map((post) => post.data);
};

export const getSubreddits = async () => {
  // this gets subreddit list for sidebar
  const url = `${API_ROOT}subreddits.json`;
  const json = await fetchRedditJson(url);
  return json.data.children.map((subreddit) => subreddit.data);
};

export const getPostComments = async (permalink) => {
  // this gets comments for one post
  const normalized = normalizeRedditPath(permalink);
  const url = `${API_ROOT}${normalized}.json`;
  const json = await fetchRedditJson(url);
  // json[1] is the comments listing for the submission.
  // Each child has a "data" object with the comment info.
  if (!json[1] || !json[1].data || !json[1].data.children) return [];
  return json[1].data.children.map((entry) => entry.data);
};
