export default interface SimulationResult {
  frame: number;
  has(x: number, y: number): boolean;
  simulationTime: number;
}
