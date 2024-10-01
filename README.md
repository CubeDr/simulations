# Simulations [![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/CubeDr)
https://simulation.hyuni.dev

A React.js and TypeScript implementation of various simulations that runs on web.

## [Conway's Game of Life](https://simulation.hyuni.dev/#/game-of-life)
An interactive simulation of Conway's Game of Life, allowing interactive exploration of emergent patterns through a user-friendly interface.

https://github.com/user-attachments/assets/ff76689e-d358-4e80-b0bd-a8c9faed83a2

### Featured
#### Interactive Grid
Enjoy the smooth interaction experience directly with the grid where the cells live.
- **Click** to fill / erase a cell.
- **Right click** to erase a cell.
- **Drag** to fill / erase multiple cells.
- **Drag the wheel** to move around.
- **Roll the wheel** to zoom.
#### Click behavior
Change how your click or touch behaves by choosing one of the buttons on the left bottom corner.
- **Fill mode** lets you fill the cell on click or drag.
- **Erase mode** lets you erase the cell on click or drag.
- **Clear button** will empty the map.
#### Frame-by-Frame Simulation
Explore how the cells evolve by controlling the simulation frame by frame using the buttons on the bottom center and the slider on the right bottom corner.
  - **Play button** starts the animation.
  - **Next button** moves to the next simulation frame.
  - **Previous button** moves to the previous simulation frame.
  - **Frame time slider** lets you precisely control the simulation speed.
### Coming Soon
* Pattern Library
  * Access a curated selection of classic Game of Life patterns, instantly loading them onto the grid for experimentation.
* State Persistence
  * Preserve your simulation progress using browser cache, seamlessly resuming from where you left off even after closing the application.
* Optimized Performance
  * Separates the UI thread from the simulation logic using Web Workers, ensuring smooth and responsive interactions even during complex computations.
