import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getSubredditPosts, getPostComments } from '../api/reddit';

const initialState = {
  posts: [],
  error: false,
  isLoading: false,
  searchTerm: '',
  // Feed selection for the DummyJSON-backed Reddit-style app.
  // Possible values: "popular", "history", "crime", "life", "love", ...
  selectedSubreddit: 'popular',
};

// redux state for posts, search and selected subreddit
const redditSlice = createSlice({
  name: 'redditPosts',
  initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
    },
    startGetPosts(state) {
      state.isLoading = true;
      state.error = false;
    },
    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.posts = action.payload;
    },
    getPostsFailed(state) {
      state.isLoading = false;
      state.error = true;
    },
    setSearchTerm(state, action) {
      // store current search text
      state.searchTerm = action.payload;
    },
    setSelectedSubreddit(state, action) {
      // change active subreddit
      state.selectedSubreddit = action.payload;
      state.searchTerm = '';
    },
    startGetComments(state, action) {
      // If we're hiding comment, don't fetch the comments.
      state.posts[action.payload].showingComments = !state.posts[action.payload]
        .showingComments;
      if (!state.posts[action.payload].showingComments) {
        return;
      }
      state.posts[action.payload].loadingComments = true;
      state.posts[action.payload].errorComments = false;
    },
    getCommentsSuccess(state, action) {
      const index = action.payload.index;
      state.posts[action.payload.index].loadingComments = false;
      state.posts[action.payload.index].errorComments = false;
      const existingComments = state.posts[index].comments || [];
      const fetchedComments = action.payload.comments || [];

      // If the user added a local comment while the API fetch was in flight,
      // keep the local one instead of overwriting.
      const mergedComments = existingComments.length
        ? [...existingComments, ...fetchedComments]
        : fetchedComments;

      state.posts[index].comments = mergedComments;
      state.posts[index].num_comments = mergedComments.length;
      state.posts[index].commentsLoaded = true;
    },
    getCommentsFailed(state, action) {
      state.posts[action.payload].loadingComments = false;
      state.posts[action.payload].errorComments = true;
    },
    // Local-only comments (no backend): used for "Add Comment" UI.
    addLocalComment(state, action) {
      const { index, comment } = action.payload;
      if (!state.posts[index]) return;

      state.posts[index].comments.push(comment);
      state.posts[index].num_comments = state.posts[index].comments.length;
      state.posts[index].showingComments = true;
      state.posts[index].loadingComments = false;
      state.posts[index].errorComments = false;
      state.posts[index].commentsLoaded = true;
    },
    // Local-only comment editing: no backend, just update Redux in-memory.
    editLocalComment(state, action) {
      const { index, commentId, newBody } = action.payload;
      if (!state.posts[index]) return;

      const comment = state.posts[index].comments.find(
        (c) => c.id === commentId
      );
      if (!comment) return;

      comment.body = newBody;
    },
    // Local-only comment deletion: removes immediately from Redux in-memory.
    deleteLocalComment(state, action) {
      const { index, commentId } = action.payload;
      if (!state.posts[index]) return;

      state.posts[index].comments = state.posts[index].comments.filter(
        (c) => c.id !== commentId
      );
      state.posts[index].num_comments = state.posts[index].comments.length;
      state.posts[index].commentsLoaded = true;
    },
  },
});

export const {
  setPosts,
  getPostsFailed,
  getPostsSuccess,
  startGetPosts,
  setSearchTerm,
  setSelectedSubreddit,
  getCommentsFailed,
  getCommentsSuccess,
  startGetComments,
  addLocalComment,
  editLocalComment,
  deleteLocalComment,
} = redditSlice.actions;

export default redditSlice.reducer;

// fetch posts from reddit and store them in redux
export const fetchPosts = (subreddit) => async (dispatch) => {
  try {
    // Fetch posts for the active feed (popular or a tag-based category).
    dispatch(startGetPosts());
    const posts = await getSubredditPosts(subreddit);

    // store posts in redux so we can reuse them with comment ui state
    const postsWithMetadata = posts.map((post) => ({
      ...post,
      showingComments: false,
      comments: [],
      loadingComments: false,
      errorComments: false,
      commentsLoaded: false,
    }));
    dispatch(getPostsSuccess(postsWithMetadata));
  } catch (error) {
    dispatch(getPostsFailed());
  }
};

// fetch comments for one post and store them in redux
export const fetchComments = (index, postId) => async (dispatch) => {
  try {
    dispatch(startGetComments(index));
    // Fetch comments for one post id.
    const comments = await getPostComments(postId);
    dispatch(getCommentsSuccess({ index, comments }));
  } catch (error) {
    dispatch(getCommentsFailed(index));
  }
};

const selectPosts = (state) => state.reddit.posts;
const selectSearchTerm = (state) => state.reddit.searchTerm;
export const selectSelectedSubreddit = (state) =>
  state.reddit.selectedSubreddit;

export const selectFilteredPosts = createSelector(
  [selectPosts, selectSearchTerm],
  (posts, searchTerm) => {
    if (searchTerm !== '') {
      return posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return posts;
  }
);
