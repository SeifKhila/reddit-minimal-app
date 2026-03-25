import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import './Post.css';
import {
  TiArrowUpOutline,
  TiArrowUpThick,
  TiArrowDownOutline,
  TiArrowDownThick,
} from 'react-icons/ti';
import moment from 'moment';
import shortenNumber from '../../utils/shortenNumber';
import Card from '../../components/Card/Card';
import Comment from '../Comment/Comment';
import Avatar from '../Avatar/Avatar';

// this component shows one post card
const Post = (props) => {
  const [voteValue, setVoteValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentBody, setCommentBody] = useState('');

  const {
    post,
    onFetchCommentsForPost,
    onAddLocalComment,
    onEditLocalComment,
    onDeleteLocalComment,
  } = props;

  // local vote state only for ui feedback
  const onHandleVote = (newValue) => {
    if (newValue === voteValue) {
      setVoteValue(0);
    } else if (newValue === 1) {
      setVoteValue(1);
    } else {
      setVoteValue(-1);
    }
  };

  const renderUpVote = () => {
    if (voteValue === 1) {
      return <TiArrowUpThick className="icon-action" />;
    }
    return <TiArrowUpOutline className="icon-action" />;
  };

  const renderDownVote = () => {
    if (voteValue === -1) {
      return <TiArrowDownThick className="icon-action" />;
    }
    return <TiArrowDownOutline className="icon-action" />;
  };

  const getVoteType = () => {
    if (voteValue === 1) {
      return 'up-vote';
    }
    if (voteValue === -1) {
      return 'down-vote';
    }

    return '';
  };

  const bodyPreview = post.body
    ? post.body.length > 180
      ? `${post.body.slice(0, 180)}...`
      : post.body
    : '';

  // DummyJSON posts don't have Reddit-style image previews,
  // so we show a short text preview + tag pills instead.
  const visibleTags = (post.tags || []).slice(0, 4);

  // We use Picsum so every post card has a consistent (and free) image.
  const fallbackImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="#6b7280">Post</text></svg>'
  )}`;

  // Voting is UI-only: we keep the vote state locally and adjust the score
  // shown on the card so it feels interactive.
  const displayedScore = (post.ups || 0) + voteValue;

  // When the modal opens, fetch comments from DummyJSON (only if we haven't loaded them yet).
  useEffect(() => {
    if (!isModalOpen) return;
    if (!post || post.commentsLoaded) return;
    if (post.loadingComments) return;
    if (post.errorComments) return;
    if (typeof onFetchCommentsForPost === 'function') {
      onFetchCommentsForPost(post.id);
    }
  }, [
    isModalOpen,
    post,
    onFetchCommentsForPost,
  ]);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen]);

  const handleSubmitModalComment = (e) => {
    e.preventDefault();
    const trimmed = commentBody.trim();
    if (!trimmed) return;

    // Local-only comment: no backend required.
    // We still store it in Redux so the UI updates immediately
    // (including the comment count on the post card).
    const newComment = {
      id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      author: 'currentUser',
      body: trimmed,
      created_utc: Math.floor(Date.now() / 1000),
    };

    onAddLocalComment(newComment);
    setCommentBody('');
    setIsAddingComment(false);
  };

  const openModal = () => {
    // Reset local comment UI each time the modal opens.
    setIsAddingComment(false);
    setCommentBody('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <article key={post.id} className="post-article">
      <Card className="post-card">
        <div className="post-media">
          <img
            src={post.image || post.thumbnail}
            alt={post.title}
            className="post-image"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImage;
            }}
          />
        </div>

        <div className="post-content">
          <h3
            className="post-title"
            title={post.title}
            onClick={openModal}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') openModal();
            }}
            aria-label="Open post"
          >
            {post.title}
          </h3>

          {bodyPreview && <p className="post-body-preview">{bodyPreview}</p>}

          {visibleTags.length > 0 && (
            <div className="tag-pills">
              {visibleTags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="post-footer">
            <span className="author-details">
              <Avatar name={post.author} />
              <span className="author-username">{post.author}</span>
            </span>

            <div className="vote-controls-inline">
              <button
                type="button"
                className={`icon-action-button up-vote ${
                  voteValue === 1 && 'active'
                }`}
                onClick={() => onHandleVote(1)}
                aria-label="Up vote"
              >
                {renderUpVote()}
              </button>

              <p className={`post-votes-value ${getVoteType()}`}>
                {shortenNumber(displayedScore, 1)}
              </p>

              <button
                type="button"
                className={`icon-action-button down-vote ${
                  voteValue === -1 && 'active'
                }`}
                onClick={() => onHandleVote(-1)}
                aria-label="Down vote"
              >
                {renderDownVote()}
              </button>
            </div>
          </div>

          <div className="post-actions">
            <button
              type="button"
              className="open-post-button"
              onClick={openModal}
              aria-label="Open Post"
            >
              Open Post
            </button>
            <span className="post-comments-count">
              {shortenNumber(post.num_comments, 1)} comments
            </span>
          </div>
        </div>
      </Card>

      {isModalOpen && (
        <div
          className="post-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Post details modal"
          onClick={closeModal}
        >
          <div
            className="post-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button
              type="button"
              className="modal-close-button"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>

            <img
              src={post.image || post.thumbnail}
              alt={post.title}
              className="modal-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImage;
              }}
            />

            <div className="modal-content">
              <h2 className="modal-title">{post.title}</h2>
              <p className="modal-body-text">{post.body}</p>

              {visibleTags.length > 0 && (
                <div className="tag-pills">
                  {visibleTags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="modal-meta-row">
                <span className="author-details">
                  <Avatar name={post.author} />
                  <span className="author-username">{post.author}</span>
                </span>
                <span className="modal-time">
                  {moment.unix(post.created_utc).fromNow()}
                </span>
              </div>

              <div className="modal-vote-controls">
                <button
                  type="button"
                  className={`icon-action-button up-vote ${
                    voteValue === 1 && 'active'
                  }`}
                  onClick={() => onHandleVote(1)}
                  aria-label="Up vote"
                >
                  {renderUpVote()}
                </button>

                <p className={`post-votes-value ${getVoteType()}`}>
                  {shortenNumber(displayedScore, 1)}
                </p>

                <button
                  type="button"
                  className={`icon-action-button down-vote ${
                    voteValue === -1 && 'active'
                  }`}
                  onClick={() => onHandleVote(-1)}
                  aria-label="Down vote"
                >
                  {renderDownVote()}
                </button>
              </div>

              <div className="modal-comments">
                <h3 className="modal-comments-title">Comments</h3>

                {post.loadingComments && (
                  <div className="comments-block">
                    <Skeleton
                      count={3}
                      baseColor="#334155"
                      highlightColor="#475569"
                    />
                  </div>
                )}

                {!post.loadingComments &&
                  post.errorComments &&
                  !post.commentsLoaded && (
                    <div className="comments-error">
                      Error loading comments. Please try again.
                      <button
                        type="button"
                        className="comments-retry-button"
                        onClick={() => onFetchCommentsForPost(post.id)}
                      >
                        Retry
                      </button>
                    </div>
                  )}

                {!post.loadingComments &&
                  post.commentsLoaded &&
                  post.comments.length === 0 && (
                    <div className="comments-empty">
                      No comments yet. Be the first!
                    </div>
                  )}

                {!post.loadingComments &&
                  post.commentsLoaded &&
                  post.comments.length > 0 && (
                    <div className="modal-comments-list">
                      {post.comments.map((comment) => (
                        <Comment
                          comment={comment}
                          key={comment.id}
                          onEditComment={onEditLocalComment}
                          onDeleteComment={onDeleteLocalComment}
                        />
                      ))}
                    </div>
                  )}

                {!post.loadingComments &&
                  !post.commentsLoaded &&
                  post.comments.length === 0 && (
                    <div className="comments-block">
                      <Skeleton
                        count={2}
                        baseColor="#334155"
                        highlightColor="#475569"
                      />
                    </div>
                  )}

                <div className="modal-add-comment-controls">
                  {!isAddingComment ? (
                    <button
                      type="button"
                      className="add-comment-toggle-button"
                      onClick={() => setIsAddingComment(true)}
                    >
                      Add Comment
                    </button>
                  ) : (
                    <form
                      className="modal-add-comment-form"
                      onSubmit={handleSubmitModalComment}
                    >
                      <textarea
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                        placeholder="Write a comment..."
                        className="modal-comment-input"
                        rows={4}
                        aria-label="Write a comment"
                      />
                      <div className="modal-add-comment-actions">
                        <button
                          type="button"
                          className="add-comment-cancel-button"
                          onClick={() => {
                            setCommentBody('');
                            setIsAddingComment(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="add-comment-submit"
                          aria-label="Submit comment"
                        >
                          Submit Comment
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default Post;
