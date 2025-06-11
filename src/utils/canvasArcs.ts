import { fabric } from 'fabric';

/**
 * Adds a basic arc using fabric.Path (a semi-circle as an example).
 */
export const addArc = (canvas: fabric.Canvas) => {
  const arcPath = new fabric.Path('M 100 100 A 50 50 0 0 1 150 150', {
    left: 100,
    top: 100,
    stroke: 'black',
    strokeWidth: 3,
    fill: '',
    selectable: true,
  });

  canvas.add(arcPath);
};

/**
 * Adds a custom arc with control over radius, angles, and direction.
 */
export const addCustomArc = (
  canvas: fabric.Canvas,
  startX = 200,
  startY = 200,
  radiusX = 80,
  radiusY = 80,
  rotation = 0,
  largeArcFlag = 0,
  sweepFlag = 1,
  endX = 300,
  endY = 300
) => {
  const pathData = `M ${startX} ${startY} A ${radiusX} ${radiusY} ${rotation} ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;

  const arc = new fabric.Path(pathData, {
    left: startX,
    top: startY,
    stroke: 'blue',
    strokeWidth: 2,
    fill: '',
    selectable: true,
  });

  canvas.add(arc);
};
