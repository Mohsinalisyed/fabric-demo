import { clearCanvas, exportCanvasImage, exportCanvasJSON, exportCanvasSVG } from "../utils";

type Props = {
    run: (action: (canvas: fabric.Canvas) => void) => void;
}
export const ControlPanel = ({ run }: Props) => {
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
            </div>
        </div>
    )
}