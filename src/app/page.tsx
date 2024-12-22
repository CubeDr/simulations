import Link from 'next/link';
import Header from '../Header';

export default function Homepage() {
  return (
    <>
      <Header />
      <Link href='/game-of-life'>Conway's Game Of Life</Link>
    </>
  );
}