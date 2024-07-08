import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const VideoEditor = ({ initialVideos, onVideosCreated }) => {
  const [videos, setVideos] = useState(initialVideos);

  const handleTitleChange = (index, event) => {
    const newVideos = [...videos];
    newVideos[index].title = event.target.value;
    setVideos(newVideos);
  };

  const handleIdChange = (index, event) => {
    const newVideos = [...videos];
    newVideos[index].id = event.target.value;
    setVideos(newVideos);
  };

  const handleAddVideo = () => {
    setVideos([...videos, { id: '', title: '' }]);
  };

  const handleDeleteVideo = (index) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const handleSubmit = () => {
    onVideosCreated(videos);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>動画エディタ</Typography>
      {videos.map((video, index) => (
        <Box key={index} sx={{ mb: 2, border: '1px solid #ddd', borderRadius: '8px', p: 2 }}>
          <TextField
            fullWidth
            label="動画タイトル"
            value={video.title}
            onChange={(e) => handleTitleChange(index, e)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="YouTube動画ID"
            value={video.id}
            onChange={(e) => handleIdChange(index, e)}
            sx={{ mb: 2 }}
          />
          <IconButton onClick={() => handleDeleteVideo(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button onClick={handleAddVideo} variant="contained" sx={{ mt: 2 }}>
        動画を追加
      </Button>
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        sx={{ mt: 2, ml: 2 }}
      >
        動画を確定
      </Button>
    </Box>
  );
};

export default VideoEditor;
