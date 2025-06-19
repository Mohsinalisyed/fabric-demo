/* eslint-disable @typescript-eslint/no-explicit-any */
import { fabric } from 'fabric';
import type { MenuVisbleType } from '../components/ContextMenu';

export const copyItem = (
  targetObject: fabric.Object | null,
  copiedObjectRef: React.MutableRefObject<fabric.Object | null>,
  setMenuVisible: (visible:MenuVisbleType) => void
) => {
  if (targetObject) {
    targetObject.clone((c: any) => (copiedObjectRef.current = c));
  }
  setMenuVisible({objectRightClick:false,canvasRightClick:false});
};

export const pasteItem = (
  fabricCanvas: fabric.Canvas | null,
  copiedObjectRef: React.MutableRefObject<fabric.Object | null>,
  setMenuVisible: (visible: MenuVisbleType) => void
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
    setMenuVisible({objectRightClick:false,canvasRightClick:false});
  }
};

export const duplicateItem = (
  fabricCanvas: fabric.Canvas | null,
  targetObject: fabric.Object | null,
  setMenuVisible: (visible: MenuVisbleType) => void
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
    setMenuVisible({objectRightClick:false,canvasRightClick:false});
  }
};

export const deleteItem = (
  fabricCanvas: fabric.Canvas | null,
  targetObject: fabric.Object | null,
  setTargetObject: (obj: fabric.Object | null) => void,
  setMenuVisible: (visible: MenuVisbleType) => void
) => {
  if (fabricCanvas && targetObject) {
    fabricCanvas.remove(targetObject);
    fabricCanvas.renderAll();
    setTargetObject(null);
    setMenuVisible({objectRightClick:false,canvasRightClick:false});
  }
};
