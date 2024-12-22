'use client';

import { useState } from 'react';
import InteractiveCanvas from './InteractiveCanvas';
import MandelbrotRenderer from './MandelbrotRenderer';
import Viewport from '../../canvas/Viewport';

export default function Mandelbrot() {
  const [viewport, setViewport] = useState<Viewport>(new Viewport(-2, -1, 3, 2));

  return (
    <>
      <InteractiveCanvas
        initialViewport={viewport}
        onViewportChange={(newViewport) => setViewport(newViewport)}
      >
        <MandelbrotRenderer viewport={viewport} />
      </InteractiveCanvas>
    </>
  );
}