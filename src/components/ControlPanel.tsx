import { clearCanvas, exportCanvasImage, exportCanvasJSON, exportCanvasSVG } from "../utils";
import type { ControlProps } from "./types";

export const ControlPanel = ({ run, collisionDetectionActive, setCollisionDetectionActive }: ControlProps) => {

    const renderButton = (label: string, handler: (canvas: fabric.Canvas) => void) => (
        <button onClick={() => run(handler)}>{label}</button>
    );
    return (
        <div className="btn-wrapper">
            <div className="btn-wrapper">
                {renderButton("Clear", clearCanvas)}
                {renderButton("Export JSON", exportCanvasJSON)}
                {renderButton("Download PNG", exportCanvasImage)}
                {renderButton("Download SVG", exportCanvasSVG)}
                <button onClick={() => setCollisionDetectionActive(prev => !prev)}>
                {collisionDetectionActive ? 'Deactivate' : 'Activate'} Collision Detection
            </button>
            </div>
        </div>
    )
}