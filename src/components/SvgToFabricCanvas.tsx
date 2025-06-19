import React, {  useState } from 'react';
import { fabric } from 'fabric';
import type { SvgToFabricLoaderProps } from './types';

const SvgToFabricLoader: React.FC<SvgToFabricLoaderProps> = ({ fabricCanvasRef }) => {
  const [svgInput, setSvgInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoadSVG = () => {
    if (!fabricCanvasRef.current) return;
    if (!svgInput.trim()) {
      setError('Please paste valid SVG code.');
      return;
    }

    setError(null);

    fabric.loadSVGFromString(svgInput, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options);
      obj.set({ left: 20, top: 20, scaleX: 0.5, scaleY: 0.5 });
      obj.setCoords();

      fabricCanvasRef.current?.add(obj);
      fabricCanvasRef.current?.renderAll();
    });
  };

  return (
    <div className='svg-wrapper'>
      <textarea
        placeholder="Paste your SVG code here"
        value={svgInput}
        onChange={(e) => setSvgInput(e.target.value)}
        rows={10}
       className="svg-textarea"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handleLoadSVG}
   className="svg-load-button"
      >
        Load SVG to Canvas
      </button>
    </div>
  );
};

export default SvgToFabricLoader;
