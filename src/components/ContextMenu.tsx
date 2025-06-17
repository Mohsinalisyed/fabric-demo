interface ContextMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const ContextMenu = ({ visible, position, onCopy, onPaste, onDuplicate, onDelete }: ContextMenuProps) => {
  if (!visible) return null;
  return (
    <ul
      id="customContextMenu"
      className="context-menu"
      style={{ top: position.y, left: position.x }}
    >
      <li onClick={onCopy} className="menu-item">Copy</li>
      <li onClick={onPaste} className="menu-item">Paste</li>
      <li onClick={onDuplicate} className="menu-item">Duplicate</li>
      <li onClick={onDelete} className="menu-item">Delete</li>
    </ul>
  );
};
