// CanvasVideo.tsx
import React, { useRef, useState, useEffect } from 'react';
import { fabric } from 'fabric';

interface CanvasVideoProps {
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
}

const CanvasVideo: React.FC<CanvasVideoProps> = ({ fabricCanvas }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fabricVideoRef = useRef<fabric.Image | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoAdded, setIsVideoAdded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoEl = document.createElement('video');
    videoEl.style.display = 'none';
    videoEl.setAttribute('crossorigin', 'anonymous');
    videoEl.setAttribute('playsinline', '');
    videoEl.muted = true;
    videoEl.loop = true;

    videoEl.addEventListener('loadeddata', () => {
      if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
        setIsVideoLoaded(true);
      }
    });

    document.body.appendChild(videoEl);
    videoRef.current = videoEl;

    return () => {
      document.body.removeChild(videoEl);
    };
  }, []);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setIsVideoLoaded(false);
    setIsVideoAdded(false);

    if (videoRef.current) {
      videoRef.current.src = url;
      videoRef.current.load();
    }
  };

  const handleAddToCanvas = () => {
    const canvas = fabricCanvas.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert('Video not loaded properly.');
      return;
    }

    // Create an offscreen canvas
    const offscreen = document.createElement('canvas');
    offscreen.width = video.videoWidth;
    offscreen.height = video.videoHeight;
    offscreenCanvasRef.current = offscreen;

    // Draw the first frame
    const ctx = offscreen.getContext('2d');
    ctx?.drawImage(video, 0, 0, offscreen.width, offscreen.height);

    const fabricImage = new fabric.Image(offscreen, {
      left: 100,
      top: 100,
      objectCaching: false,
      selectable: true,
      scaleX: 300 / video.videoWidth,
      scaleY: 200 / video.videoHeight,
    });

    fabricVideoRef.current = fabricImage;
    canvas.add(fabricImage);
    canvas.setActiveObject(fabricImage);
    canvas.requestRenderAll();
    setIsVideoAdded(true);

    video
      .play()
      .then(() => {
        setIsPlaying(true);
        renderLoop();
      })
      .catch((err) => {
        console.error('Autoplay failed:', err);
      });
  };

  const renderLoop = () => {
    const canvas = fabricCanvas.current;
    const fabricImage = fabricVideoRef.current;
    const video = videoRef.current;
    const offscreenCanvas = offscreenCanvasRef.current;

    if (!canvas || !fabricImage || !video || !offscreenCanvas) return;

    const ctx = offscreenCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
      const dataUrl = offscreenCanvas.toDataURL();
      const img = new window.Image();
      img.src = dataUrl;
      img.onload = () => {
        fabricImage.setElement(img);
        fabricImage.set('dirty', true);
        canvas.requestRenderAll();
      };
    }

    canvas.requestRenderAll();
    fabric.util.requestAnimFrame(renderLoop);
  };

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play();
    setIsPlaying(true);
    renderLoop();
  };

  const pauseVideo = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  const stopVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setIsPlaying(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="video/mp4"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleVideoUpload}
      />
      <button onClick={() => fileInputRef.current?.click()}>Upload Video</button>

      {videoSrc && isVideoLoaded && !isVideoAdded && (
        <button onClick={handleAddToCanvas}>Add to Canvas</button>
      )}

      {isVideoAdded && (
        <>
          <button onClick={isPlaying ? pauseVideo : playVideo}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={stopVideo}>Stop</button>
        </>
      )}
    </div>
  );
};

export default CanvasVideo;