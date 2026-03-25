import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Post from '../Post/Post';
import PostLoading from '../Post/PostLoading';
import getRandomNumber from '../../utils/getRandomNumber';
import {
  fetchPosts,
  selectFilteredPosts,
  setSearchTerm,
  setSelectedSubreddit,
  fetchComments,
  addLocalComment,
  editLocalComment,
  deleteLocalComment,
} from '../../store/redditSlice';
import './Home.css';

// this component shows list of posts
const Home = () => {
  const reddit = useSelector((state) => state.reddit);
  const { isLoading, error, searchTerm, selectedSubreddit } = reddit;
  const posts = useSelector(selectFilteredPosts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts(selectedSubreddit));
  }, [dispatch, selectedSubreddit]);

  const onFetchCommentsForPost = (index) => (postId) => {
    // Comments are fetched when the user opens the modal (not on every render).
    dispatch(fetchComments(index, postId));
  };

  const onAddLocalComment = (index) => (comment) => {
    // "Add Comment" is local-only: we update the Redux post comments in-memory.
    dispatch(addLocalComment({ index, comment }));
  };

  const onEditLocalComment = (index) => (commentId, newBody) => {
    // Editing is local-only: update the comment text in Redux in-memory.
    dispatch(editLocalComment({ index, commentId, newBody }));
  };

  const onDeleteLocalComment = (index) => (commentId) => {
    // Deleting is local-only: remove the comment from Redux in-memory.
    dispatch(deleteLocalComment({ index, commentId }));
  };

  if (isLoading) {
    const loadingItems = Array(getRandomNumber(3, 10))
      .fill(null)
      .map((_, index) => <PostLoading key={index} />);

    return (
      // removed animation to avoid React warning
      <div className="posts-container">{loadingItems}</div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Failed to load posts.</h2>
        <button
          type="button"
          onClick={() => dispatch(fetchPosts(selectedSubreddit))}
        >
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="error">
        {searchTerm !== '' ? (
          <>
            <h2>No posts matching "{searchTerm}"</h2>
            <button
              type="button"
              onClick={() => dispatch(setSearchTerm(''))}
            >
              Go home
            </button>
          </>
        ) : (
          <>
            <h2>No posts available. Try another category.</h2>
            <button
              type="button"
              onClick={() => dispatch(setSelectedSubreddit('popular'))}
            >
              Go popular
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="posts-container">
      {/* render posts here */}
      {posts.map((post, index) => (
        <Post
          key={post.id}
          post={post}
          onFetchCommentsForPost={onFetchCommentsForPost(index)}
          onAddLocalComment={onAddLocalComment(index)}
          onEditLocalComment={onEditLocalComment(index)}
          onDeleteLocalComment={onDeleteLocalComment(index)}
        />
      ))}
    </div>
  );
};

export default Home;
