import React, { useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';

const VideoPlayer = ({ videoId, title, onComplete, goToNextStep, goToPreviousStep, goToTop }) => {
  const playerRef = useRef(null);
  const playerId = `youtube-player-${videoId}`;

  useEffect(() => {
    const loadYouTubeIframeAPI = () => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    };

    if (!window.YT) {
      loadYouTubeIframeAPI();
    } else {
      createPlayer();
    }

    window.onYouTubeIframeAPIReady = createPlayer;

    function createPlayer() {
      if (!window.YT || !window.YT.Player) {
        return;
      }
      playerRef.current = new window.YT.Player(playerId, {
        height: '360',
        width: '640',
        videoId: videoId,
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              onComplete();
            }
          },
        },
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onComplete, playerId]);

  const handlePlayPause = () => {
    if (playerRef.current && playerRef.current.getPlayerState) {
      if (playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom>{title}</Typography>
      <div id={playerId}></div>
      <Button onClick={handlePlayPause} sx={{ mt: 2 }}>
        再生/一時停止
      </Button>
      <Typography variant="caption" sx={{ mt: 1 }}>
        動画が終了すると自動的に次のステップに進みます。
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
        <Button onClick={goToPreviousStep} variant="outlined" color="secondary">
          戻る
        </Button>
        <Button onClick={goToNextStep} variant="contained" color="primary">
          次へ
        </Button>
      </Box>
      <Button onClick={goToTop} variant="outlined" color="secondary" sx={{ mt: 2 }}>
        トップに戻る
      </Button>
    </Box>
  );
};

export default VideoPlayer;
