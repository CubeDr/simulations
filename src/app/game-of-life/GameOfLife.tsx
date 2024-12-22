'use client';

import { useCallback, useRef, useState } from 'react';
import { RenderEvent } from '../../canvas/Canvas';
import InteractiveCanvas, { DragBehavior } from '../../canvas/InteractiveCanvas';
import Snapshot from '../../canvas/Snapshot';
import Viewport from '../../canvas/Viewport';
import Header from '../../Header';
import ActionControl, { Action } from './ActionControl';
import styles from './GameOfLife.module.css';
import Point from './Point';
import { Simulation } from './Simulation';
import SimulationResult from './SimulationResult';
import SpeedControl from './SpeedControl';
import useIntervalTimer from './useIntervalTimer';

const FrameButtonGradient = () => (
  <defs>
    <linearGradient id="frameButtonGradient" gradientTransform="rotate(90)">
      <stop offset="0%" stopColor="#a7d7ef" />
      <stop offset="100%" stopColor="#39ace7" />
    </linearGradient>
  </defs>
);

export default function GameOfLife() {
  const [snapshot, setSnapshot] = useState(new Snapshot(new Array(500).fill(new Array(500).fill(0x101213ff))));

  const [hoverPoint, setHoverPoint] = useState<Point | null>(null);

  const simulationRef = useRef(new Simulation());
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const [action, setAction] = useState<Action>(Action.FILL);

  const [speed, setSpeed] = useState(300);
  const { start, pause } = useIntervalTimer(speed, () => next());
  const [isRunning, setIsRunning] = useState(false);

  const renderingStartTimeRef = useRef(0);
  const [lastRenderingTime, setLastRenderingTime] = useState(0);

  const onViewportChanged = useCallback((viewport: Viewport, clientWidth: number, clientHeight: number) => {
    renderingStartTimeRef.current = new Date().getTime();

    const width = Math.ceil(viewport.width) + 1;
    const height = Math.ceil(viewport.height) + 1;

    const data = new Array(height).fill(0).map(() => new Array(width));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const viewportX = Math.floor(viewport.offsetX + x);
        const viewportY = Math.floor(viewport.offsetY + y);

        if (viewportX === hoverPoint?.x && viewportY === hoverPoint?.y) {
          // Hover
          data[y][x] = 0xaaaaaaff;
        } else if ((simulationResult ?? simulationRef.current).has(viewportX, viewportY)) {
          // Filled
          data[y][x] = 0xffffffff;
        } else {
          // Empty
          data[y][x] = 0x101213ff;
        }
      }
    }

    setSnapshot(new Snapshot(data, {
      offsetX: viewport.offsetX - Math.floor(viewport.offsetX),
      offsetY: viewport.offsetY - Math.floor(viewport.offsetY),
      scaleX: width / viewport.width,
      scaleY: height / viewport.height,
    }));
  }, [hoverPoint, setSnapshot, simulationResult]);

  const onHover = useCallback((viewportX: number, viewportY: number) => {
    const x = Math.floor(viewportX);
    const y = Math.floor(viewportY);

    if (hoverPoint != null && hoverPoint.x === x && hoverPoint.y === y) {
      return;
    }
    setHoverPoint({ x, y });
  }, [hoverPoint, setHoverPoint]);

  const onClick = useCallback((viewportX: number, viewportY: number) => {
    // Do not mutate when simulation is playing.
    if (isRunning) return;

    const x = Math.floor(viewportX);
    const y = Math.floor(viewportY);

    if (action === Action.FILL) {
      setSimulationResult(simulationRef.current.add(x, y));
    } else if (action === Action.ERASE) {
      setSimulationResult(simulationRef.current.remove(x, y));
    }

  }, [isRunning, action]);

  const onRightClick = useCallback((viewportX: number, viewportY: number) => {
    // Do not mutate when simulation is playing.
    if (isRunning) return;

    const x = Math.floor(viewportX);
    const y = Math.floor(viewportY);

    setSimulationResult(simulationRef.current.remove(x, y));
  }, [isRunning]);

  const onRenderEvent = useCallback((e: RenderEvent) => {
    if (e === RenderEvent.FINISH) {
      setLastRenderingTime(new Date().getTime() - renderingStartTimeRef.current);
    }
  }, [setLastRenderingTime]);

  const clear = useCallback(() => {
    pause();
    setSimulationResult(simulationRef.current.clear());
  }, [pause, setSimulationResult]);

  const onActionSet = useCallback((action: Action) => {
    if (action === Action.CLEAR) {
      clear();
    } else {
      setAction(action);
    }
  }, [clear, setAction]);

  function prev() {
    const snapshot = simulationRef.current.prev();
    if (snapshot != null) {
      setSimulationResult(snapshot);
    }
  }

  function next() {
    setSimulationResult(simulationRef.current.next());
  }

  function play() {
    if (isRunning) {
      pause();
    } else {
      start();
      setAction(Action.MOVE);
    }
    setIsRunning(!isRunning);
  }

  return (
    <>
      <Header title="Conway's Game of Life" />
      <div className={styles.GameOfLife}>
        <InteractiveCanvas
          snapshot={snapshot}
          dragBehavior={action === Action.MOVE ? DragBehavior.MOVE : DragBehavior.CLICK}
          onViewportChanged={onViewportChanged}
          onHover={onHover}
          onNoHover={() => setHoverPoint(null)}
          onClick={onClick}
          onRightClick={onRightClick}
          onRenderEvent={onRenderEvent} />
        <div className={styles.Stats}>
          <span className={styles.Frame}>
            # {simulationResult?.frame ?? 0}
          </span>
          <span className={styles.Times}>
            Simulation: {simulationResult?.simulationTime ?? 0}ms<br />
            Rendering: {lastRenderingTime}ms
          </span></div>
        <div className={styles.Control}>
          <ActionControl action={action} onActionSet={onActionSet} />
          <div className={styles.FrameButtonContainer}>
            <button onClick={prev} disabled={(simulationResult?.frame ?? 0) === 0 || isRunning} className={styles.FrameButton} title="Previous frame">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{
                transform: 'rotate(180deg)',
              }}>
                <path d="M13 16.25C12.9015 16.2505 12.8038 16.2312 12.7128 16.1935C12.6218 16.1557 12.5393 16.1001 12.47 16.03C12.3296 15.8894 12.2507 15.6987 12.2507 15.5C12.2507 15.3012 12.3296 15.1106 12.47 14.97L15.47 11.97L12.47 8.96999C12.3999 8.82472 12.3784 8.6607 12.4089 8.50227C12.4393 8.34385 12.5201 8.19947 12.6391 8.09056C12.7581 7.98165 12.909 7.91402 13.0695 7.89771C13.23 7.88139 13.3915 7.91726 13.53 7.99999L17.03 11.5C17.1705 11.6406 17.2494 11.8312 17.2494 12.03C17.2494 12.2287 17.1705 12.4194 17.03 12.56L13.53 16C13.4633 16.0756 13.3819 16.1367 13.2908 16.1797C13.1997 16.2227 13.1007 16.2466 13 16.25Z" />
                <path d="M7.5 16.25C7.30706 16.2352 7.12757 16.1455 7 16C6.87702 15.8625 6.80902 15.6845 6.80902 15.5C6.80902 15.3155 6.87702 15.1375 7 15L10 12L7 8.99998C6.93316 8.86003 6.91135 8.70279 6.93758 8.54993C6.96381 8.39707 7.03678 8.2561 7.14645 8.14643C7.25612 8.03676 7.39709 7.96379 7.54995 7.93756C7.70282 7.91133 7.86005 7.93314 8 7.99998L11.5 11.5C11.6405 11.6406 11.7193 11.8312 11.7193 12.03C11.7193 12.2287 11.6405 12.4194 11.5 12.56L8 16C7.87243 16.1455 7.69295 16.2352 7.5 16.25Z" />
              </svg>
            </button>
            <button onClick={play} className={styles.FrameButton} title={
              !isRunning
                ? 'Start simulation'
                : 'Pause simulation'
            }>{
                !isRunning
                  ? <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 408.221 408.221">
                      <FrameButtonGradient />
                      <path fill="url(#frameButtonGradient)" d="M204.11,0C91.388,0,0,91.388,0,204.111c0,112.725,91.388,204.11,204.11,204.11c112.729,0,204.11-91.385,204.11-204.11    C408.221,91.388,316.839,0,204.11,0z M286.547,229.971l-126.368,72.471c-17.003,9.75-30.781,1.763-30.781-17.834V140.012    c0-19.602,13.777-27.575,30.781-17.827l126.368,72.466C303.551,204.403,303.551,220.217,286.547,229.971z" />
                    </svg>
                  </>
                  : <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="2 2 20 20" >
                      <FrameButtonGradient />
                      <path fill="url(#frameButtonGradient)" fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM8.07612 8.61732C8 8.80109 8 9.03406 8 9.5V14.5C8 14.9659 8 15.1989 8.07612 15.3827C8.17761 15.6277 8.37229 15.8224 8.61732 15.9239C8.80109 16 9.03406 16 9.5 16C9.96594 16 10.1989 16 10.3827 15.9239C10.6277 15.8224 10.8224 15.6277 10.9239 15.3827C11 15.1989 11 14.9659 11 14.5V9.5C11 9.03406 11 8.80109 10.9239 8.61732C10.8224 8.37229 10.6277 8.17761 10.3827 8.07612C10.1989 8 9.96594 8 9.5 8C9.03406 8 8.80109 8 8.61732 8.07612C8.37229 8.17761 8.17761 8.37229 8.07612 8.61732ZM13.0761 8.61732C13 8.80109 13 9.03406 13 9.5V14.5C13 14.9659 13 15.1989 13.0761 15.3827C13.1776 15.6277 13.3723 15.8224 13.6173 15.9239C13.8011 16 14.0341 16 14.5 16C14.9659 16 15.1989 16 15.3827 15.9239C15.6277 15.8224 15.8224 15.6277 15.9239 15.3827C16 15.1989 16 14.9659 16 14.5V9.5C16 9.03406 16 8.80109 15.9239 8.61732C15.8224 8.37229 15.6277 8.17761 15.3827 8.07612C15.1989 8 14.9659 8 14.5 8C14.0341 8 13.8011 8 13.6173 8.07612C13.3723 8.17761 13.1776 8.37229 13.0761 8.61732Z" />
                    </svg>
                  </>
              }</button>
            <button onClick={next} disabled={isRunning} className={styles.FrameButton} title="Next frame">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 16.25C12.9015 16.2505 12.8038 16.2312 12.7128 16.1935C12.6218 16.1557 12.5393 16.1001 12.47 16.03C12.3296 15.8894 12.2507 15.6987 12.2507 15.5C12.2507 15.3012 12.3296 15.1106 12.47 14.97L15.47 11.97L12.47 8.96999C12.3999 8.82472 12.3784 8.6607 12.4089 8.50227C12.4393 8.34385 12.5201 8.19947 12.6391 8.09056C12.7581 7.98165 12.909 7.91402 13.0695 7.89771C13.23 7.88139 13.3915 7.91726 13.53 7.99999L17.03 11.5C17.1705 11.6406 17.2494 11.8312 17.2494 12.03C17.2494 12.2287 17.1705 12.4194 17.03 12.56L13.53 16C13.4633 16.0756 13.3819 16.1367 13.2908 16.1797C13.1997 16.2227 13.1007 16.2466 13 16.25Z" />
                <path d="M7.5 16.25C7.30706 16.2352 7.12757 16.1455 7 16C6.87702 15.8625 6.80902 15.6845 6.80902 15.5C6.80902 15.3155 6.87702 15.1375 7 15L10 12L7 8.99998C6.93316 8.86003 6.91135 8.70279 6.93758 8.54993C6.96381 8.39707 7.03678 8.2561 7.14645 8.14643C7.25612 8.03676 7.39709 7.96379 7.54995 7.93756C7.70282 7.91133 7.86005 7.93314 8 7.99998L11.5 11.5C11.6405 11.6406 11.7193 11.8312 11.7193 12.03C11.7193 12.2287 11.6405 12.4194 11.5 12.56L8 16C7.87243 16.1455 7.69295 16.2352 7.5 16.25Z" />
              </svg>
            </button>
          </div>
          <SpeedControl speed={speed} onSpeedChanged={setSpeed} />
        </div>
      </div>
    </>
  );
}
