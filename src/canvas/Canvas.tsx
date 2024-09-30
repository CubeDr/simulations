import { useEffect, useRef } from 'react';
import styles from './Canvas.module.css';

export default function Canvas({ content }: { content: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const resizeCanvas = () => {
      const width = document.documentElement.clientWidth;
      const height = width / 2;

      canvasRef.current!.width = width;
      canvasRef.current!.height = height;

      render();
    };

    window.addEventListener('load', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('load', resizeCanvas);
      window.removeEventListener('resize', resizeCanvas);
    }
  }, []);

  useEffect(() => {
    render();
  }, [content]);

  function render() {
    const context = canvasRef.current!.getContext('2d')!;
    context.fillStyle = '#101213ff';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  return <canvas ref={canvasRef} className={styles.Canvas} />;
}