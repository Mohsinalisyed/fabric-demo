import { fabric } from 'fabric';

export const addRectangle = (canvas: fabric.Canvas) => {
  const rect = new fabric.Rect({ left: 100, top: 100, fill: 'red', width: 100, height: 100 });
  canvas.add(rect);
};

export const addCircle = (canvas: fabric.Canvas) => {
  const circle = new fabric.Circle({ radius: 50, fill: 'green', left: 150, top: 150 });
  canvas.add(circle);
};

export const addTriangle = (canvas: fabric.Canvas) => {
  const triangle = new fabric.Triangle({ left: 100, top: 100, fill: 'blue', width: 100, height: 100 });
  canvas.add(triangle);
};

export const addLine = (canvas: fabric.Canvas) => {
  const line = new fabric.Line([50, 50, 200, 200], { stroke: 'black', strokeWidth: 3 });
  canvas.add(line);
};

export const addPolygon = (canvas: fabric.Canvas) => {
  const points = [
    { x: 200, y: 100 }, { x: 250, y: 150 }, { x: 300, y: 100 },
    { x: 275, y: 200 }, { x: 225, y: 200 }
  ];
  const polygon = new fabric.Polygon(points, {
    left: 200, top: 100, fill: 'purple', stroke: 'black', strokeWidth: 2
  });
  canvas.add(polygon);
};
