export class Simulation {
  private readonly points = new Map<number, Set<number>>();

  add(x: number, y: number) {
    this.points.set(y, (this.points.get(y) ?? new Set<number>()).add(x));
  }

  has(x: number, y: number) {
    return this.points.get(y)?.has(x) ?? false;
  }
}