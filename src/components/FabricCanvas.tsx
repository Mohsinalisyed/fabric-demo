import { useEffect, useRef, useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import {
  copyItem,
  pasteItem,
  duplicateItem,
  deleteItem,
} from '../utils';
import ShapePanel from './ShapePanel';
import PropertiesPanel from './PropertiesPanel';
import { ControlPanel } from './ControlPanel';
import DrawingCanvas from './DrawingCanvas';
import SvgToFabricLoader from './SvgToFabricCanvas';
import JsonToFabricCanvas from './JsonToFabricCanvas';
import { useContextMenu, useFabricCanvas } from '../hooks';
import { CanvasElement } from './CanvasElement';
import { ContextMenu } from './ContextMenu';
import './style.css';
import CanvasElementLayer from './CanvasElementLayer';
import VideoCanvas from './CanvasVideo';
import CanvasWithRightClick from './CanvasWithRightClick';

export const FabricCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const copiedObjectRef = useRef<fabric.Object | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [collisionDetectionActive, setCollisionDetectionActive] = useState(false);
  const [canvasObjects, setCanvasObjects] = useState<fabric.Object[]>([]);
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

  const handleSetSelectedObject = (obj: fabric.Object | null) => {
    setSelectedObject(obj);

    if (obj && fabricCanvas.current) {
      const allObjects = fabricCanvas.current.getObjects();
      const index = allObjects.indexOf(obj);
      setSelectedLayer(index);
    } else {
      setSelectedLayer(null);
    }
  };

  const reorderObjects = (fromIndex: number, toIndex: number) => {
    if (!fabricCanvas.current) return;

    const objs = fabricCanvas.current.getObjects();
    const moved = objs[fromIndex];
    if (!moved) return;

    objs.splice(fromIndex, 1);
    objs.splice(toIndex, 0, moved);

    fabricCanvas.current.clear();
    objs.forEach(obj => fabricCanvas.current?.add(obj));
    fabricCanvas.current.renderAll();
    setCanvasObjects([...objs]);
  };

  const handleCopy = () => copyItem(targetObject, copiedObjectRef, setMenuVisible);
  const handlePaste = () =>
    pasteItem(fabricCanvas.current, copiedObjectRef, setMenuVisible);
  const handleDuplicate = () =>
    duplicateItem(fabricCanvas.current, targetObject, setMenuVisible);
  const handleDelete = () =>
    deleteItem(fabricCanvas.current, targetObject, setTargetObject, setMenuVisible);

  const run = (action: (canvas: fabric.Canvas) => void) => {
    if (fabricCanvas.current) action(fabricCanvas.current);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.getElementById('customContextMenu');
      if (menu && !menu.contains(e.target as Node)) {
        setMenuVisible({objectRightClick:false,canvasRightClick:false});
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
            setSelectedObject={handleSetSelectedObject}
            setSelectedLayer={setSelectedLayer}
            collisionDetectionActive={collisionDetectionActive}
            setCanvasObjects={setCanvasObjects}
            showContextMenu={showContextMenu}
            setMenuVisible={setMenuVisible}
            setTargetObject={setTargetObject}

          />
          <ContextMenu
            visible={menuVisible}
            position={menuPosition}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            targetObject={targetObject}
          />
          <CanvasWithRightClick/>

        </div>
        <Tabs>
          <TabList className='tab-wrapper'>
            <Tab className="tab-title">Shapes</Tab>
            <Tab className="tab-title">Properties</Tab>
            <Tab className="tab-title">Drawing</Tab>
            <Tab className="tab-title">Canvas</Tab>
            <Tab className="tab-title">Load Svg</Tab>
            <Tab className="tab-title">Load Json</Tab>
            <Tab className="tab-title">Layers</Tab>
            <Tab className="tab-title">Add Video</Tab>
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
          <TabPanel>
            <CanvasElementLayer
              selectedLayer={selectedLayer}
              objects={canvasObjects}
              onReorder={reorderObjects}
            />

          </TabPanel>
          <TabPanel>
       <VideoCanvas fabricCanvas={fabricCanvas} />

          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};
