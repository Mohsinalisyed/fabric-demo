/* eslint-disable @typescript-eslint/no-explicit-any */
import { fabric } from 'fabric';

export const copyItem = (
  targetObject: fabric.Object | null,
  copiedObjectRef: React.MutableRefObject<fabric.Object | null>,
  setMenuVisible: (visible: boolean) => void
) => {
  if (targetObject) {
    targetObject.clone((c: any) => (copiedObjectRef.current = c));
  }
  setMenuVisible(false);
};

export const pasteItem = (
  fabricCanvas: fabric.Canvas | null,
  copiedObjectRef: React.MutableRefObject<fabric.Object | null>,
  setMenuVisible: (visible: boolean) => void
) => {
  if (fabricCanvas && copiedObjectRef.current) {
    copiedObjectRef.current.clone((cloned: any) => {
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
        evented: true,
      });
      fabricCanvas.add(cloned);
      fabricCanvas.setActiveObject(cloned);
      fabricCanvas.requestRenderAll();
    });
    setMenuVisible(false);
  }
};

export const duplicateItem = (
  fabricCanvas: fabric.Canvas | null,
  targetObject: fabric.Object | null,
  setMenuVisible: (visible: boolean) => void
) => {
  if (fabricCanvas && targetObject) {
    targetObject.clone((cloned: any) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
        evented: true,
      });
      fabricCanvas.add(cloned);
      fabricCanvas.setActiveObject(cloned);
      fabricCanvas.requestRenderAll();
    });
    setMenuVisible(false);
  }
};

export const deleteItem = (
  fabricCanvas: fabric.Canvas | null,
  targetObject: fabric.Object | null,
  setTargetObject: (obj: fabric.Object | null) => void,
  setMenuVisible: (visible: boolean) => void
) => {
  if (fabricCanvas && targetObject) {
    fabricCanvas.remove(targetObject);
    fabricCanvas.renderAll();
    setTargetObject(null);
    setMenuVisible(false);
  }
};
