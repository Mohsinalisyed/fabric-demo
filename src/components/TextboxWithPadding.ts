import { fabric } from 'fabric';

export class TextboxWithPadding extends fabric.Textbox {
  borderRadius: number;
  paddingX: number;
  paddingY: number;

  constructor(
    text: string,
    options: fabric.ITextboxOptions & {
      borderRadius?: number;
      paddingX?: number;
      paddingY?: number;
    }
  ) {
    super(text, options);

    this.borderRadius = options.borderRadius ?? 0;
    this.paddingX = options.paddingX ?? this.padding ?? 0;
    this.paddingY = options.paddingY ?? this.padding ?? 0;
  }

  _renderBackground(ctx: CanvasRenderingContext2D) {
    if (!ctx || !this.backgroundColor) return;

    const dim = this._getNonTransformedDimensions();
    const x = -dim.x / 2 - this.paddingX;
    const y = -dim.y / 2 - this.paddingY;
    const width = dim.x + this.paddingX * 2;
    const height = dim.y + this.paddingY * 2;
    const r = Math.min(this.borderRadius, width / 2, height / 2);

    ctx.fillStyle = this.backgroundColor;

    // Draw rounded rectangle
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
    ctx.fill();

    if (typeof this._removeShadow === 'function') {
      this._removeShadow(ctx);
    }
  }

  // Optional: override _getPadding to avoid unwanted default padding behavior
  _getPadding() {
    return Math.max(this.paddingX, this.paddingY);
  }
}

// Register the class globally in Fabric if needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(fabric as any).TextboxWithPadding = TextboxWithPadding;
