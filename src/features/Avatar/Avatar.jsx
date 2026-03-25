import React from 'react';
import './Avatar.css';

const Avatar = (props) => {
  const { name } = props;
  const initial = (name || 'user').trim().slice(0, 1).toUpperCase();
  const placeholderSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="18" fill="#e5e7eb"/><text x="20" y="25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="#6b7280">${initial}</text></svg>`
  )}`;

  return (
    <img
      src={placeholderSrc}
      alt={`${name || 'user'} profile`}
      className="avatar-profile-image"
    />
  );
};

export default Avatar;
