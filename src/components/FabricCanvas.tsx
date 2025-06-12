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

export const FabricCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvas = useRef<fabric.Canvas | null>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
    const [collisionDetectionActive, setCollisionDetectionActive] = useState(false);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            backgroundColor: 'white',
            width: 800,
            height: 600,
            selection: true,
            preserveObjectStacking: true
        });

        fabricCanvas.current = canvas;
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
                object.set('fill', 'gray').setCoords();
            } else {
                const originalFill = object.data?.originalFill || 'yellow';
                object.set('fill', originalFill).setCoords();
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
                </Tabs>
            </div>
        </>
    );
};
