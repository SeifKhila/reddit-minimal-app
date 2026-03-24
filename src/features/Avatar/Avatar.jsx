import React, { useState } from 'react';
import './Avatar.css';

const Avatar = (props) => {
  const { name } = props;

  // check if profile image is usable
  // fallback image if not
  const rawSrc = name ? `https://api.adorable.io/avatars/10/${name}` : '';
  const cleanSrc = rawSrc ? rawSrc.split('?')[0] : '';
  const isValidImage = cleanSrc && cleanSrc.startsWith('http');
  const placeholderSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="100%" height="100%" fill="#e9e9e9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="10" fill="#777">U</text></svg>`
  )}`;

  const [src, setSrc] = useState(isValidImage ? cleanSrc : placeholderSrc);

  return (
    <img
      src={src}
      alt={`${name || 'user'} profile`}
      className="avatar-profile-image"
      // if the remote avatar fails to load, show fallback
      onError={() => setSrc(placeholderSrc)}
    />
  );
};

export default Avatar;
