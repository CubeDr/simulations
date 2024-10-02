interface RenderingOptions {
  // [0.0, 1.0)
  readonly offsetX: number;
  // [0.0, 1.0)
  readonly offsetY: number;
  readonly scaleX: number;
  readonly scaleY: number;
}

export default class Snapshot {
  readonly width: number;
  readonly height: number;
  readonly pixels: number[][];

  readonly renderingOptions: RenderingOptions;

  constructor(pixels: number[][], renderingOptions: RenderingOptions = { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 }) {
    this.width = pixels[0]?.length ?? 0;
    this.height = pixels.length;
    this.pixels = pixels;
    this.renderingOptions = renderingOptions;
  }
}
