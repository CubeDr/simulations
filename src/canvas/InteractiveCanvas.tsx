import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
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

  const isPointerDownRef = useRef(false);
  const isPointerDragRef = useRef(false);
  const dragPrevXRef = useRef(0);
  const dragPrevYRef = useRef(0);

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

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      e.stopPropagation();

      const { top, left, width, height } = containerRef.current!.getBoundingClientRect();
      const pointerX = e.clientX - left;
      const pointerY = e.clientY - top;

      const viewportX = viewport.offsetX + pointerX / width * viewport.width;
      const viewportY = viewport.offsetY + pointerY / height * viewport.height;

      const isZoomIn = e.deltaY < 0;
      if (isZoomIn) {
        setViewport(viewport => viewport.zoomIn(viewportX, viewportY));
      } else {
        setViewport(viewport => viewport.zoomOut(viewportX, viewportY));
      }
    }

    const container = containerRef.current!;
    container.addEventListener('wheel', onWheel);
    return () => container.removeEventListener('wheel', onWheel);
  }, [viewport]);

  function onPointerDown(e: MouseEvent) {
    if (e.button !== 0) return;

    isPointerDownRef.current = true;
    dragPrevXRef.current = e.screenX;
    dragPrevYRef.current = e.screenY;
  }

  function onPointerUp(e: MouseEvent) {
    if (!isPointerDragRef.current) {
      const { left, top } = containerRef.current!.getBoundingClientRect();
      switch (e.button) {
        case 0: // Left click
          onClick(
            viewportX(e.clientX - left),
            viewportY(e.clientY - top));
          break;
        case 2: // Right click
          onRightClick(
            viewportX(e.clientX - left),
            viewportY(e.clientY - top));
          return;
      }
    }

    isPointerDownRef.current = false;
    isPointerDragRef.current = false;
  }

  function onPointerMove(e: MouseEvent) {
    if (!isPointerDownRef.current) {
      onPointerHover(e);
      return;
    }

    isPointerDragRef.current = true;
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

  function onPointerHover(e: MouseEvent) {
    const { left, top } = containerRef.current!.getBoundingClientRect();
    onHover(
      viewportX(e.clientX - left),
      viewportY(e.clientY - top));
  }

  return (
    <div ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onContextMenu={e => e.preventDefault()}
      style={{
        cursor: 'none',
        margin: '0 -18px',
      }}>
      <Canvas snapshot={snapshot} onResize={onCanvasResize} />
    </div>
  );
}