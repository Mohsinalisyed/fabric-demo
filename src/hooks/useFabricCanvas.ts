import { useRef } from 'react';
import { fabric } from 'fabric';

export interface ExtendedCanvas extends fabric.Canvas {
  upperCanvasEl: HTMLCanvasElement;
}
export const useFabricCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvas = useRef<ExtendedCanvas | null>(null);
  return { canvasRef, fabricCanvas };
};