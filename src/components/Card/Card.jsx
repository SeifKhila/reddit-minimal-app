import React from 'react';
import './Card.css';

// reusable wrapper for cards in ui
const Card = (props) => {
  return <div className={`card ${props.className}`}>{props.children}</div>;
};

export default Card;
