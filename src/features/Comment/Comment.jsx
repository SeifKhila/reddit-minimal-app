import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import './Comment.css';
import Avatar from '../Avatar/Avatar';

// Comment item with local-only Edit/Delete actions.
// Everything is stored in Redux and updates instantly.
const Comment = (props) => {
  const { comment, onEditComment, onDeleteComment } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [draftBody, setDraftBody] = useState(comment.body || '');

  // Keep the draft in sync when the comment changes from Redux.
  useEffect(() => {
    if (!isEditing) {
      setDraftBody(comment.body || '');
    }
  }, [comment.body, isEditing]);

  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = draftBody.trim();
    if (!trimmed) return;
    if (typeof onEditComment === 'function') {
      onEditComment(comment.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setDraftBody(comment.body || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (typeof onDeleteComment === 'function') {
      onDeleteComment(comment.id);
    }
  };

  return (
    <div className="comment">
      <div className="comment-metadata">
        <Avatar name={comment.author} />
        <p className="comment-author">{comment.author}</p>
        <p className="comment-created-time">
          {moment.unix(comment.created_utc).fromNow()}
        </p>
      </div>

      <div className="comment-body">
        {isEditing ? (
          <form className="comment-edit-form" onSubmit={handleSave}>
            <textarea
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              className="comment-edit-input"
              rows={3}
              aria-label="Edit comment"
            />
            <div className="comment-edit-actions">
              <button type="button" onClick={handleCancelEdit} className="comment-action-secondary">
                Cancel
              </button>
              <button type="submit" className="comment-action-primary">
                Save
              </button>
            </div>
          </form>
        ) : (
          <>
            <ReactMarkdown source={comment.body} />
            <div className="comment-actions">
              <button
                type="button"
                className="comment-action-secondary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                type="button"
                className="comment-action-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
