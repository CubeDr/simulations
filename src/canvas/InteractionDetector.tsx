import React, { MouseEvent, PropsWithChildren, useCallback, useEffect, useRef } from 'react';

const MOVE_DRAG_THRESHOLD = 5;

interface Props {
  onClick: (x: number, y: number) => void;
  onRightClick: (x: number, y: number) => void;
  onHover: (x: number, y: number) => void;
  onDrag: (x: number, y: number) => void;
  onMove: (dx: number, dy: number) => void;
  onZoom: (x: number, y: number, factor: number) => void;
}

export default function InteractionDetector({ children, onClick, onRightClick, onHover, onDrag, onMove, onZoom }: PropsWithChildren<Props>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const isLeftDownRef = useRef(false);
  const isWheelDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const prevX = useRef(0);
  const prevY = useRef(0);
  const prevDistanceRef = useRef(0);

  /* ==== Down ===== */
  const down = useCallback((x: number, y: number, button: number = 0) => {
    if (button === 0) {
      isLeftDownRef.current = true;
    } else if (button === 1) {
      isWheelDownRef.current = true;
    }
    prevX.current = x;
    prevY.current = y;
  }, []);

  const onMouseDown = useCallback((e: MouseEvent) => {
    down(e.clientX, e.clientY, e.button);
  }, [down]);

  const onTouchDown = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      down(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      prevDistanceRef.current = distance;

      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      prevX.current = centerX;
      prevY.current = centerY;
    }
  }, [down]);

  /* ===== Up ===== */
  const onMouseUp = useCallback((e: MouseEvent) => {
    const dx = e.clientX - prevX.current;
    const dy = e.clientY - prevY.current;
    if (dx * dx + dy * dy < MOVE_DRAG_THRESHOLD * MOVE_DRAG_THRESHOLD) {
      switch (e.button) {
        case 0:  // Left click
          onClick(x(e.clientX), y(e.clientY));
          break;
        case 2:  // Right click
          onRightClick(x(e.clientX), y(e.clientY));
          break;
      }
    }

    isDraggingRef.current = false;
    if (e.button === 0) {
      isLeftDownRef.current = false;
    } else if (e.button === 1) {
      isWheelDownRef.current = false;
    }
    prevDistanceRef.current = 0;
  }, [onClick, onRightClick]);

  /* ===== Move (move & hover) ===== */
  const move = useCallback((x: number, y: number) => {
    const dx = x - prevX.current;
    const dy = y - prevY.current;
    if (dx * dx + dy * dy < MOVE_DRAG_THRESHOLD * MOVE_DRAG_THRESHOLD) {
      return;
    }

    isDraggingRef.current = true;

    prevX.current = x;
    prevY.current = y;
    onMove(dx, dy);
  }, [onMove]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isLeftDownRef.current) {
      onDrag(x(e.clientX), y(e.clientY));
    } else if (isWheelDownRef.current) {
      move(e.clientX, e.clientY);
    } else {
      onHover(x(e.clientX), y(e.clientY));
    }
  }, [onDrag, move, onHover]);

  useEffect(() => {
    function onTouchMove(e: TouchEvent) {
      e.preventDefault();

      if (e.touches.length === 1) {
        onDrag(x(e.touches[0].clientX), y(e.touches[0].clientY));
      } else if (e.touches.length === 2) {
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        move(centerX, centerY);

        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );

        const zoomFactor = distance / prevDistanceRef.current;
        prevDistanceRef.current = distance;

        onZoom(x(centerX), y(centerY), zoomFactor);
      }
    }

    const container = containerRef.current!;
    container.addEventListener('touchmove', onTouchMove);
    return () => container.removeEventListener('touchmove', onTouchMove);
  }, [onDrag, move, onZoom]);

  /* ===== Zoom ===== */
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      e.stopPropagation();

      onZoom(x(e.clientX), y(e.clientY), e.deltaY > 0 ? 2 / 3 : 3 / 2);
    }

    const container = containerRef.current!;
    container.addEventListener('wheel', onWheel);
    return () => {
      container.removeEventListener('wheel', onWheel);
    }
  }, [onZoom]);

  /* ===== Converts ===== */
  function x(clientX: number) {
    return clientX - containerRef.current!.getBoundingClientRect().left;
  }

  function y(clientY: number) {
    return clientY - containerRef.current!.getBoundingClientRect().top;
  }

  return (
    <div ref={containerRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onContextMenu={e => e.preventDefault()}>
      {children}
    </div>
  );
}