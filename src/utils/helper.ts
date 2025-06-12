// Helper function for collision detection
export function isColliding(object: fabric.Object, canvas: fabric.Canvas): boolean {
    const objects = canvas.getObjects();

    for (const other of objects) {
        if (other === object) continue;
        if (object.intersectsWithObject(other)) return true;
    }

    return false;
}