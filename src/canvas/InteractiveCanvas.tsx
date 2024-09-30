import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
import Snapshot from './Snapshot';
import Viewport from './Viewport';

interface Props {
  snapshot: Snapshot;
  onViewportChanged: (viewport: Viewport, clientWidth: number, clientHeight: number) => void;
}

export default function InteractiveCanvas({ snapshot, onViewportChanged }: Props) {
  const [viewport, setViewport] = useState(new Viewport(0, 0, 100, 50));

  const containerRef = useRef<HTMLDivElement>(null);

  const isPointerDownRef = useRef(false);
  const dragPrevXRef = useRef(0);
  const dragPrevYRef = useRef(0);

  const onCanvasResize = useCallback((width: number, height: number, originalWidth?: number, originalHeight?: number) => {
    if (originalWidth == null || originalHeight == null) return;

    setViewport(viewport => viewport.resize(viewport.width * width / originalWidth, viewport.height * height / originalHeight));
  }, []);

  useEffect(() => {
    onViewportChanged(viewport, containerRef.current!.offsetWidth, containerRef.current!.offsetHeight);
  }, [viewport, onViewportChanged]);

  function onPointerDown(e: MouseEvent) {
    isPointerDownRef.current = true;
    dragPrevXRef.current = e.screenX;
    dragPrevYRef.current = e.screenY;
  }

  function onPointerUp() {
    isPointerDownRef.current = false;
  }

  function onPointerMove(e: MouseEvent) {
    if (!isPointerDownRef.current) return;

    const dx = e.screenX - dragPrevXRef.current;
    const dy = e.screenY - dragPrevYRef.current;

    dragPrevXRef.current = e.screenX;
    dragPrevYRef.current = e.screenY;

    setViewport(viewport => {
      const viewportDx = -dx * viewport.width / containerRef.current!.offsetWidth;
      const viewportDy = -dy * viewport.height / containerRef.current!.offsetHeight;
      return viewport.move(viewportDx, viewportDy);
    });
  }

  return (
    <div ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      style={{
        margin: '-18px',
      }}>
      <Canvas snapshot={snapshot} onResize={onCanvasResize} />
    </div>
  );
}