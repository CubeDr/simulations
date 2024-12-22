'use client';

import React, { useRef, useState, useEffect, useCallback, PropsWithChildren } from 'react';
import Viewport from '../../canvas/Viewport';

interface Props {
  initialViewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
}

export default function InteractiveCanvas({ initialViewport, onViewportChange, children }: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState<Viewport>(initialViewport);

  useEffect(() => {
    onViewportChange(viewport);
  }, [viewport, onViewportChange]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !ref.current) return;

    const deltaX = (dragStart.x - e.clientX) / ref.current.clientWidth * viewport.width;
    const deltaY = (e.clientY - dragStart.y) / ref.current.clientHeight * viewport.height;

    setViewport((v) => v.move(deltaX, deltaY));

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, viewport.width, viewport.height, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;

    setViewport((prevViewport) => {
      const mouseX = e.clientX - ref.current!.offsetLeft;
      const mouseY = e.clientY - ref.current!.offsetTop;

      const x = (mouseX * prevViewport.width / ref.current!.clientWidth) + prevViewport.offsetX;
      const y = prevViewport.height - (mouseY * prevViewport.height / ref.current!.clientHeight) + prevViewport.offsetY;

      return prevViewport.zoom(zoomFactor, x, y);
    });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseup', handleMouseUp);
      element.addEventListener('mouseleave', handleMouseUp);
      element.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseup', handleMouseUp);
        element.removeEventListener('mouseleave', handleMouseUp);
        element.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleWheel]);

  return (
    <div
      ref={ref}
      style={{ border: '1px solid black', display: 'inline-block' }}
    >
      {children}
    </div>
  );
}