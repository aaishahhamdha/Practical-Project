import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';
import CommentForm from './CommentForm';
import AllComments from './AllComments';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  Box,
  Snackbar,
} from '@mui/material';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5003/posts');
      const postsWithComments = await Promise.all(
        response.data.map(async (post) => {
          const commentCountResponse = await axios.get(`http://localhost:5003/posts/${post.id}/comments/count`);
          return { ...post, commentCount: commentCountResponse.data.totalComments };
        })
      );
      setPosts(postsWithComments);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setSnackbarMessage('Failed to fetch posts.');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchPosts();

    const intervalId = setInterval(fetchPosts, 5000); 

    return () => clearInterval(intervalId); 
  }, []);

  const handleOpen = (post) => {
    setSelectedPost(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPost(null);
  };

  const handleCommentSubmitted = async () => {
    if (selectedPost) {
      try {
        const response = await axios.get(`http://localhost:5003/posts/${selectedPost.id}`);
        setSelectedPost((prevState) => ({
          ...prevState,
          comments: response.data.comments,
          commentCount: response.data.comments.length,
        }));
        fetchPosts(); 
      } catch (error) {
        console.error('Error updating comments:', error);
        setSnackbarMessage('Failed to update comments.');
        setSnackbarOpen(true);
      }
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    fetchPosts();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <AppBar position="static" sx={{ marginBottom: '20px', backgroundColor: '#2D3E50' }}>
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Posts
          </Typography>
        </Toolbar>
      </AppBar>
      <CreatePost onPostCreated={handlePostCreated} />

      <Grid container spacing={3} sx={{ marginTop: '20px' }}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card
              sx={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    color: post.titleColor || '#333',
                    fontWeight: 'bold',
                  }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ margin: '8px 0 16px' }}
                >
                  {post.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.commentCount} comments
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#0049a2',
                    marginTop: '10px',
                    '&:hover': {
                      backgroundColor: '#00337f',
                    },
                  }}
                  onClick={() => handleOpen(post)}
                >
                  View Post
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        {selectedPost && (
          <>
            <DialogTitle sx={{ color: selectedPost.titleColor }}>
              {selectedPost.title}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ marginBottom: '16px' }}>
                {selectedPost.description}
              </Typography>
              <Typography variant="subtitle1" sx={{ marginBottom: '8px', fontWeight: 'bold' }}>
                {selectedPost.commentCount} comments
              </Typography>
              <AllComments postId={selectedPost.id} />
              <CommentForm postId={selectedPost.id} onCommentSubmitted={handleCommentSubmitted} />
            </DialogContent>
          </>
        )}
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        autoHideDuration={6000}
      />
    </Box>
  );
};

export default PostList;
