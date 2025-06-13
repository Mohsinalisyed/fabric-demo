/* eslint-disable @typescript-eslint/no-explicit-any */
import { fabric } from 'fabric';

export class TextboxWithPadding extends fabric.Textbox {
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  customBackgroundColor: string | undefined;

  constructor(
    text: string,
    options: fabric.ITextboxOptions & {
      borderRadius?: number;
      paddingX?: number;
      paddingY?: number;
      customBackgroundColor?: string;
    } = {}
  ) {
    super(text, {
      ...options,
      backgroundColor: '', // prevent Fabric default background rendering
    });

    this.borderRadius = options.borderRadius ?? 0;
    this.paddingX = options.paddingX ?? 0;
    this.paddingY = options.paddingY ?? 0;
    this.customBackgroundColor =
      options.customBackgroundColor ?? options.backgroundColor ?? '';
    this.set('type', 'textbox-with-padding'); // For loadFromJSON
  }

  _render(ctx: CanvasRenderingContext2D) {
    this._renderCustomBackground(ctx);
    super._render(ctx);
  }

  private _renderCustomBackground(ctx: CanvasRenderingContext2D) {
    if (!this.customBackgroundColor) return;

    const dim = super._getNonTransformedDimensions();
    const x = -dim.x / 2 - this.paddingX;
    const y = -dim.y / 2 - this.paddingY;
    const width = dim.x + this.paddingX * 2;
    const height = dim.y + this.paddingY * 2;
    const r = Math.min(this.borderRadius, width / 2, height / 2);

    ctx.save();
    ctx.fillStyle = this.customBackgroundColor;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  getBoundingRect(absolute = false, calculate = false) {
    const rect = super.getBoundingRect(absolute, calculate);
    rect.width += this.paddingX * 2;
    rect.height += this.paddingY * 2;
    rect.left -= this.paddingX;
    rect.top -= this.paddingY;
    return rect;
  }

  _getNonTransformedDimensions() {
    const dim = super._getNonTransformedDimensions();
    return {
      x: dim.x + this.paddingX * 2,
      y: dim.y + this.paddingY * 2,
    };
  }

  toObject(propertiesToInclude?: string[]) {
    return {
      ...super.toObject(propertiesToInclude),
      borderRadius: this.borderRadius,
      paddingX: this.paddingX,
      paddingY: this.paddingY,
      customBackgroundColor: this.customBackgroundColor,
      type: 'textbox-with-padding',
    };
  }

  static fromObject(
    object: any,
    callback: (obj: TextboxWithPadding) => void
  ): void {
    const instance = new TextboxWithPadding(object.text, {
      ...object,
      borderRadius: object.borderRadius,
      paddingX: object.paddingX,
      paddingY: object.paddingY,
      customBackgroundColor: object.customBackgroundColor,
    });

    callback(instance);
  }
}

// Register class for FabricJS deserialization
(fabric as any).TextboxWithPadding = TextboxWithPadding;
(fabric as any)['textbox-with-padding'] = TextboxWithPadding;
