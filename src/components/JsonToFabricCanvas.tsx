// JsonToFabricCanvas.tsx
import { useState } from 'react';
import { fabric } from 'fabric';

interface JsonToFabricCanvasProps {
  canvas: fabric.Canvas | null;
}

const JsonToFabricCanvas = ({ canvas }: JsonToFabricCanvasProps) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  const handleLoadJson = () => {
    if (!canvas) return;

    try {
      const parsed = JSON.parse(jsonInput);
      canvas.clear();
      canvas.setBackgroundColor('#f0f0f0', () => {});

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.entries(parsed).forEach(([, props]: [string, any]) => {
        const polygon = new fabric.Polygon(
          createPolygonPoints(props.sides, props.radius),
          {
            left: props.x,
            top: props.y,
            fill: props.fill || 'red',
            stroke: props.stroke || 'black',
            strokeWidth: props.strokeWidth || 2,
            selectable: true,
            hasControls: false,
          }
        );

        polygon.on('mousedown', () => {
          polygon.set('fill', getRandomColor());
          canvas.renderAll();
        });

        canvas.add(polygon);
      });

      setError('');
    } catch (err) {
        console.log(err)
      setError('Invalid JSON input');
    }
  };

  const createPolygonPoints = (sides: number, radius: number) => {
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      points.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      });
    }
    return points;
  };

  const getRandomColor = () =>
    '#' + Math.floor(Math.random() * 16777215).toString(16);

  return (
    <div className='svg-wrapper'>
      <div>
        <textarea
          placeholder="Paste JSON here"
          rows={10}
          cols={40}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="svg-textarea"

        />
        <br />
        <button onClick={handleLoadJson}   className="svg-load-button">Load JSON</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default JsonToFabricCanvas;
