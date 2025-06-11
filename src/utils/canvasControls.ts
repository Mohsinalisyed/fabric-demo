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
