import { Metadata } from 'next';
import Header from '../../Header';
import Mandelbrot from './Mandelbrot';

export const metadata: Metadata = {
  title: 'Mandelbrot Set',
};

export default function MandelbrotPage() {
  return (
    <>
      <Header title='Mandelbrot Set' />
      <Mandelbrot />
    </>
  );
}