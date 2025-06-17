import { useRef } from 'react';
import { fabric } from 'fabric';

export const useFabricCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  return { canvasRef, fabricCanvas };
};