import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface CanvasElementLayerProps {
    selectedLayer: number | null;
    objects: fabric.Object[];
    onReorder: (fromIndex: number, toIndex: number) => void;
}

const CanvasElementLayer: React.FC<CanvasElementLayerProps> = ({
    selectedLayer,
    objects,
    onReorder,
}) => {
    const canvasRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        objects.forEach((obj, i) => {
            const container = canvasRefs.current[i];
            if (!container) return;

            // Clear previous canvas
            container.innerHTML = '';

            const canvasEl = document.createElement('canvas');
            canvasEl.width = 50;
            canvasEl.height = 50;
            const previewCanvas = new fabric.StaticCanvas(canvasEl, {
                backgroundColor: '#fff',
            });

            obj.clone((cloned: fabric.Object) => {
                cloned.scaleToWidth(40);
                cloned.scaleToHeight(40);
                cloned.set({
                    left: 5,
                    top: 5,
                    selectable: false,
                    evented: false,
                });
                previewCanvas.add(cloned);
                previewCanvas.renderAll();
            });

            container.appendChild(canvasEl);
        });
    }, [objects]);

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (dragIndex !== dropIndex) {
            onReorder(dragIndex, dropIndex);
        }
    };

    return (
        <div className="layer-info-panel">
            <h3>Canvas Layers</h3>
            {objects.length === 0 && <p>No objects on canvas</p>}
            <ul>
                {[...objects]
                    .map((obj, index) => ({ obj, index }))
                    .reverse()
                    .map(({ index }, i) => {
                        const actualIndex = objects.length - 1 - index;
                        return (
                            <li
                                key={actualIndex}
                                className={`layer-item ${selectedLayer === actualIndex ? 'active' : ''}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, actualIndex)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, actualIndex)}
                            >
                                <div
                                    ref={(el) => {
                                        canvasRefs.current[i] = el;
                                    }}
                                    className="canvas-preview"
                                />
                                <div>
                                    <strong>Layer {actualIndex}</strong>
                                </div>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

export default CanvasElementLayer;
