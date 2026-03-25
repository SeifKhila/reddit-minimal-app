import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../components/Card/Card';
import { fetchSubreddits, selectSubreddits } from '../../store/subRedditSlice';
import './Subreddits.css';
import {
  setSelectedSubreddit,
  selectSelectedSubreddit,
} from '../../store/redditSlice';

// this component shows subreddit list in sidebar
const Subreddits = () => {
  const dispatch = useDispatch();
  const subreddits = useSelector(selectSubreddits);
  const selectedSubreddit = useSelector(selectSelectedSubreddit);

  useEffect(() => {
    dispatch(fetchSubreddits());
  }, [dispatch]);

  return (
    <Card className="subreddit-card">
      {/* sidebar list for switching subreddit */}
      <h2>Subreddits</h2>
      <ul className="subreddits-list">
        {subreddits.map((subreddit) => {
          const borderColor = subreddit.primary_color || '#ddd';
          const firstLetter = (
            subreddit.display_name || subreddit.id || '?'
          ).trim()[0].toUpperCase();

          const placeholderSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><circle cx="22" cy="22" r="20" fill="${borderColor}"/><text x="22" y="27" font-family="Arial" font-size="16" font-weight="700" text-anchor="middle" fill="#ffffff">${firstLetter}</text></svg>`
          )}`;

          // DummyJSON icons are safe data URIs, but keep a local fallback anyway.
          const iconSrc = subreddit.icon_img || subreddit.community_icon || placeholderSrc;

          return (
            <li
              key={subreddit.id}
              className={`${
                selectedSubreddit === subreddit.id ? `selected-subreddit` : ''
              }`}
            >
              <button
                type="button"
                onClick={() => dispatch(setSelectedSubreddit(subreddit.id))}
              >
                <img
                  src={iconSrc}
                  alt={`${subreddit.display_name}`}
                  className="subreddit-icon"
                  style={{ border: `3px solid ${borderColor}` }}
                  // fallback if image is broken
                  // prevents console errors
                  onError={(e) => {
                    e.currentTarget.src = placeholderSrc;
                  }}
                />
                {subreddit.display_name}
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default Subreddits;
