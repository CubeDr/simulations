export default class Viewport {
  readonly offsetX: number;
  readonly offsetY: number;
  readonly width: number;
  readonly height: number;

  constructor(offsetX: number, offsetY: number, width: number, height: number) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.width = width;
    this.height = height;
  }

  move(dx: number, dy: number): Viewport {
    return new Viewport(
      this.offsetX + dx,
      this.offsetY + dy,
      this.width,
      this.height,
    );
  }

  resize(width: number, height: number): Viewport {
    return new Viewport(
      this.offsetX,
      this.offsetY,
      width,
      height,
    );
  }

  copy() {
    return new Viewport(
      this.offsetX,
      this.offsetY,
      this.width,
      this.height,
    );
  }
}
