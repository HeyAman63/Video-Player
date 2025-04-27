import VideoPlayer from './VideoPlayer'
import { useRef } from 'react'
import './App.css'

function App() {
  const playerRef = useRef(null)
  const videoLink = "http://localhost:4000/uploads/courses/fae9a22c-628a-4f99-90cc-69aa5d5cc8be/index.m3u8";
  const videoPlayerOptions = {
    controls:true,
    responsive:true,
    fluid:true,
    sources: [
      {
        src:videoLink,
        type: "application/x-mpegURL"
      }
    ]
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <>
    <div>
      <h1>Video player</h1>
    </div>
      <VideoPlayer
      options={videoPlayerOptions}
      onReady={handlePlayerReady}
      />
    </>
  )
}

export default App
