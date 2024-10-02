import React, { MouseEvent, PropsWithChildren, useCallback, useEffect, useRef } from 'react';

const MOVE_DRAG_THRESHOLD = 5;

interface Props {
  onClick: (x: number, y: number) => void;
  onRightClick: (x: number, y: number) => void;
  onHover: (x: number, y: number) => void;
  onNoHover: () => void;
  onDrag: (x: number, y: number, dx: number, dy: number) => void;
  onRightDrag: (x: number, y: number) => void;
  onMove: (dx: number, dy: number) => void;
  onZoom: (x: number, y: number, factor: number) => void;
}

export default function InteractionDetector({
  children,
  onClick,
  onRightClick,
  onHover,
  onNoHover,
  onDrag,
  onRightDrag,
  onMove,
  onZoom,
}: PropsWithChildren<Props>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const isLeftDownRef = useRef(false);
  const isRightDownRef = useRef(false);
  const isWheelDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const prevX = useRef(0);
  const prevY = useRef(0);
  const prevDistanceRef = useRef(0);

  const prevTouchCountRef = useRef(0);

  /* ==== Down ===== */
  const down = useCallback((x: number, y: number, button: number = 0) => {
    if (button === 0) {
      isLeftDownRef.current = true;
    } else if (button === 1) {
      isWheelDownRef.current = true;
    } else if (button === 2) {
      isRightDownRef.current = true;
    }
    prevX.current = x;
    prevY.current = y;
  }, []);

  const onMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
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
    } else if (e.button === 2) {
      isRightDownRef.current = false;
    }
    prevDistanceRef.current = 0;
  }, [onClick, onRightClick]);

  /* ===== Move (move & hover) ===== */
  const move = useCallback((x: number, y: number, callback: (dx: number, dy: number) => void) => {
    const dx = x - prevX.current;
    const dy = y - prevY.current;
    if (dx * dx + dy * dy < MOVE_DRAG_THRESHOLD * MOVE_DRAG_THRESHOLD) {
      return;
    }

    isDraggingRef.current = true;

    prevX.current = x;
    prevY.current = y;
    callback(dx, dy);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isLeftDownRef.current) {
      move(e.clientX, e.clientY, (dx, dy) => onDrag(x(e.clientX), y(e.clientY), dx, dy));
      onHover(x(e.clientX), y(e.clientY));
    } else if (isWheelDownRef.current) {
      move(e.clientX, e.clientY, onMove);
    } else if (isRightDownRef.current) {
      onRightDrag(x(e.clientX), y(e.clientY));
      onHover(x(e.clientX), y(e.clientY));
    } else {
      onHover(x(e.clientX), y(e.clientY));
    }
  }, [move, onDrag, onMove, onRightDrag, onHover]);

  useEffect(() => {
    function onTouchMove(e: TouchEvent) {
      e.preventDefault();

      if (e.touches.length === 1) {
        if (prevTouchCountRef.current === 1) {
          move(e.touches[0].clientX, e.touches[0].clientY, (dx, dy) => onDrag(x(e.touches[0].clientX), y(e.touches[0].clientY), dx, dy));
        } else {
          down(e.touches[0].clientX, e.touches[0].clientY);
        }
      } else if (e.touches.length === 2) {
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        move(centerX, centerY, onMove);

        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );

        const zoomFactor = distance / prevDistanceRef.current;
        prevDistanceRef.current = distance;

        onZoom(x(centerX), y(centerY), zoomFactor);
      }

      prevTouchCountRef.current = e.touches.length;
    }

    const container = containerRef.current!;
    container.addEventListener('touchmove', onTouchMove);
    return () => container.removeEventListener('touchmove', onTouchMove);
  }, [move, onDrag, down, onMove, onZoom]);

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
      onTouchEnd={onNoHover}
      onMouseUp={onMouseUp}
      onPointerMove={onMouseMove}
      onContextMenu={e => e.preventDefault()}>
      {children}
    </div>
  );
}