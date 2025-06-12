import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface DrawingCanvasProps {
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({  fabricCanvasRef }) => {
  const drawingColorRef = useRef<HTMLInputElement>(null);
  const drawingShadowColorRef = useRef<HTMLInputElement>(null);
  const drawingLineWidthRef = useRef<HTMLInputElement>(null);
  const drawingShadowWidthRef = useRef<HTMLInputElement>(null);
  const drawingShadowOffsetRef = useRef<HTMLInputElement>(null);
  const drawingModeButtonRef = useRef<HTMLButtonElement>(null);
  const brushTypeRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabric.Object.prototype.transparentCorners = false;
      fabricCanvasRef.current.freeDrawingBrush = new fabric.PencilBrush(fabricCanvasRef.current);
      setupInitialBrush();
    }
  }, [fabricCanvasRef.current]);

  const setupInitialBrush = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const color = drawingColorRef.current?.value || '#000000';
    const width = parseInt(drawingLineWidthRef.current?.value || '1', 10);
    const shadowColor = drawingShadowColorRef.current?.value || '#000000';
    const shadowBlur = parseInt(drawingShadowWidthRef.current?.value || '0', 10);
    const offset = parseInt(drawingShadowOffsetRef.current?.value || '0', 10);

    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = width;
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      blur: shadowBlur,
      offsetX: offset,
      offsetY: offset,
      affectStroke: true,
      color: shadowColor,
    });
  };


  const handleToggleDrawingMode = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (drawingModeButtonRef.current) {
      drawingModeButtonRef.current.innerText = canvas.isDrawingMode
        ? 'Cancel drawing mode'
        : 'Enter drawing mode';
    }
  };

  const handleBrushChange = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !brushTypeRef.current) return;

    const value = brushTypeRef.current.value.toLowerCase();
    let brush: fabric.BaseBrush;

    const makePatternBrush = (type: 'vline' | 'hline' | 'square' | 'diamond'): fabric.PatternBrush => {
      const patternBrush = new fabric.PatternBrush(canvas);

      patternBrush.getPatternSrc = function () {
        const patternCanvas = document.createElement('canvas');
        const ctx = patternCanvas.getContext('2d');
        if (!ctx) return patternCanvas;

        if (type === 'vline') {
          patternCanvas.width = patternCanvas.height = 10;
          ctx.strokeStyle = this.color!;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(0, 5);
          ctx.lineTo(10, 5);
          ctx.stroke();
        } else if (type === 'hline') {
          patternCanvas.width = patternCanvas.height = 10;
          ctx.strokeStyle = this.color!;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(5, 0);
          ctx.lineTo(5, 10);
          ctx.stroke();
        } else if (type === 'square') {
          const size = 10;
          patternCanvas.width = patternCanvas.height = size + 2;
          ctx.fillStyle = this.color!;
          ctx.fillRect(0, 0, size, size);
        } else if (type === 'diamond') {
          const squareWidth = 10;
          const squareDistance = 5;
          const rect = new fabric.Rect({
            width: squareWidth,
            height: squareWidth,
            angle: 45,
            fill: this.color!,
          });
          const canvasWidth = rect.getBoundingRect().width;

          patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
          rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });
          rect.render(ctx);
        }

        return patternCanvas;
      };

      return patternBrush;
    };

    switch (value) {
      case 'hline':
        brush = makePatternBrush('hline');
        break;
      case 'vline':
        brush = makePatternBrush('vline');
        break;
      case 'square':
        brush = makePatternBrush('square');
        break;
      case 'diamond':
        brush = makePatternBrush('diamond');
        break;
      default: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const brushConstructor = (fabric as any)[value + 'Brush'];
        brush = brushConstructor ? new brushConstructor(canvas) : new fabric.PencilBrush(canvas);
        break;
      }
    }

    canvas.freeDrawingBrush = brush;
    setupInitialBrush();
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }} className='drawing-wrapper'>
        <button ref={drawingModeButtonRef} onClick={handleToggleDrawingMode}>
          Cancel drawing mode
        </button>
 
        <select ref={brushTypeRef} onChange={handleBrushChange}>
          <option value="Pencil">Pencil</option>
          <option value="hline">Horizontal Line</option>
          <option value="vline">Vertical Line</option>
          <option value="square">Square</option>
          <option value="diamond">Diamond</option>
          <option value="texture">Texture</option>
        </select>

        <label>
          Color:
          <input ref={drawingColorRef} type="color" defaultValue="#000000" onChange={setupInitialBrush} />
        </label>
        <label>
          Shadow Color:
          <input ref={drawingShadowColorRef} type="color" defaultValue="#000000" onChange={setupInitialBrush} />
        </label>
        <label>
          Line Width:
          <input ref={drawingLineWidthRef} type="number" defaultValue="5" onChange={setupInitialBrush} />
        </label>
        <label>
          Shadow Width:
          <input ref={drawingShadowWidthRef} type="number" defaultValue="0" onChange={setupInitialBrush} />
        </label>
        <label>
          Shadow Offset:
          <input ref={drawingShadowOffsetRef} type="number" defaultValue="0" onChange={setupInitialBrush} />
        </label>
      </div>
    </div>
  );
};

export default DrawingCanvas;
