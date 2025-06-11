import { clearCanvas, exportCanvasJSON } from "../utils";

type Props = {
    run: (action: (canvas: fabric.Canvas) => void) => void;
}
export const ControlPanel = ({ run }: Props) => {
    const renderButton = (label: string, handler: (canvas: fabric.Canvas) => void) => (
        <button onClick={() => run(handler)}>{label}</button>
    );
    return (
        <div className="btn-wrapper">
            {renderButton('Clear', clearCanvas)}
            {renderButton('Export JSON', exportCanvasJSON)}
        </div>
    )
}