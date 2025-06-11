import { fabric } from 'fabric';

export const addGradientRectangle = (canvas: fabric.Canvas) => {
  const rect = new fabric.Rect({ left: 100, top: 100, width: 200, height: 200 });
  const gradient = new fabric.Gradient({
    type: 'linear',
    gradientUnits: 'pixels',
    coords: { x1: 0, y1: 0, x2: 200, y2: 0 },
    colorStops: [
      { offset: 0, color: 'red' },
      { offset: 1, color: 'blue' },
    ],
  });
  rect.set('fill', gradient);
  canvas.add(rect);
};

export const addGradientCircle = (canvas: fabric.Canvas) => {
  const circle = new fabric.Circle({ radius: 80, left: 150, top: 150 });
  const gradient = new fabric.Gradient({
    type: 'radial',
    coords: { x1: 0, y1: 0, r1: 0, x2: 0, y2: 0, r2: 80 },
    colorStops: [
      { offset: 0, color: 'yellow' },
      { offset: 1, color: 'green' },
    ],
  });
  circle.set('fill', gradient);
  canvas.add(circle);
};
