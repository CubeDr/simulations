import { useCallback, useEffect, useRef } from 'react';
import Snapshot from './Snapshot';

interface Props {
  snapshot: Snapshot;
  onResize: (width: number, height: number, originalWidth?: number, originalHeight?: number) => void;
}

export default function Canvas({ snapshot, onResize }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D>();
  const imageDataRef = useRef<ImageData>();

  const widthRef = useRef(0);
  const heightRef = useRef(0);

  const onWindowResize = useCallback(() => {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight * 0.7;

    if (widthRef.current === width && heightRef.current === height) return;

    canvasRef.current!.width = width;
    canvasRef.current!.height = height;

    imageDataRef.current = contextRef.current!.createImageData(width, height);

    const originalWidth = widthRef.current;
    const originalHeight = heightRef.current;
    widthRef.current = width;
    heightRef.current = height;

    if (originalWidth === 0 || originalHeight === 0) {
      onResize(width, height);
    } else {
      onResize(width, height, originalWidth, originalHeight);
    }
  }, [onResize]);

  const render = useCallback(() => {
    const width = canvasRef.current!.width;
    const height = canvasRef.current!.height;

    if (contextRef.current == null) {
      contextRef.current = canvasRef.current!.getContext('2d')!;
    }

    if (imageDataRef.current == null
      || imageDataRef.current.width !== width
      || imageDataRef.current.height !== height) {
      imageDataRef.current = contextRef.current.createImageData(width, height);
    }

    const data = imageDataRef.current.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const pixel = x < snapshot.width && y < snapshot.height
          ? snapshot.pixels[y][x]
          : 0x101213ff;

        for (let i = 0; i < 4; i++) {
          const shift = (3 - i) * 8;
          data[index + i] = (pixel >> shift) & 0xff;
        }
      }
    }

    contextRef.current!.putImageData(imageDataRef.current, 0, 0);
  }, [snapshot]);

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);

    // Call resize once the component is loaded so the canvas can be rendered in correct size.
    setTimeout(() => {
      onWindowResize();
    });

    return () => {
      window.removeEventListener('resize', onWindowResize);
    }
  }, [onWindowResize]);

  useEffect(() => {
    render();
  }, [render]);

  return <canvas ref={canvasRef} />;
}