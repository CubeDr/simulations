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
  
  zoom(factor: number, x: number, y: number): Viewport {
    if (factor > 1) {
      // Zoom In
      return new Viewport(
        lerp(this.offsetX, x, 1 - 1 / factor),
        lerp(this.offsetY, y, 1 - 1 / factor),
        this.width / factor,
        this.height / factor
      );
    } else if (factor < 1) {
      // Zoom Out
      return new Viewport(
        lerp(this.offsetX, x, factor - 1),
        lerp(this.offsetY, y, factor - 1),
        this.width * (1 / factor),
        this.height * (1 / factor)
      );
    } else {
      // No change (factor === 1)
      return this;
    }
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
