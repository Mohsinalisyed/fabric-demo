// src/components/CanvasWithRightClick.tsx
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

// ✅ Extend the Fabric Canvas type to include `upperCanvasEl`
interface ExtendedCanvas extends fabric.Canvas {
  upperCanvasEl: HTMLCanvasElement;
}

const CanvasWithRightClick: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<ExtendedCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Fabric.js canvas with extended type
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: 'white',
    }) as ExtendedCanvas;

    fabricCanvasRef.current = canvas;

    // Add a sample object for demo
    const rect = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'blue',
      left: 100,
      top: 100,
    });
    canvas.add(rect);

    // ✅ Handle right-click
    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault(); // Prevent browser context menu

      const target = canvas.findTarget(e, false);
      if (target) {
        console.log('You right-clicked on object:', target.type);
      } else {
        console.log('You right-clicked on canvas');
      }
    };

    // ✅ Attach right-click handler to upperCanvasEl
    canvas.upperCanvasEl.addEventListener('contextmenu', handleRightClick);

    // Cleanup
    return () => {
      canvas.upperCanvasEl.removeEventListener('contextmenu', handleRightClick);
      canvas.dispose();
    };
  }, []);

  return (
    <div>
      <h2>Fabric.js Canvas</h2>
      <canvas ref={canvasRef} id="fabric-canvas" />
    </div>
  );
};

export default CanvasWithRightClick;
