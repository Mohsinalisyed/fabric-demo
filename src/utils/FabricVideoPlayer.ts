import { fabric } from 'fabric';

export class FabricVideoPlayer {
  private videoEl: HTMLVideoElement;
  private fabricCanvas: fabric.Canvas;
  private offscreenCanvas: HTMLCanvasElement;
  private fabricImage: fabric.Image | null = null;
  private animationFrameId: number | null = null;

  public isVideoLoaded = false;
  public isVideoAdded = false;
  public isPlaying = false;

  constructor(canvas: fabric.Canvas) {
    this.fabricCanvas = canvas;

    this.videoEl = document.createElement('video');
    this.videoEl.style.display = 'none';
    this.videoEl.setAttribute('crossorigin', 'anonymous');
    this.videoEl.setAttribute('playsinline', '');
    this.videoEl.muted = true;
    this.videoEl.loop = true;

    this.offscreenCanvas = document.createElement('canvas');

    this.videoEl.addEventListener('loadeddata', () => {
      if (this.videoEl.videoWidth > 0 && this.videoEl.videoHeight > 0) {
        this.isVideoLoaded = true;
      }
    });

    document.body.appendChild(this.videoEl);
  }

  dispose() {
    this.stop();
    document.body.removeChild(this.videoEl);
  }

  loadVideo(file: File): void {
    const url = URL.createObjectURL(file);
    this.videoEl.src = url;
    this.videoEl.load();
    this.isVideoLoaded = false;
    this.isVideoAdded = false;
  }

  async addToCanvas() {
    if (!this.isVideoLoaded) throw new Error('Video not loaded');

    this.offscreenCanvas.width = this.videoEl.videoWidth;
    this.offscreenCanvas.height = this.videoEl.videoHeight;

    const ctx = this.offscreenCanvas.getContext('2d');
    ctx?.drawImage(this.videoEl, 0, 0);

    const image = new fabric.Image(this.offscreenCanvas, {
      left: 100,
      top: 100,
      objectCaching: false,
      selectable: true,
      scaleX: 300 / this.videoEl.videoWidth,
      scaleY: 200 / this.videoEl.videoHeight,
    });

    this.fabricImage = image;
    this.fabricCanvas.add(image);
    this.fabricCanvas.setActiveObject(image);
    this.fabricCanvas.requestRenderAll();
    this.isVideoAdded = true;

    await this.videoEl.play();
    this.isPlaying = true;
    this.renderLoop();
  }

  private renderLoop = () => {
    const ctx = this.offscreenCanvas.getContext('2d');
    if (!ctx || !this.fabricImage) return;

    ctx.drawImage(this.videoEl, 0, 0);
    const dataUrl = this.offscreenCanvas.toDataURL();
    const img = new window.Image();
    img.src = dataUrl;

    img.onload = () => {
      this.fabricImage?.setElement(img);
      this.fabricImage?.set('dirty', true);
      this.fabricCanvas.requestRenderAll();
    };

    this.animationFrameId = requestAnimationFrame(this.renderLoop);
  };

  play() {
    this.videoEl.play();
    this.isPlaying = true;
    this.renderLoop();
  }

  pause() {
    this.videoEl.pause();
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  stop() {
    this.videoEl.pause();
    this.videoEl.currentTime = 0;
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
