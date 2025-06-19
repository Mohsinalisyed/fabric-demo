import { useState } from 'react';
import type { JsonToFabricCanvasProps } from './types';



const JsonToFabricCanvas = ({ canvas }: JsonToFabricCanvasProps) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  const handleLoadJson = () => {
    if (!canvas) return;

    try {
      const parsed = JSON.parse(jsonInput);

      canvas.loadFromJSON(
        parsed,
        () => {
          canvas.renderAll();
          setError('');
        },
      );
    } catch (err) {
      console.error(err);
      setError('Invalid JSON input');
    }
  };

  return (
    <div className="svg-wrapper">
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
        <button onClick={handleLoadJson} className="svg-load-button">
          Load JSON
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default JsonToFabricCanvas;
