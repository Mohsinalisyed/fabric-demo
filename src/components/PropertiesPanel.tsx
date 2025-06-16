import { useEffect, useState } from 'react';
import { fabric } from 'fabric';

type Props = {
    selectedObject: fabric.Object | null;
    canvasRef: React.MutableRefObject<fabric.Canvas | null>;
};

const PropertiesPanel = ({ selectedObject, canvasRef }: Props) => {
    const [fill, setFill] = useState('#000000');
    const [stroke, setStroke] = useState('#000000');
    const [opacity, setOpacity] = useState(1);
    const [strokeWidth, setStrokeWidth] = useState(1);
    const [strokeUniform, setStrokeUniform] = useState(false);
    const [originX, setOriginX] = useState('left');
    const [originY, setOriginY] = useState('top');

    const [, setRefresh] = useState(false); // trigger re-renders

    useEffect(() => {
        if (selectedObject) {
            setFill(typeof selectedObject.fill === 'string' ? selectedObject.fill : '#000000');
            setStroke(typeof selectedObject.stroke === 'string' ? selectedObject.stroke : '#000000');
            setOpacity(typeof selectedObject.opacity === 'number' ? selectedObject.opacity : 1);
            setStrokeWidth(typeof selectedObject.strokeWidth === 'number' ? selectedObject.strokeWidth : 1);
            setStrokeUniform(Boolean(selectedObject.strokeUniform));
            setOriginX(selectedObject.originX || 'left');
            setOriginY(selectedObject.originY || 'top');
        }
    }, [selectedObject]);

    if (!selectedObject) {
        return <p style={{ width: '600px' }}>Select an object to see properties.</p>;
    }

    const handleLockToggle = (prop: keyof fabric.Object) => {
        if (!selectedObject) return;
        const newValue = !selectedObject[prop];
        selectedObject.set(prop, newValue);
        canvasRef.current?.renderAll();
        setRefresh(prev => !prev); // Force re-render
    };

    const handleOriginChange = (axis: 'X' | 'Y', value: string) => {
        if (!selectedObject) return;
        selectedObject.set(`origin${axis}` as 'originX' | 'originY', value);
        if (axis === 'X') {
            setOriginX(value);
        } else {
            setOriginY(value);
        }

        canvasRef.current?.renderAll();
    };

    const sendBackwards = () => {
        if (!selectedObject || !canvasRef.current) return;
        canvasRef.current.setActiveObject(selectedObject);
        canvasRef.current.sendBackwards(selectedObject);
        canvasRef.current.renderAll();
    };

    const sendToBack = () => {
        if (!selectedObject || !canvasRef.current) return;
        canvasRef.current.sendToBack(selectedObject);
        canvasRef.current.setActiveObject(selectedObject);
        canvasRef.current.renderAll();
    };

    const bringForwards = () => {
        if (!selectedObject || !canvasRef.current) return;
        canvasRef.current.bringForward(selectedObject);
        canvasRef.current.setActiveObject(selectedObject);
        canvasRef.current.renderAll();
    };

    const bringToFront = () => {
        if (!selectedObject || !canvasRef.current) return;
        canvasRef.current.bringToFront(selectedObject);
        canvasRef.current.setActiveObject(selectedObject);
        canvasRef.current.renderAll();
    };

const handleGroup = () => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length <= 1) return;

  // Calculate combined bounding box
  const bounds = activeObjects.map(obj => obj.getBoundingRect());

  const minX = Math.min(...bounds.map((b) => b.left));
  const minY = Math.min(...bounds.map((b) => b.top));

  const group = new fabric.Group([], {
    left: minX,
    top: minY,
    originX: 'left',
    originY: 'top',
  });

  const clones: fabric.Object[] = [];

  activeObjects.forEach((obj) => {
    obj.clone((cloned: fabric.Object) => {
      // Adjust position relative to group's top-left
      const rect = obj.getBoundingRect();
      cloned.left = rect.left - minX;
      cloned.top = rect.top - minY;
      group.addWithUpdate(cloned);
      clones.push(cloned);
    });
    canvas.remove(obj);
  });

  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.requestRenderAll();
};




