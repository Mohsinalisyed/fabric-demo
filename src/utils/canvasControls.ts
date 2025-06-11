import { fabric } from 'fabric';

export const clearCanvas = (canvas: fabric.Canvas) => {
  canvas.clear();
  canvas.setBackgroundColor('white', () => canvas.renderAll());
};

export const exportCanvasJSON = (canvas: fabric.Canvas) => {
  const json = canvas.toJSON();
  console.log('Canvas JSON:', json);
  alert('Canvas data exported to console.');
};
// utils.ts

export const exportCanvasImage = (canvas: fabric.Canvas) => {
  const dataUrl = canvas.toDataURL({
    format: 'png',
    quality: 1,
  });
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'canvas-image.png';
  link.click();
};

export const exportCanvasSVG = (canvas: fabric.Canvas) => {
  const svg = canvas.toSVG();
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'canvas-image.svg';
  link.click();
};
