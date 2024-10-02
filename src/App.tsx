import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import GameOfLife from './game-of-life/GameOfLife';
import Header from './Header';

function App() {
  return (
    <HashRouter>
      <div className={styles.App}>
        <Routes>
          <Route path="/">
            <Route index element={
              <>
                <Header />
                <Link to="game-of-life">Conway's Game Of Life</Link>
              </>} />
            <Route path="game-of-life" element={<GameOfLife />} />
          </Route>
        </Routes>
      </div>
      <iframe
        src="https://github.com/sponsors/CubeDr/card"
        title="Sponsor CubeDr"
        height="225"
        width="100%"
        style={{ border: 0, marginTop: '24px' }} />
    </HashRouter>
  );
}

export default App;
