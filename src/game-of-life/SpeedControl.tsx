import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './SpeedControl.module.css';

function lerpColor(color1: string, color2: string, factor: number) {
  const f = Math.max(0, Math.min(1, factor));
  const [r1, g1, b1] = color1.match(/\w\w/g)!.map(x => parseInt(x, 16));
  const [r2, g2, b2] = color2.match(/\w\w/g)!.map(x => parseInt(x, 16));
  const r = Math.round(r1 + (r2 - r1) * f);
  const g = Math.round(g1 + (g2 - g1) * f);
  const b = Math.round(b1 + (b2 - b1) * f);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

interface Props {
  speed: number;
  onSpeedChanged: (speed: number) => void;
}

export default function SpeedControl({ speed: initialSpeed, onSpeedChanged }: Props) {
  const [speed, setSpeed] = useState(initialSpeed);
  const sliderRef = useRef<HTMLInputElement>(null);

  const handleSpeedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sliderValue = parseInt(event.target.value, 10);
    const invertedSpeed = 500 - sliderValue + 10;
    setSpeed(invertedSpeed);
  };

  useEffect(() => {
    const slider = sliderRef.current!;
    const value = slider.value;
    const max = slider.max;
    const percent = (parseInt(value, 10) / parseInt(max, 10)) * 100;

    const startColor = '#39ace7';
    const endColor = lerpColor('#39ace7', '#a7d7ef', percent / 100);

    slider.style.background = `linear-gradient(to right, ${startColor} 0%, ${endColor} ${percent}%, #e0e0e0 ${percent}%, #e0e0e0 100%)`;

    onSpeedChanged(speed);
  }, [speed, onSpeedChanged]);

  return (
    <div className={styles.SpeedControl}>
      <span className={styles.Label}>Frame time</span>
      <input
        type="range"
        id="speedSlider"
        min="10"
        max="500"
        step="10"
        value={500 - speed + 10}
        onChange={handleSpeedChange}
        className={styles.Slider}
        ref={sliderRef}
      />
      <label htmlFor="speedSlider" className={styles.Label}>{speed}ms</label>
    </div>
  );
}
