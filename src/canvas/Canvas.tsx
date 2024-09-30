import { useCallback, useEffect, useRef } from 'react';
import styles from './Canvas.module.css';
import Snapshot from './Snapshot';

export default function Canvas({ snapshot }: { snapshot: Snapshot }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>();
  const imageDataRef = useRef<ImageData>();

  const render = useCallback(() => {
    if (imageDataRef.current == null) return;
    const width = imageDataRef.current.width;
    const height = imageDataRef.current.height;
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
    contextRef.current = canvasRef.current!.getContext('2d')!;

    const resizeCanvas = () => {
      const width = document.documentElement.clientWidth;
      const height = width / 2;

      canvasRef.current!.width = width;
      canvasRef.current!.height = height;

      imageDataRef.current = contextRef.current!.createImageData(width, height);
      render();
    };

    window.addEventListener('load', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('load', resizeCanvas);
      window.removeEventListener('resize', resizeCanvas);
    }
  }, [render]);

  useEffect(() => {
    render();
  }, [snapshot, render]);

  return <canvas ref={canvasRef} className={styles.Canvas} />;
}