import SimulationResult from "./SimulationResult";

export class Simulation {
  private frame = 0;
  private points = new Map<number, Set<number>>();

  add(x: number, y: number) {
    this.points.set(y, (this.points.get(y) ?? new Set<number>()).add(x));
  }

  has(x: number, y: number) {
    return this.points.get(y)?.has(x) ?? false;
  }

  next(): SimulationResult {
    const nextCounts = new Map<number, Map<number, number>>();

    this.points.forEach((points, y) => {
      points.forEach((x) => {
        for (let py = y - 1; py <= y + 1; py++) {
          if (!nextCounts.has(py)) {
            nextCounts.set(py, new Map<number, number>());
          }
          const xMap = nextCounts.get(py)!;

          for (let px = x - 1; px <= x + 1; px++) {
            if (x === px && y === py) continue;

            xMap.set(px, (xMap.get(px) ?? 0) + 1);
          }
        }
      });
    });

    const nextPoints = new Map<number, Set<number>>();
    nextCounts.forEach((counts, y) => {
      counts.forEach((count, x) => {
        if ((count === 2 && this.has(x, y)) || count === 3) {
          nextPoints.set(y, (nextPoints.get(y) ?? new Set<number>()).add(x));
        }
      });
    });
    this.points = nextPoints;

    return {
      frame: ++this.frame,
      has: (x: number, y: number) => nextPoints.get(y)?.has(x) ?? false
      ,
    };
  }
}