import { useCallback, useEffect, useRef, useState } from 'react';
import InteractiveCanvas from '../canvas/InteractiveCanvas';
import Snapshot from '../canvas/Snapshot';
import Viewport from '../canvas/Viewport';
import Point from './Point';
import { Simulation } from './Simulation';

export default function GameOfLife() {
  const [snapshot, setSnapshot] = useState(new Snapshot(new Array(500).fill(new Array(500).fill(0x101213ff))));
  const [viewport, setViewport] = useState<Viewport>(new Viewport(0, 0, 100, 50));

  const [hoverPoint, setHoverPoint] = useState<Point | null>(null);

  const clientWidthRef = useRef(0);
  const clientHeightRef = useRef(0);

  const simulationRef = useRef(new Simulation());

  const onViewportChanged = useCallback((viewport: Viewport, clientWidth: number, clientHeight: number) => {
    setViewport(viewport);
    clientWidthRef.current = clientWidth;
    clientHeightRef.current = clientHeight;
  }, [setViewport]);

  const onHover = useCallback((viewportX: number, viewportY: number) => {
    const x = Math.floor(viewportX);
    const y = Math.floor(viewportY);

    if (hoverPoint != null && hoverPoint.x === x && hoverPoint.y === y) {
      return;
    }
    setHoverPoint({ x, y });
  }, [hoverPoint, setHoverPoint]);

  const onClick = useCallback((viewportX: number, viewportY: number) => {
    const x = Math.floor(viewportX);
    const y = Math.floor(viewportY);

    simulationRef.current.add(x, y);
  }, []);

  // Render snapshot
  useEffect(() => {
    const clientWidth = clientWidthRef.current;
    const clientHeight = clientHeightRef.current;

    const data = new Array(clientHeight).fill(0).map(() => new Array(clientWidth));

    const zoomX = viewport.width / clientWidth;
    const zoomY = viewport.height / clientHeight;

    for (let y = 0; y < clientHeight; y++) {
      for (let x = 0; x < clientWidth; x++) {
        const viewportX = Math.floor(viewport.offsetX + x * zoomX);
        const viewportY = Math.floor(viewport.offsetY + y * zoomY);

        if (viewportX === hoverPoint?.x && viewportY === hoverPoint?.y) {
          // Hover
          data[y][x] = 0xaaaaaaff;
        } else if (simulationRef.current.has(viewportX, viewportY)) {
          // Filled
          data[y][x] = 0xffffffff;
        } else {
          // Empty
          data[y][x] = 0x101213ff;
        }
      }
    }

    setSnapshot(new Snapshot(data));
  }, [viewport, hoverPoint, setSnapshot]);

  return (
    <>
      <InteractiveCanvas
        viewport={viewport}
        snapshot={snapshot}
        onViewportChanged={onViewportChanged}
        onHover={onHover}
        onClick={onClick} />
    </>
  );
}
