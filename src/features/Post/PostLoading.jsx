import React from 'react';
import Skeleton from 'react-loading-skeleton';
import './Post.css';
import './PostLoading.css';
import { TiArrowUpOutline, TiArrowDownOutline } from 'react-icons/ti';
import getRandomNumber from '../../utils/getRandomNumber';
import Card from '../../components/Card/Card';

// loading skeleton while posts are fetching
const PostLoading = () => {
  return (
    <article className="post-article">
      <Card className="post-card">
        <div className="post-media">
          <Skeleton
            className="post-image"
            height={180}
            baseColor="#334155"
            highlightColor="#475569"
          />
        </div>

        <div className="post-content">
          <h3 className="post-title">
            <Skeleton
              width={getRandomNumber(120, 220)}
              baseColor="#334155"
              highlightColor="#475569"
            />
          </h3>

          <p className="post-body-preview">
            <Skeleton
              count={3}
              baseColor="#334155"
              highlightColor="#475569"
            />
          </p>

          <div className="tag-pills">
            <Skeleton
              width={60}
              height={24}
              style={{ borderRadius: 999 }}
              baseColor="#334155"
              highlightColor="#475569"
            />
            <Skeleton
              width={90}
              height={24}
              style={{ borderRadius: 999 }}
              baseColor="#334155"
              highlightColor="#475569"
            />
            <Skeleton
              width={70}
              height={24}
              style={{ borderRadius: 999 }}
              baseColor="#334155"
              highlightColor="#475569"
            />
          </div>

          <div className="post-footer">
            <span className="author-details">
              <Skeleton
                circle
                height={40}
                width={40}
                baseColor="#334155"
                highlightColor="#475569"
              />
              <Skeleton
                width={90}
                baseColor="#334155"
                highlightColor="#475569"
              />
            </span>

            <div className="vote-controls-inline">
              <button
                type="button"
                className="icon-action-button up-vote"
                aria-label="Up vote"
              >
                <TiArrowUpOutline className="icon-action" />
              </button>
              <Skeleton
                className="post-votes-value post-votes-value-loading"
                width={60}
                baseColor="#334155"
                highlightColor="#475569"
              />
              <button
                type="button"
                className="icon-action-button down-vote"
                aria-label="Down vote"
              >
                <TiArrowDownOutline className="icon-action" />
              </button>
            </div>
          </div>

          <div className="post-actions">
            <Skeleton
              height={38}
              width="48%"
              style={{ borderRadius: 8 }}
              baseColor="#334155"
              highlightColor="#475569"
            />
            <Skeleton
              width={100}
              baseColor="#334155"
              highlightColor="#475569"
            />
          </div>
        </div>
      </Card>
    </article>
  );
};

export default PostLoading;
