/* eslint-disable @typescript-eslint/no-explicit-any */
import { fabric } from 'fabric';
import React from 'react';

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
          .reverse() // top layer visually on top
          .map(({ obj, index }) => {
            const actualIndex = objects.length - 1 - index;
            return (
              <li
                key={actualIndex}
                draggable
                onDragStart={(e) => handleDragStart(e, actualIndex)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, actualIndex)}
                style={{
                  fontWeight: selectedLayer === actualIndex ? 'bold' : 'normal',
                  background: selectedLayer === actualIndex ? 'black' : 'transparent',
                  color: selectedLayer === actualIndex ? '#fff' : 'black',
                  padding: '4px',
                  borderRadius: '4px',
                  cursor: 'grab',
                  border: '1px solid #ccc',
                }}
              >
                <strong>Layer {actualIndex}</strong> —{' '}
                <span>
                  {obj.type} {(obj as any).id ? `(ID: ${(obj as any).id})` : ''}
                </span>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default CanvasElementLayer;
