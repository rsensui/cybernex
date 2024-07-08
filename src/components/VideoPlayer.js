import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const VideoPlayer = ({ videoId, title, onComplete, goToNextStep, goToPreviousStep, goToTop }) => {
  const handleComplete = () => {
    onComplete();
    goToNextStep();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
        <Button variant="outlined" color="secondary" onClick={goToPreviousStep}>
          戻る
        </Button>
        <Button variant="contained" color="primary" onClick={handleComplete}>
          次へ
        </Button>
        <Button variant="outlined" color="secondary" onClick={goToTop}>
          トップに戻る
        </Button>
      </Box>
    </Box>
  );
};

export default VideoPlayer;
