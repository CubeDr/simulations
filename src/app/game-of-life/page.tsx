import { Metadata } from 'next';
import Header from '../../Header';
import GameOfLife from './GameOfLife';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Conway's Game of Life",
};

export default function GameOfLifePage() {
  return (
    <>
      <Header title="Conway's Game of Life" />
      <GameOfLife />
    </>
  );
}