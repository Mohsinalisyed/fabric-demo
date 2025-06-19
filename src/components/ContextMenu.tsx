import type { ContextMenuProps } from "./types";

export const ContextMenu = ({
  visible,
  position,
  onCopy,
  onPaste,
  onDuplicate,
  onDelete,
}: ContextMenuProps) => {
if (!visible.canvasRightClick && !visible.objectRightClick) return null;
  return (
    <ul
      id="customContextMenu"
      className="context-menu"
      style={{ top: position.y, left: position.x }}
    >
      {visible.objectRightClick ? (
        <>
          <li onClick={onCopy} className="menu-item">Copy</li>
          <li onClick={onDuplicate} className="menu-item">Duplicate</li>
          <li onClick={onDelete} className="menu-item">Delete</li>
        </>
      ) :
      visible.canvasRightClick ? (
        <li onClick={onPaste} className="menu-item">Paste</li>
      ) : null}
    </ul>
  );
};
