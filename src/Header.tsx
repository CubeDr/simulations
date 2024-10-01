import { useEffect } from 'react';
import styles from './Header.module.css';

interface Props {
  title?: string;
}

export default function Header({ title }: Props) {
  useEffect(() => {
    if (title != null) {
      document.title = title + ' - Online simulations';
    }
  }, [title]);

  return (
    <header className={styles.Header}>
      <h1>
        <a href="/">Simulations</a>
        {title && <>&nbsp;- {title}</>}
      </h1>
      <a href="https://www.hyuni.dev">Blog</a>
    </header>
  );
}