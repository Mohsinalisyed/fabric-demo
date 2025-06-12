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
    this.paddingX = options.paddingX ?? 0;
    this.paddingY = options.paddingY ?? 0;
  }

  _renderBackground(ctx: CanvasRenderingContext2D) {
    if (!ctx || !this.backgroundColor) return;

    const dim = this._getNonTransformedDimensions();
    const scaleX = this.scaleX ?? 1;
    const scaleY = this.scaleY ?? 1;

    const scaledPaddingX = this.paddingX / scaleX;
    const scaledPaddingY = this.paddingY / scaleY;

    const x = -dim.x / 2 - scaledPaddingX;
    const y = -dim.y / 2 - scaledPaddingY;
    const width = dim.x + scaledPaddingX * 2;
    const height = dim.y + scaledPaddingY * 2;
    const r = Math.min(this.borderRadius * scaleX, width / 2, height / 2);

    ctx.fillStyle = this.backgroundColor;

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

  _getPadding() {
    return Math.max(this.paddingX, this.paddingY);
  }

  _getNonTransformedDimensions() {
    const dim = super._getNonTransformedDimensions();
    return {
      x: dim.x + this.paddingX * 2,
      y: dim.y + this.paddingY * 2,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(fabric as any).TextboxWithPadding = TextboxWithPadding;
