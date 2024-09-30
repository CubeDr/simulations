import Canvas from '../canvas/Canvas';
import Snapshot from '../canvas/Snapshot';

export default function GameOfLife() {

  return (
    <>
      <Canvas snapshot={
        new Snapshot(new Array(500).fill(new Array(500).fill(0xffff13ff)))
      } />
    </>
  );
}
