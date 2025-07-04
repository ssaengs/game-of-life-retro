// Game of Life - Pixel Art UI
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configurable grid size
const CELL_SIZE = 16; // pixel size of each cell
const GRID_WIDTH = Math.floor(canvas.width / CELL_SIZE);
const GRID_HEIGHT = Math.floor(canvas.height / CELL_SIZE);

let grid = createEmptyGrid();
let running = false;
let interval = null;
let speed = 100;

function createEmptyGrid() {
  return Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
}

function randomizeGrid() {
  grid = grid.map(row => row.map(() => Math.random() > 0.7 ? 1 : 0));
  drawGrid();
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (grid[y][x]) {
        // Pixel-art style: bright color, shadow border
        ctx.fillStyle = '#f8f8f2';
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = '#4a4e69';
        ctx.lineWidth = 2;
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      } else {
        // Dead cell: dark background
        ctx.fillStyle = '#2a2a40';
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function nextGeneration() {
  const newGrid = createEmptyGrid();
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const neighbors = countNeighbors(x, y);
      if (grid[y][x]) {
        newGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
      } else {
        newGrid[y][x] = neighbors === 3 ? 1 : 0;
      }
    }
  }
  grid = newGrid;
  drawGrid();
}

function countNeighbors(x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
        count += grid[ny][nx];
      }
    }
  }
  return count;
}

function start() {
  if (!running) {
    running = true;
    interval = setInterval(nextGeneration, speed);
  }
}

function pause() {
  running = false;
  clearInterval(interval);
}

function clearGrid() {
  grid = createEmptyGrid();
  drawGrid();
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
  if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
    grid[y][x] = grid[y][x] ? 0 : 1;
    drawGrid();
  }
});

document.getElementById('start').onclick = start;
document.getElementById('pause').onclick = pause;
document.getElementById('clear').onclick = () => {
  pause();
  clearGrid();
};
document.getElementById('random').onclick = () => {
  pause();
  randomizeGrid();
};
document.getElementById('speed').oninput = (e) => {
  speed = 1000 / e.target.value;
  if (running) {
    pause();
    start();
  }
};

// Initial draw
clearGrid(); 