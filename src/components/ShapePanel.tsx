import { fabric } from 'fabric';
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
import { TextboxWithPadding } from './TextboxWithPadding';

type Props = {
    run: (action: (canvas: fabric.Canvas) => void) => void;
    canvasRef: React.MutableRefObject<fabric.Canvas | null>;
};

const ShapePanel = ({ run, canvasRef }: Props) => {
    const renderButton = (label: string, handler: (canvas: fabric.Canvas) => void) => (
        <button onClick={() => run(handler)}>{label}</button>
    );
    const addTextboxWithPadding = () => {
        run(canvas => {
            const textbox = new TextboxWithPadding('Hello World!', {
                left: 100,
                top: 100,
                fontSize: 32,
                fill: '#000',
                customBackgroundColor: 'lightblue',
                paddingX: 20,
                paddingY: 12,
                borderRadius: 20,
                textAlign: 'center',
                width: 200
            });
            canvas.add(textbox);
            canvas.setActiveObject(textbox);
            canvas.renderAll();

        });
    };
    const handleGroup = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const activeObject = canvas.getActiveObject();

        if (!activeObject || !(activeObject instanceof fabric.ActiveSelection)) return;

        // Convert to group
        const group = activeObject.toGroup();
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
    };



    const handleUngroup = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const group = canvas.getActiveObject();
        if (!(group instanceof fabric.Group)) return;
        group.toActiveSelection();
        canvas.discardActiveObject()
        canvas.requestRenderAll();
    };




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
            <h3>Add Custom</h3>
            <div className="btn-wrapper">
                {renderButton('Add Custom Textbox', addTextboxWithPadding)}
            </div>
            {/* Group/Ungroup Controls */}
            <div className="btn-wrapper" style={{ marginTop: '10px' }}>
                {renderButton('Group', handleGroup)}
                {renderButton('Ungroup', handleUngroup)}
            </div>
        </div>
    );
};

export default ShapePanel;
