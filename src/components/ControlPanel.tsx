import { clearCanvas, exportCanvasImage, exportCanvasJSON, exportCanvasSVG } from "../utils";

type Props = {
    run: (action: (canvas: fabric.Canvas) => void) => void;
    collisionDetectionActive: boolean;
    setCollisionDetectionActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ControlPanel = ({ run, collisionDetectionActive, setCollisionDetectionActive }: Props) => {

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