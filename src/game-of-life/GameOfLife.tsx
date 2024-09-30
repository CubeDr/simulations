import { useCallback, useState } from 'react';
import InteractiveCanvas from '../canvas/InteractiveCanvas';
import Snapshot from '../canvas/Snapshot';
import Viewport from '../canvas/Viewport';

export default function GameOfLife() {
  const [snapshot, setSnapshot] = useState(new Snapshot(new Array(500).fill(new Array(500).fill(0x101213ff))));
  const [viewport, setViewport] = useState<Viewport>(new Viewport(0, 0, 100, 50));

  const onViewportChanged = useCallback((viewport: Viewport, clientWidth: number, clientHeight: number) => {
    setViewport(viewport);

    const data = new Array(clientHeight).fill(0).map(() => new Array(clientWidth));

    const zoomX = viewport.width / clientWidth;
    const zoomY = viewport.height / clientHeight;

    for (let y = 0; y < clientHeight; y++) {
      for (let x = 0; x < clientWidth; x++) {
        const viewportX = viewport.offsetX + x * zoomX;
        const viewportY = viewport.offsetY + y * zoomY;

        const isFilled = (Math.floor(viewportX) + Math.floor(viewportY)) % 2 === 0;

        data[y][x] = isFilled ? 0xffffffff : 0x101213ff;
      }
    }

    setSnapshot(new Snapshot(data));
  }, [setViewport]);

  const onHover = useCallback((viewportX: number, viewportY: number) => {
    console.log(viewportX, viewportY);
  }, []);

  return (
    <>
      <InteractiveCanvas
        viewport={viewport}
        snapshot={snapshot}
        onViewportChanged={onViewportChanged}
        onHover={onHover} />
    </>
  );
}
