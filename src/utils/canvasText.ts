import { fabric } from 'fabric';

export const addText = (canvas: fabric.Canvas) => {
  const text = new fabric.Textbox('Hello Fabric.js!', { left: 200, top: 200, width: 200 });
  canvas.add(text);
};

export const addIText = (canvas: fabric.Canvas) => {
  const itext = new fabric.IText('Click to edit', { left: 250, top: 250, fontSize: 24, fill: 'black' });
  canvas.add(itext);
  canvas.setActiveObject(itext);
};

export const addTextBox = (canvas: fabric.Canvas) => {
  const textbox = new fabric.Textbox('Multiline\nText Box', {
    left: 200, top: 300, width: 250, fontSize: 20, fill: 'black',
    borderColor: 'gray', editingBorderColor: 'blue'
  });
  canvas.add(textbox);
  canvas.setActiveObject(textbox);
};
