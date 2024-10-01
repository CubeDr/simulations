import { useCallback, useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
import InteractionDetector from './InteracionDetector';
import Snapshot from './Snapshot';
import Viewport from './Viewport';

interface Props {
  snapshot: Snapshot;
  onViewportChanged: (viewport: Viewport, clientWidth: number, clientHeight: number) => void;
  onHover: (viewportX: number, viewportY: number) => void;
  onClick: (viewportX: number, viewportY: number) => void;
  onRightClick: (viewportX: number, viewportY: number) => void;
}

export default function InteractiveCanvas({
  snapshot,
  onViewportChanged,
  onHover,
  onClick,
  onRightClick,
}: Props) {
  const [viewport, setViewport] = useState(new Viewport(0, 0, 100, 100 / document.documentElement.clientWidth * document.documentElement.clientHeight * 0.7));

  const containerRef = useRef<HTMLDivElement>(null);

  const viewportX = useCallback((pointerX: number) => {
    return viewport.offsetX + pointerX / containerRef.current!.clientWidth * viewport.width;
  }, [viewport]);

  const viewportY = useCallback((pointerY: number) => {
    return viewport.offsetY + pointerY / containerRef.current!.clientHeight * viewport.height;
  }, [viewport]);

  const onCanvasResize = useCallback((width: number, height: number, originalWidth?: number, originalHeight?: number) => {
    if (originalWidth == null || originalHeight == null) {
      setViewport(viewport => viewport.copy());
    } else {
      setViewport(viewport => viewport.resize(viewport.width * width / originalWidth, viewport.height * height / originalHeight));
    }
  }, []);

  useEffect(() => {
    onViewportChanged(viewport, containerRef.current!.offsetWidth, containerRef.current!.offsetHeight);
  }, [viewport, onViewportChanged]);

  function drag(dx: number, dy: number) {
    setViewport(viewport => {
      const viewportDx = -dx * viewport.width / containerRef.current!.offsetWidth;
      const viewportDy = -dy * viewport.height / containerRef.current!.offsetHeight;

      return viewport.move(viewportDx, viewportDy);
    });
  }

  return (
    <div ref={containerRef}
      style={{
        cursor: 'none',
        margin: '0 -18px',
      }}>
      <InteractionDetector
        onClick={(x, y) => onClick(viewportX(x), viewportY(y))}
        onRightClick={(x, y) => onRightClick(viewportX(x), viewportY(y))}
        onHover={(x, y) => onHover(viewportX(x), viewportY(y))}
        onDrag={(dx, dy) => drag(dx, dy)}
        onZoom={(x, y, factor) => {
          setViewport(viewport => viewport.zoom(factor, viewportX(x), viewportY(y)));
        }}>
        <Canvas snapshot={snapshot} onResize={onCanvasResize} />
      </InteractionDetector>
    </div>
  );
}