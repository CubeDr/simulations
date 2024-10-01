function translate(from: number, to: number, ratio: number): number {
  return to + ratio * (from - to);
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

  zoom(factor: number, x: number, y: number): Viewport {
    return new Viewport(
      translate(this.offsetX, x, 1 / factor),
      translate(this.offsetY, y, 1 / factor),
      this.width / factor,
      this.height / factor
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
