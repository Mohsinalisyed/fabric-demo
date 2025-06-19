import { useState } from "react";

export const useContextMenu = () => {
  const [menuVisible, setMenuVisible] = useState({canvasRightClick:false, objectRightClick:false});
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [targetObject, setTargetObject] = useState<fabric.Object | null>(null);

  const showContextMenu = (x: number, y: number, target: fabric.Object | null) => {
    setTargetObject(target); // ✅ allows null
    setMenuPosition({ x, y });
  };

  return {
    menuVisible,
    menuPosition,
    targetObject,
    setTargetObject,
    setMenuPosition,
    showContextMenu,
    setMenuVisible
  };
};
