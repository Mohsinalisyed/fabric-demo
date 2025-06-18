/* eslint-disable @typescript-eslint/no-explicit-any */
import { fabric } from 'fabric';

// Define the list of custom properties
const CUSTOM_PROPERTIES = [
  'borderRadius',
  'paddingX',
  'paddingY',
  'customBackgroundColor',
] as const;

type CustomPropertyKey = (typeof CUSTOM_PROPERTIES)[number];

// Extend Fabric's textbox options with custom properties
type ExtendedTextboxOptions = fabric.ITextboxOptions & {
  borderRadius?: number;
  paddingX?: number;
  paddingY?: number;
  customBackgroundColor?: string;
};

// Object type used during deserialization
type TextboxWithPaddingObject = fabric.IObjectOptions &
  Partial<Record<CustomPropertyKey, any>> & {
    text: string;
  };

export class TextboxWithPadding extends fabric.Textbox {
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  customBackgroundColor?: string;

  constructor(text: string, options: ExtendedTextboxOptions = {}) {
    super(text, {
      ...options,
      backgroundColor: '', // Disable default background rendering
    });

    this.borderRadius = options.borderRadius ?? 0;
    this.paddingX = options.paddingX ?? 0;
    this.paddingY = options.paddingY ?? 0;
    this.customBackgroundColor =
      options.customBackgroundColor ?? options.backgroundColor ?? '';
    this.set('type', 'textbox-with-padding');
  }

  _render(ctx: CanvasRenderingContext2D) {
      console.log('override _render function');
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

  toObject(propertiesToInclude: string[] = []) {
    const customProps = CUSTOM_PROPERTIES.reduce<Record<string, any>>((acc, key) => {
      acc[key] = this[key as keyof this];
      return acc;
    }, {});

    return {
      ...super.toObject([...propertiesToInclude, ...CUSTOM_PROPERTIES]),
      ...customProps,
      type: 'textbox-with-padding',
    };
  }

  static fromObject(
    object: TextboxWithPaddingObject,
    callback?: (obj: TextboxWithPadding) => void
  ): TextboxWithPadding {
    const instance = new TextboxWithPadding(object.text, object);
    callback?.(instance);
    return instance;
  }
}

// Register the custom class with Fabric for JSON deserialization
(fabric as any).TextboxWithPadding = TextboxWithPadding;
(fabric as any)['textbox-with-padding'] = TextboxWithPadding;
