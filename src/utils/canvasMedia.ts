import { fabric } from 'fabric';
import { ADD_IMAGE_URL, ADD_PATTERN_IMAGE_URL, ADD_SVG_IMAGE_URL } from './constant';

export const addPattern = (canvas: fabric.Canvas) => {
  fabric.Image.fromURL(ADD_PATTERN_IMAGE_URL, (img) => {
    const element = img.getElement() as HTMLImageElement;
    const pattern = new fabric.Pattern({
      source: element,
      repeat: 'repeat',
      patternTransform: [0.25, 0, 0, 0.25, 0, 0],
    });
    const rect = new fabric.Rect({ left: 100, top: 100, width: 300, height: 300, fill: pattern });
    canvas.add(rect);
  });
};

export const addImage = (canvas: fabric.Canvas) => {
  fabric.Image.fromURL(ADD_IMAGE_URL, (img) => {
    img.set({ left: 150, top: 150, scaleX: 0.5, scaleY: 0.5 });
    canvas.add(img);
  });
};

export const addSVG = (canvas: fabric.Canvas) => {
  fabric.loadSVGFromURL(ADD_SVG_IMAGE_URL, (objects, options) => {
    const svg = fabric.util.groupSVGElements(objects, options);
    svg.set({ left: 100, top: 100, scaleX: 0.5, scaleY: 0.5 });
    canvas.add(svg);
    canvas.renderAll();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, (err:any) => {
    console.error('Error loading SVG:', err);
  });
};
