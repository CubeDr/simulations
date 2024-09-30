import { useCallback, useState } from 'react';
import InteractiveCanvas from '../canvas/InteractiveCanvas';
import Snapshot from '../canvas/Snapshot';
import Viewport from '../canvas/Viewport';

export default function GameOfLife() {
  const [snapshot, setSnapshot] = useState(new Snapshot(new Array(500).fill(new Array(500).fill(0xffff13ff))));

  const onViewportChanged = useCallback((viewport: Viewport, clientWidth: number, clientHeight: number) => {
    const data = new Array(clientHeight).fill(0).map(() => new Array(clientWidth));

    const zoomX = viewport.width / clientWidth;
    const zoomY = viewport.height / clientHeight;

    for (let y = 0; y < clientHeight; y++) {
      for (let x = 0; x < clientWidth; x++) {
        const viewportX = viewport.offsetX + x * zoomX;
        const viewportY = viewport.offsetY + y * zoomY;

        const isFilled = (Math.floor(viewportX / 4) + Math.floor(viewportY / 4)) % 2 === 0;

        data[y][x] = isFilled ? 0xffffffff : 0x101213ff;
      }
    }

    setSnapshot(new Snapshot(data));
  }, []);

  return (
    <>
      <InteractiveCanvas
        snapshot={snapshot}
        onViewportChanged={onViewportChanged} />
    </>
  );
}
