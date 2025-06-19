import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { FabricVideoPlayer } from '../utils';

interface CanvasVideoProps {
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
}

const CanvasVideo: React.FC<CanvasVideoProps> = ({ fabricCanvas }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoPlayerRef = useRef<FabricVideoPlayer | null>(null);

  const [state, setState] = useState({
    isVideoLoaded: false,
    isVideoAdded: false,
    isPlaying: false,
  });

  useEffect(() => {
    if (fabricCanvas.current) {
      videoPlayerRef.current = new FabricVideoPlayer(fabricCanvas.current);
    }

    return () => {
      videoPlayerRef.current?.dispose();
    };
  }, [fabricCanvas]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && videoPlayerRef.current) {
      videoPlayerRef.current.loadVideo(file);
      const checkLoaded = setInterval(() => {
        if (videoPlayerRef.current?.isVideoLoaded) {
          setState((prev) => ({ ...prev, isVideoLoaded: true }));
          clearInterval(checkLoaded);
        }
      }, 100);
    }
  };

  const handleAdd = async () => {
    try {
      await videoPlayerRef.current?.addToCanvas();
      setState((prev) => ({ ...prev, isVideoAdded: true, isPlaying: true }));
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const togglePlay = () => {
    if (!videoPlayerRef.current) return;
    if (state.isPlaying) {
      videoPlayerRef.current.pause();
    } else {
      videoPlayerRef.current.play();
    }
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const stop = () => {
    videoPlayerRef.current?.stop();
    setState((prev) => ({ ...prev, isPlaying: false }));
  };

  return (
    <div>
      <input
        type="file"
        accept="video/mp4"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
      <button onClick={() => fileInputRef.current?.click()}>Upload Video</button>

      {state.isVideoLoaded && !state.isVideoAdded && (
        <button onClick={handleAdd}>Add to Canvas</button>
      )}

      {state.isVideoAdded && (
        <>
          <button onClick={togglePlay}>{state.isPlaying ? 'Pause' : 'Play'}</button>
          <button onClick={stop}>Stop</button>
        </>
      )}
    </div>
  );
};

export default CanvasVideo;
