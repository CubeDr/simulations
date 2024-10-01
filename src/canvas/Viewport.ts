function lerp(from: number, to: number, ratio: number): number {
  return from + ratio * (to - from);
}

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

  zoomIn(x: number, y: number): Viewport {
    return new Viewport(
      lerp(this.offsetX, x, 1 / 3),
      lerp(this.offsetY, y, 1 / 3),
      this.width * 2 / 3,
      this.height * 2 / 3,
    );
  }

  zoomOut(x: number, y: number): Viewport {
    return new Viewport(
      lerp(this.offsetX, x, -1 / 2),
      lerp(this.offsetY, y, -1 / 2),
      this.width * 3 / 2,
      this.height * 3 / 2,
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
