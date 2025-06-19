/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CUSTOM_PROPERTIES } from "../utils";

export interface CanvasElementProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    handleContextMenu: (e: MouseEvent) => void;
    setSelectedObject: (obj: fabric.Object | null) => void;
    setSelectedLayer: (layer: number | null) => void;
    collisionDetectionActive: boolean;
    setCanvasObjects: (objs: fabric.Object[]) => void;
    showContextMenu: (x: number, y: number, target: fabric.Object | null) => void;
    setMenuVisible: (visible: MenuVisbleType) => void;
    setTargetObject: (obj: fabric.Object | null) => void;
}
export interface CanvasElementLayerProps {
    selectedLayer: number | null;
    objects: fabric.Object[];
    onReorder: (fromIndex: number, toIndex: number) => void;
}
export
    interface CanvasVideoProps {
    fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
}export interface MenuVisbleType {
    canvasRightClick: boolean, objectRightClick: boolean
}

export interface ContextMenuProps {
    visible: MenuVisbleType;
    position: { x: number; y: number };
    onCopy: () => void;
    onPaste: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    targetObject: fabric.Object | null;
}
export type ControlProps = {
    run: (action: (canvas: fabric.Canvas) => void) => void;
    collisionDetectionActive: boolean;
    setCollisionDetectionActive: React.Dispatch<React.SetStateAction<boolean>>;
};
export interface DrawingCanvasProps {
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}
export interface JsonToFabricCanvasProps {
    canvas: fabric.Canvas | null;
}
export type PropertiesProps = {
    selectedObject: fabric.Object | null;
    canvasRef: React.MutableRefObject<fabric.Canvas | null>;
};
export type ShapeProps = {
    run: (action: (canvas: fabric.Canvas) => void) => void;
    canvasRef: React.MutableRefObject<fabric.Canvas | null>;
};
export interface SvgToFabricLoaderProps {
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}
export type ExtendedTextboxOptions = fabric.ITextboxOptions & {
    borderRadius?: number;
    paddingX?: number;
    paddingY?: number;
    customBackgroundColor?: string;
};
type CustomPropertyKey = (typeof CUSTOM_PROPERTIES)[number];
// Object type used during deserialization
export type TextboxWithPaddingObject = fabric.IObjectOptions &
    Partial<Record<CustomPropertyKey, any>> & {
        text: string;
    };
