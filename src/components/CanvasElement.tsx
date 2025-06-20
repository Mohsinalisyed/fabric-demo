import { useEffect } from 'react';
import { fabric } from 'fabric';
import { isColliding } from '../utils';
import type { ExtendedCanvas } from '../hooks';
import type { CanvasElementProps } from './types';



export const CanvasElement = ({
  canvasRef,
  fabricCanvas,
  containerRef,
  setSelectedObject,
  setSelectedLayer,
  collisionDetectionActive,
  setCanvasObjects,
  setMenuVisible,
  showContextMenu

}: CanvasElementProps) => {
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: 'white',
      width: 800,
      height: 600,
      selection: true,
      preserveObjectStacking: true,
    }) as ExtendedCanvas;
    fabricCanvas.current = canvas;

    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault(); // Prevent browser context menu

      const pointer = canvas.getPointer(e); // canvas-relative pointer

      const target = canvas.findTarget(e, false); // clicked Fabric object
      showContextMenu(pointer.x, pointer.y, target ?? null)
      console.log('Pointer (canvas-relative):', pointer); // { x, y }
      console.log('Mouse (screen coords):', { x: e.clientX, y: e.clientY });

      if (target) {
        const { left, top } = target;
        console.log('Target position:', { left, top });

        setMenuVisible({objectRightClick:true,canvasRightClick:false});
        console.log('You right-clicked on object:', target.type);
      } else {
        setMenuVisible({objectRightClick:false,canvasRightClick:true});
        console.log('You right-clicked on canvas');
      }
    };





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
    // ✅ Attach right-click handler to upperCanvasEl
    canvas.upperCanvasEl.addEventListener('contextmenu', handleRightClick);

    setCanvasObjects(canvas.getObjects());

    return () => {
      canvas.upperCanvasEl.removeEventListener('contextmenu', handleRightClick);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, collisionDetectionActive]);

  return <canvas ref={canvasRef} id="canvas" className="canvas" />;
};
