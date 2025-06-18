import { useEffect } from 'react';
import { fabric } from 'fabric';
import { isColliding } from '../utils';

interface CanvasElementProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleContextMenu: (e: MouseEvent) => void;
  setSelectedObject: (obj: fabric.Object | null) => void;
  setSelectedLayer: (layer: number | null) => void;
  collisionDetectionActive: boolean;
  setCanvasObjects: (objs: fabric.Object[]) => void;
  showContextMenu: (x: number, y: number, target: fabric.Object | null) => void;
  setMenuVisible: (visible: boolean) => void;
  setTargetObject: (obj: fabric.Object | null) => void;
}

export const CanvasElement = ({
  canvasRef,
  fabricCanvas,
  containerRef,
  handleContextMenu,
  setSelectedObject,
  setSelectedLayer,
  collisionDetectionActive,
  setCanvasObjects,
  showContextMenu,
  setTargetObject
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
    canvas.on('mouse:down', (opt) => {
      const evt = opt.e as MouseEvent;
      const target = canvas.findTarget(evt, false);

      opt.e.preventDefault();
      opt.e.stopPropagation();

      if (target) {
        showContextMenu(evt.clientX, evt.clientY, target);
        setTargetObject(target);
      } else {
        showContextMenu(evt.clientX, evt.clientY, null);
        setTargetObject(null);
      }
    });


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
        setCanvasObjects(canvas?.getObjects() || []);
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

    const updateSelection = (e: fabric.IEvent) => {
      const obj = e.selected?.[0] || null;
      setSelectedObject(obj);
      if (obj) {
        const index = canvas.getObjects().indexOf(obj);
        setSelectedLayer(index);
      } else {
        setSelectedLayer(null);
      }
    };

    const handleMove = (e: fabric.IEvent) => {
      const obj = e.target;
      if (obj) {
        const index = canvas.getObjects().indexOf(obj);
        setSelectedLayer(index);
      }
    };

    const updateObjectsList = () => setCanvasObjects(canvas.getObjects());

    canvas.on('selection:created', updateSelection);
    canvas.on('selection:updated', updateSelection);
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
      setSelectedLayer(null);
    });

    canvas.on('object:moving', handleMove);
    canvas.on('object:added', updateObjectsList);
    canvas.on('object:removed', updateObjectsList);
    canvas.on('object:modified', updateObjectsList);

    if (collisionDetectionActive) {
      let dragStarted = false;
      canvas.on('mouse:down', () => (dragStarted = true));
      canvas.on('mouse:up', () => (dragStarted = false));
      canvas.on('mouse:move', () => {
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
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const active = canvas.getActiveObject();
      if (!active) return;
      if (e.key === 'Delete') {
        canvas.remove(active);
        canvas.requestRenderAll();
        setCanvasObjects(canvas.getObjects());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    containerRef.current.addEventListener('contextmenu', handleContextMenu);

    setCanvasObjects(canvas.getObjects());

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, collisionDetectionActive]);

  return <canvas ref={canvasRef} id="canvas" className="canvas" />;
};
