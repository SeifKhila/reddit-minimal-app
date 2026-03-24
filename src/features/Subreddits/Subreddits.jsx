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
          // clean reddit icon url
          // fallback if image is broken
          // prevents console errors
          const rawIcon = subreddit.icon_img || subreddit.community_icon;
          const cleanIcon = rawIcon ? rawIcon.split('?')[0] : '';

          const isValidIcon =
            cleanIcon && cleanIcon.startsWith('http');

          const placeholderSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="100%" height="100%" fill="#e9e9e9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="10" fill="#777">R</text></svg>`
          )}`;
          const iconSrc = isValidIcon ? cleanIcon : placeholderSrc;
          const borderColor = subreddit.primary_color || '#ddd';

          return (
            // match url with or without trailing slash
            <li
              key={subreddit.id}
              className={`${
                selectedSubreddit.replace(/\/$/, '') ===
                subreddit.url.replace(/\/$/, '')
                  ? `selected-subreddit`
                  : ''
              }`}
            >
              <button
                type="button"
                onClick={() => dispatch(setSelectedSubreddit(subreddit.url))}
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
