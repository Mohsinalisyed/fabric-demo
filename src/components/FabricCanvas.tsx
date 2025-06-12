// components/FabricCanvas/FabricCanvas.tsx
import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import './style.css';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import ShapePanel from './ShapePanel';
import PropertiesPanel from './PropertiesPanel';
import { ControlPanel } from './ControlPanel';
import DrawingCanvas from './DrawingCanvas';

export const FabricCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvas = useRef<fabric.Canvas | null>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = new fabric.Canvas(canvasRef.current, {
                backgroundColor: 'white',
                width: 800,
                height: 600,
                selection: true,
                preserveObjectStacking: true
            });

            fabricCanvas.current = canvas;

            const handleSelection = (e: fabric.IEvent) => {
                setSelectedObject(e.selected?.[0] || null);
            };

            const clearSelection = () => setSelectedObject(null);

            canvas.on('selection:created', handleSelection);
            canvas.on('selection:updated', handleSelection);
            canvas.on('selection:cleared', clearSelection);

            return () => {
                canvas.dispose();
            };
        }
    }, []);

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
                    <canvas ref={canvasRef} id="canvas" className="bg-red-500" />
                </div>
                <Tabs>
                    <TabList>
                        <Tab className="tab-title">Shapes</Tab>
                        <Tab className="tab-title">Properties</Tab>
                        <Tab className="tab-title">Canvas</Tab>
                        <Tab className="tab-title">Drawing</Tab>

                    </TabList>
                    <TabPanel>
                        <ShapePanel run={run} />
                    </TabPanel>
                    <TabPanel>
                        <PropertiesPanel selectedObject={selectedObject} canvasRef={fabricCanvas} />
                    </TabPanel>
                    <TabPanel>
                        <ControlPanel run={run} />
                    </TabPanel>
                  <TabPanel>
  <DrawingCanvas  fabricCanvasRef={fabricCanvas} />
</TabPanel>

                </Tabs>
            </div>
        </>
    );
};

