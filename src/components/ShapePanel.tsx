// components/FabricCanvas/ShapePanel.tsx
import {
    addRectangle,
    addCircle,
    addTriangle,
    addLine,
    addText,
    addIText,
    addTextBox,
    addPolygon,
    addPattern,
    addImage,
    addSVG,
    addGradientRectangle,
    addGradientCircle,
    addArc,
    addCustomArc,
} from '../utils';

type Props = {
    run: (action: (canvas: fabric.Canvas) => void) => void;
};

const ShapePanel = ({ run }: Props) => {
    const renderButton = (label: string, handler: (canvas: fabric.Canvas) => void) => (
        <button onClick={() => run(handler)}>{label}</button>
    );

    return (
        <div>
            <h3>Add Shapes</h3>
            <div className="btn-wrapper">
                {renderButton('Add Rectangle', addRectangle)}
                {renderButton('Add Circle', addCircle)}
                {renderButton('Add Triangle', addTriangle)}
                {renderButton('Add Line', addLine)}
                {renderButton('Add Text', addText)}
                {renderButton('Add IText', addIText)}
                {renderButton('Add TextBox', addTextBox)}
                {renderButton('Add Polygon', addPolygon)}
                {renderButton('Add Pattern', addPattern)}
            </div>

            <h3>Add Images</h3>
            <div className="btn-wrapper">
                {renderButton('Add PNG Image', addImage)}
                {renderButton('Add SVG Image', addSVG)}
            </div>

            <h3>Add Gradients</h3>
            <div className="btn-wrapper">
                {renderButton('Add Gradient Rect', addGradientRectangle)}
                {renderButton('Add Gradient Circle', addGradientCircle)}
            </div>

            <h3>Add Arcs</h3>
            <div className="btn-wrapper">
                {renderButton('Add Arc', addArc)}
                {renderButton('Add Custom Arc', addCustomArc)}
            </div>
        </div>
    );
};

export default ShapePanel;
