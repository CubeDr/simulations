export default class Snapshot {
  readonly width: number;
  readonly height: number;
  readonly pixels: number[][];

  constructor(pixels: number[][]) {
    this.width = pixels[0]?.length ?? 0;
    this.height = pixels.length;
    this.pixels = pixels;
  }
}
