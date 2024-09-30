import styles from './App.module.css';

function App() {
  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <h1 className={styles.Title}>Simulations</h1>
        <a href="https://www.hyuni.dev" className={styles.Blog}>Blog</a>
      </header>
    </div>
  );
}

export default App;
