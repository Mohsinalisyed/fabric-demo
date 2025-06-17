import { useEffect } from 'react';
import { fabric } from 'fabric';
import { isColliding } from '../utils';

interface CanvasElementProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleContextMenu: (e: MouseEvent) => void;
  setSelectedObject: (obj: fabric.Object | null) => void;
  collisionDetectionActive: boolean;
}

export const CanvasElement = ({
  canvasRef,
  fabricCanvas,
  containerRef,
  handleContextMenu,
  setSelectedObject,
  collisionDetectionActive,
}: CanvasElementProps) => {
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: 'white',
      width: 800,
      height: 600,
      selection: true,
      preserveObjectStacking: true,
    });
    fabricCanvas.current = canvas;

    // default styles
    fabric.Object.prototype.set({
      cornerStyle: 'circle',
      cornerColor: 'blue',
      transparentCorners: false,
    });

    // custom delete control
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: (_evt, transform) => {
        const canvas = transform.target.canvas;
        canvas?.remove(transform.target);
        canvas?.requestRenderAll();
        return true;
      },
      render: (ctx, left, top) => {
        const size = 24;
        ctx.save();
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(left, top, size / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `${size - 6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('×', left, top + 1);
        ctx.restore();
      },
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      const active = canvas.getActiveObject();
      if (!active) return;
      if (e.key === 'Delete') {
        canvas.remove(active);
        canvas.requestRenderAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const handleSelection = (e: fabric.IEvent) => {
      setSelectedObject(e.selected?.[0] || null);
    };

    const clearSelection = () => setSelectedObject(null);

    let dragStarted = false;
    const onMouseDown = () => (dragStarted = true);
    const onMouseUp = () => (dragStarted = false);

    const onMouseMove = () => {
      if (!dragStarted) return;
      const obj = canvas.getActiveObject();
      if (!obj) return;

      if (isColliding(obj, canvas)) {
        obj.set({ fill: 'gray', cornerColor: 'red' });
      } else {
        const original = obj.data?.originalFill || 'yellow';
        obj.set({ fill: original, cornerColor: 'blue' });
      }
      obj.setCoords();
      canvas.renderAll();
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', clearSelection);

    if (collisionDetectionActive) {
      canvas.on('mouse:down', onMouseDown);
      canvas.on('mouse:move', onMouseMove);
      canvas.on('mouse:up', onMouseUp);
    }

    containerRef.current.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, collisionDetectionActive]);

  return <canvas ref={canvasRef} id="canvas" className="canvas" />;
};
