import styles from './Header.module.css';

interface Props {
  title?: string;
}

export default function Header({ title }: Props) {
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