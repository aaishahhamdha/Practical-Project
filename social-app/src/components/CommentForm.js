import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const CommentForm = ({ postId, onCommentSubmitted }) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') {
      alert('Comment cannot be empty');
      return;
    }

    try {
      await axios.post(`http://localhost:5003/posts/${postId}/comments`, { text: newComment });
      console.log("New Comment:", newComment);
      setNewComment('');
      if (onCommentSubmitted) {
        onCommentSubmitted();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div>
      <TextField
        variant="outlined"
        placeholder="Add a comment"
        fullWidth
        multiline
        rows={3}
        value={newComment}
        onChange={handleCommentChange}
        style={{ marginTop: '10px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCommentSubmit}
        style={{ marginTop: '10px' }}
      >
        Post Comment
      </Button>
    </div>
  );
};

export default CommentForm;
