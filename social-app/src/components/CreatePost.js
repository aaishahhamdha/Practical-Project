import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { SketchPicker } from 'react-color';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleColor, setTitleColor] = useState('#000000');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const createPost = () => {
    axios.post('http://localhost:5003/posts', { title, description, titleColor })
      .then(() => {
        setOpen(false);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error creating post:', error);
      });
  };

  const handleColorChange = (color) => {
    setTitleColor(color.hex);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create New Post
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputProps={{
                style: { color: titleColor },
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
            />
            <Typography variant="subtitle1" gutterBottom>
              Select Title Color:
            </Typography>
            <SketchPicker
              color={titleColor}
              onChangeComplete={handleColorChange}
              style={{ marginTop: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <Button variant="contained" color="primary" onClick={createPost} sx={{ marginTop: '1rem' }}>
              Post
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePost;