const handleUngroup = () => {
    const canvas = canvasRef.current;
    const activeObject = canvas?.getActiveObject();

    if (!canvas || !activeObject || !(activeObject instanceof fabric.Group)) return;

    const items = activeObject._objects;
    const groupLeft = activeObject.left ?? 0;
    const groupTop = activeObject.top ?? 0;

    // Remove group and add each object back with correct positioning
    canvas.remove(activeObject);
    items.forEach((obj) => {
        obj.clone((cloned: fabric.Object) => {
            cloned.set({
                left: (cloned.left ?? 0) + groupLeft,
                top: (cloned.top ?? 0) + groupTop,
                canvas,
            });
            canvas.add(cloned);
        });
    });

    canvas.discardActiveObject();
    canvas.requestRenderAll();
};


    const originOptions = ['left', 'center', 'right', '0.3', '0.5', '0.7', '1'];

    return (
        <div className="properties-wrapper">
            {/* Color & Stroke */}
            <label>
                Fill:
                <input
                    type="color"
                    value={fill}
                    onChange={(e) => {
                        const color = e.target.value;
                        setFill(color);
                        selectedObject.set('fill', color);
                        canvasRef.current?.renderAll();
                    }}
                />
            </label>

            <label>
                Stroke:
                <input
                    type="color"
                    value={stroke}
                    onChange={(e) => {
                        const color = e.target.value;
                        setStroke(color);
                        selectedObject.set('stroke', color);
                        canvasRef.current?.renderAll();
                    }}
                />
            </label>

            <label>
                Opacity:
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={opacity}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setOpacity(val);
                        selectedObject.set('opacity', val);
                        canvasRef.current?.renderAll();
                    }}
                />
            </label>

            <label>
                Stroke Width:
                <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={strokeWidth}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setStrokeWidth(val);
                        selectedObject.set('strokeWidth', val);
                        canvasRef.current?.renderAll();
                    }}
                />
            </label>

            <label>
                Stroke Uniform:
                <input
                    type="checkbox"
                    checked={strokeUniform}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        setStrokeUniform(checked);
                        selectedObject.set('strokeUniform', checked);
                        canvasRef.current?.renderAll();
                    }}
                />
            </label>

            {/* Lock Controls */}
            <div className="btn-wrapper">
                <button onClick={() => handleLockToggle('lockMovementX')}>
                    {selectedObject.lockMovementX ? 'Unlock horizontal movement' : 'Lock horizontal movement'}
                </button>
                <button onClick={() => handleLockToggle('lockMovementY')}>
                    {selectedObject.lockMovementY ? 'Unlock vertical movement' : 'Lock vertical movement'}
                </button>
                <button onClick={() => handleLockToggle('lockScalingX')}>
                    {selectedObject.lockScalingX ? 'Unlock horizontal scaling' : 'Lock horizontal scaling'}
                </button>
                <button onClick={() => handleLockToggle('lockScalingY')}>
                    {selectedObject.lockScalingY ? 'Unlock vertical scaling' : 'Lock vertical scaling'}
                </button>
                <button onClick={() => handleLockToggle('lockRotation')}>
                    {selectedObject.lockRotation ? 'Unlock rotation' : 'Lock rotation'}
                </button>
                <button onClick={() => handleLockToggle('lockScalingFlip')}>
                    {selectedObject.lockScalingFlip ? 'Unlock scaling flip' : 'Lock scaling flip'}
                </button>
            </div>

            {/* Origin Controls */}
            <div>
                <label>Origin X:</label>
                {originOptions.map((opt) => (
                    <label key={`originX-${opt}`} style={{ marginRight: 6 }}>
                        <input
                            type="radio"
                            name="originX"
                            value={opt}
                            checked={originX === opt}
                            onChange={() => handleOriginChange('X', opt)}
                        />
                        {opt}
                    </label>
                ))}
            </div>

            <div>
                <label>Origin Y:</label>
                {originOptions.map((opt) => (
                    <label key={`originY-${opt}`} style={{ marginRight: 6 }}>
                        <input
                            type="radio"
                            name="originY"
                            value={opt}
                            checked={originY === opt}
                            onChange={() => handleOriginChange('Y', opt)}
                        />
                        {opt}
                    </label>
                ))}
            </div>

            {/* Layering Controls */}
            <div className="btn-wrapper" style={{ marginTop: '10px' }}>
                <button onClick={sendBackwards}>Send backwards</button>
                <button onClick={sendToBack}>Send to back</button>
                <button onClick={bringForwards}>Bring forwards</button>
                <button onClick={bringToFront}>Bring to front</button>
            </div>

            {/* Group/Ungroup Controls */}
            <div className="btn-wrapper" style={{ marginTop: '10px' }}>
                <button onClick={handleGroup}>Group</button>
                <button onClick={handleUngroup}>Ungroup</button>
            </div>
        </div>
    );
};

export default PropertiesPanel;
