import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import GameOfLife from './game-of-life/GameOfLife';

function App() {
  return (
    <HashRouter>
      <div className={styles.App}>
        <header className={styles.Header}>
          <h1><a className={styles.Title} href="/">Simulations</a></h1>
          <a href="https://www.hyuni.dev">Blog</a>
        </header>
        <Routes>
          <Route path="/">
            <Route index element={<Link to="game-of-life">Conway's Game Of Life</Link>} />
            <Route path="game-of-life" element={<GameOfLife />} />
          </Route>
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
