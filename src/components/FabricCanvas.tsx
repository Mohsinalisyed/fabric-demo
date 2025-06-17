/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

import ShapePanel from './ShapePanel';
import PropertiesPanel from './PropertiesPanel';
import { ControlPanel } from './ControlPanel';
import DrawingCanvas from './DrawingCanvas';
import SvgToFabricLoader from './SvgToFabricCanvas';
import JsonToFabricCanvas from './JsonToFabricCanvas';
import { useContextMenu, useFabricCanvas } from '../hooks';
import { CanvasElement } from './CanvasElement';
import { ContextMenu } from './ContextMenu';
import './style.css'

export const FabricCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const copiedObjectRef = useRef<fabric.Object | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [collisionDetectionActive, setCollisionDetectionActive] = useState(false);

  const { canvasRef, fabricCanvas } = useFabricCanvas();
  const {
    menuVisible,
    menuPosition,
    targetObject,
    setTargetObject,
    setMenuVisible,
    showContextMenu,
  } = useContextMenu();

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    const target = fabricCanvas.current?.getActiveObject();
    if (target) showContextMenu(e.clientX, e.clientY, target);
  };

  const copyItem = () => {
    if (targetObject) targetObject.clone((c:any) => (copiedObjectRef.current = c));
    setMenuVisible(false);
  };

  const pasteItem = () => {
    if (fabricCanvas.current && copiedObjectRef.current) {
      copiedObjectRef.current.clone((cloned:any) => {
        cloned.set({
          left: (cloned.left || 0) + 10,
          top: (cloned.top || 0) + 10,
          evented: true,
        });
        fabricCanvas.current?.add(cloned);
        fabricCanvas.current?.setActiveObject(cloned);
        fabricCanvas.current?.requestRenderAll();
      });
      setMenuVisible(false);
    }
  };

  const duplicateItem = () => {
    if (targetObject) {
      targetObject.clone((cloned:any) => {
        cloned.set({
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20,
          evented: true,
        });
        fabricCanvas.current?.add(cloned);
        fabricCanvas.current?.setActiveObject(cloned);
        fabricCanvas.current?.requestRenderAll();
      });
      setMenuVisible(false);
    }
  };

  const deleteItem = () => {
    if (fabricCanvas.current && targetObject) {
      fabricCanvas.current.remove(targetObject);
      fabricCanvas.current.renderAll();
      setMenuVisible(false);
      setTargetObject(null);
    }
  };

  const run = (action: (canvas: fabric.Canvas) => void) => {
    if (fabricCanvas.current) action(fabricCanvas.current);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.getElementById('customContextMenu');
      if (menu && !menu.contains(e.target as Node)) {
        setMenuVisible(false);
        setTargetObject(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>Fabric Demo</h1>
      <div className="canvas-container">
        <div ref={containerRef}>
          <CanvasElement
            canvasRef={canvasRef}
            fabricCanvas={fabricCanvas}
            containerRef={containerRef}
            handleContextMenu={handleContextMenu}
            setSelectedObject={setSelectedObject}
            collisionDetectionActive={collisionDetectionActive}
          />
          <ContextMenu
            visible={menuVisible}
            position={menuPosition}
            onCopy={copyItem}
            onPaste={pasteItem}
            onDuplicate={duplicateItem}
            onDelete={deleteItem}
          />
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
            <ShapePanel run={run} canvasRef={fabricCanvas} />
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
