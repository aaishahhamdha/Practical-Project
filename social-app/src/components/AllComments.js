import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

const AllComments = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5003/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
 
    fetchComments();

    const intervalId = setInterval(() => {
      fetchComments();
    }, 3000); 

  
    return () => clearInterval(intervalId);
  }, [postId]);

  return (
    <div style={{ padding: '10px', maxWidth: '600px', margin: 'auto' }}>
      {comments.map((comment) => (
        <Card 
          key={comment.id} 
          variant="outlined" 
          style={{
            marginBottom: '10px',
            backgroundColor: '#f5f7fa',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            padding: '5px',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.01)',
            },
          }}
        >
          <CardContent 
            style={{ 
              padding: '8px 10px', 
              display: 'flex', 
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <Typography 
              variant="body1" 
              style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#061C36', 
                marginBottom: '4px'
              }}
            >
              {comment.author}
            </Typography>
            <Typography 
              variant="body2" 
              style={{ 
                fontSize: '12px', 
                color: '#333', 
                backgroundColor: '#fff', 
                padding: '4px 8px', 
                borderRadius: '6px',
                lineHeight: '1.4',
              }}
            >
              {comment.text}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AllComments;
