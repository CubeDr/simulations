import SimulationResult from './SimulationResult';

type SimulationResultWithPoints = SimulationResult & {
  points: Map<number, Set<number>>;
};

export class Simulation {
  private frame = 0;
  private points = new Map<number, Set<number>>();
  private history: SimulationResultWithPoints[] = [];
  private historyIndex = 0;

  constructor() {
    this.clear();
  }

  add(x: number, y: number): SimulationResult {
    this.points = this.history[this.historyIndex - 1].points;
    this.points.set(y, (this.points.get(y) ?? new Set<number>()).add(x));

    this.history = [];
    this.historyIndex = 0;
    this.frame = 0;
    return this.addHistory(this.toSimulationResult(this.frame, this.points));
  }

  remove(x: number, y: number): SimulationResult {
    const points = this.history[this.historyIndex - 1].points;
    if (points.get(y)?.delete(x)) {
      this.points = points;
      this.history = [];
      this.historyIndex = 0;
      this.frame = 0;
      return this.addHistory(this.toSimulationResult(this.frame, this.points));
    }

    return this.history[this.historyIndex - 1];
  }

  has(x: number, y: number) {
    return this.points.get(y)?.has(x) ?? false;
  }

  next(): SimulationResult {
    if (this.historyIndex < this.history.length) {
      return this.history[this.historyIndex++];
    }

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

    return this.addHistory(this.toSimulationResult(++this.frame, nextPoints));
  }

  prev(): SimulationResult | null {
    if (this.historyIndex <= 1) return null;
    return this.history[--this.historyIndex - 1];
  }

  clear(): SimulationResult {
    this.frame = 0;
    this.points = new Map<number, Set<number>>();
    this.history = [];
    this.historyIndex = 0;
    return this.addHistory(this.toSimulationResult(0, this.points));
  }

  private toSimulationResult(frame: number, points: Map<number, Set<number>>) {
    return {
      frame,
      points,
      has: (x: number, y: number) => points.get(y)?.has(x) ?? false,
    };
  }

  private addHistory(simulationResult: SimulationResultWithPoints) {
    if (this.history.length > this.historyIndex) {
      this.history = this.history.slice(0, this.historyIndex);
    }

    this.history.push(simulationResult);
    this.historyIndex++;

    return simulationResult;
  }
}