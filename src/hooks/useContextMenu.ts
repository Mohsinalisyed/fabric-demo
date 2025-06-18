import { useState } from "react";

export const useContextMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [targetObject, setTargetObject] = useState<fabric.Object | null>(null);

  const showContextMenu = (x: number, y: number, target: fabric.Object | null) => {
    setTargetObject(target); // ✅ allows null
    setMenuPosition({ x, y });
    setMenuVisible(true);
  };

  return {
    menuVisible,
    menuPosition,
    targetObject,
    setTargetObject,
    setMenuVisible,
    showContextMenu,
  };
};
