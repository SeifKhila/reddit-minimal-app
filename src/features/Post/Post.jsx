import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import './Post.css';
import {
  TiArrowUpOutline,
  TiArrowUpThick,
  TiArrowDownOutline,
  TiArrowDownThick,
  TiMessage,
} from 'react-icons/ti';
import moment from 'moment';
import shortenNumber from '../../utils/shortenNumber';
import Card from '../../components/Card/Card';
import Comment from '../Comment/Comment';
import Avatar from '../Avatar/Avatar';

// this component shows one post card
const Post = (props) => {
  const [voteValue, setVoteValue] = useState(0);

  const { post, onToggleComments } = props;

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

  const renderComments = () => {
    if (post.errorComments) {
      return (
        <div>
          <h3>Error loading comments</h3>
        </div>
      );
    }

    if (post.loadingComments) {
      return (
        <div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      );
    }

    if (post.showingComments) {
      return (
        <div>
          {post.comments.map((comment) => (
            <Comment comment={comment} key={comment.id} />
          ))}
        </div>
      );
    }

    return null;
  };

  // use high quality reddit preview image instead of thumbnail
  // prevents blurry thumbnails and broken image icons
  const imageUrl =
    (post.data?.preview &&
      post.data.preview.images &&
      post.data.preview.images[0] &&
      post.data.preview.images[0].source &&
      post.data.preview.images[0].source.url) ||
    (post.preview &&
      post.preview.images &&
      post.preview.images[0] &&
      post.preview.images[0].source &&
      post.preview.images[0].source.url) ||
    '';

  const cleanImage = imageUrl ? imageUrl.replace(/&amp;/g, '&') : '';

  const isValidImage =
    cleanImage &&
    typeof cleanImage === 'string' &&
    cleanImage.startsWith('http') &&
    !['self', 'default', 'nsfw', ''].includes(cleanImage);

  return (
    <article key={post.id}>
      <Card className="post-card">
        {/* this renders each post card */}
        <div className="post-wrapper">
          <div className="post-votes-container">
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
              {shortenNumber(post.ups, 1)}
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
          <div className="post-container">
            <h3 className="post-title">{post.title}</h3>

            <div className="post-image-container">
              {isValidImage && (
                <img
                  src={cleanImage}
                  alt="post"
                  className="post-image"
                  // if the image still fails to load, hide it (no broken icon)
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>

            <div className="post-details">
              {/* post author, time and comments info */}
              <span className="author-details">
                <Avatar name={post.author} />
                <span className="author-username">{post.author}</span>
              </span>
              <span>{moment.unix(post.created_utc).fromNow()}</span>
              <span className="post-comments-container">
                <button
                  type="button"
                  className={`icon-action-button ${
                    post.showingComments && 'showing-comments'
                  }`}
                  onClick={() => onToggleComments(post.permalink)}
                  aria-label="Show comments"
                >
                  <TiMessage className="icon-action" />
                </button>
                {shortenNumber(post.num_comments, 1)}
              </span>
            </div>

            {renderComments()}
          </div>
        </div>
      </Card>
    </article>
  );
};

export default Post;
