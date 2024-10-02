export default class Snapshot {
  // [0.0, 1.0)
  readonly offsetX: number;
  // [0.0, 1.0)
  readonly offsetY: number;
  readonly width: number;
  readonly height: number;
  readonly pixels: number[][];

  constructor(offsetX: number, offsetY: number, pixels: number[][]) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.width = pixels[0]?.length ?? 0;
    this.height = pixels.length;
    this.pixels = pixels;
  }
}
