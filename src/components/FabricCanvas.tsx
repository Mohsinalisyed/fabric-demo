import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import './style.css';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import ShapePanel from './ShapePanel';
import PropertiesPanel from './PropertiesPanel';
import { ControlPanel } from './ControlPanel';
import DrawingCanvas from './DrawingCanvas';
import SvgToFabricLoader from './SvgToFabricCanvas';
import { isColliding } from '../utils';
import JsonToFabricCanvas from './JsonToFabricCanvas';

export const FabricCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const copiedObjectRef = useRef<fabric.Object | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [collisionDetectionActive, setCollisionDetectionActive] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: 'white',
      width: 800,
      height: 600,
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvas.current = canvas;

    // Set default styles for object controls
    fabric.Object.prototype.set({
      cornerStyle: 'circle',
      cornerColor: 'blue',
      transparentCorners: false,
      cornerStrokeColor: '',
    });

    // Add custom delete control
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -16,
      offsetX: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: function (_eventData, transform) {
        const target = transform.target;
        const canvas = target.canvas;
        canvas?.remove(target);
        canvas?.requestRenderAll();
        return true;
      },
      render: function (ctx, left, top) {
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

    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const canvas = fabricCanvas.current;
      if (!canvas) return;

      const activeObject = canvas.getActiveObject();

      // Delete
      if (e.key === 'Delete' && activeObject) {
        canvas.remove(activeObject);
        canvas.requestRenderAll();
      }

      // Copy
      if (e.ctrlKey && e.key === 'c' && activeObject) {
        activeObject.clone((cloned: fabric.Object) => {
          copiedObjectRef.current = cloned;
        });
      }

      // Paste
      if (e.ctrlKey && e.key === 'v' && copiedObjectRef.current) {
        copiedObjectRef.current.clone((clonedObj: fabric.Object) => {
          clonedObj.set({
            left: (clonedObj.left || 0) + 10,
            top: (clonedObj.top || 0) + 10,
            evented: true,
          });

          if (clonedObj instanceof fabric.Group) {
            clonedObj.forEachObject(obj => canvas.add(obj));
            canvas.discardActiveObject();
          } else {
            canvas.add(clonedObj);
            canvas.setActiveObject(clonedObj);
          }

          canvas.requestRenderAll();
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    let dragStarted = false;

    const handleSelection = (e: fabric.IEvent) => {
      setSelectedObject(e.selected?.[0] || null);
    };

    const clearSelection = () => setSelectedObject(null);

    const onMouseDown = () => {
      const object = canvas.getActiveObject();
      dragStarted = true;

      if (object && !object.data?.originalFill) {
        object.set('data', {
          ...object.data,
          originalFill: object.fill,
        });
      }
    };

    const onMouseMove = () => {
  if (!dragStarted) return;

  const object = canvas.getActiveObject();
  if (!object) return;

  if (isColliding(object, canvas)) {
    object.set({
      fill: 'gray',
      cornerColor: 'red', 
    }).setCoords();
  } else {
    const originalFill = object.data?.originalFill || 'yellow';
    object.set({
      fill: originalFill,
      cornerColor: 'blue',
    }).setCoords();
  }

  canvas.renderAll();
};


    const onMouseUp = () => {
      dragStarted = false;
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', clearSelection);

    if (collisionDetectionActive) {
      canvas.on('mouse:down', onMouseDown);
      canvas.on('mouse:move', onMouseMove);
      canvas.on('mouse:up', onMouseUp);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', clearSelection);

      if (collisionDetectionActive) {
        canvas.off('mouse:down', onMouseDown);
        canvas.off('mouse:move', onMouseMove);
        canvas.off('mouse:up', onMouseUp);
      }

      canvas.dispose();
    };
  }, [collisionDetectionActive]);

  const run = (action: (canvas: fabric.Canvas) => void) => {
    if (fabricCanvas.current) {
      action(fabricCanvas.current);
    }
  };

  return (
    <>
      <h1>Fabric Demo</h1>
      <div className="canvas-container">
        <div>
          <canvas ref={canvasRef} id="canvas" className="canvas" />
        </div>
        <Tabs>
          <TabList>
            <Tab className="tab-title">Shapes</Tab>
            <Tab className="tab-title">Properties</Tab>
            <Tab className="tab-title">Drawing</Tab>
            <Tab className="tab-title">Canvas</Tab>
            <Tab className="tab-title">Load Svg</Tab>
            <Tab className="tab-title">Load Json</Tab>
          </TabList>

          <TabPanel>
            <ShapePanel run={run} />
          </TabPanel>
          <TabPanel>
            <PropertiesPanel selectedObject={selectedObject} canvasRef={fabricCanvas} />
          </TabPanel>
          <TabPanel>
            <DrawingCanvas fabricCanvasRef={fabricCanvas} />
          </TabPanel>
          <TabPanel>
            <ControlPanel
              run={run}
              collisionDetectionActive={collisionDetectionActive}
              setCollisionDetectionActive={setCollisionDetectionActive}
            />
          </TabPanel>
          <TabPanel>
            <SvgToFabricLoader fabricCanvasRef={fabricCanvas} />
          </TabPanel>
          <TabPanel>
            <JsonToFabricCanvas canvas={fabricCanvas.current} />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};
