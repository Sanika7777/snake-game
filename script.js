const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('msg');

const SIZE = 20;
const COLS = canvas.width / SIZE;
const ROWS = canvas.height / SIZE;
const SPEED = 150; // ms per tick

let snake, dir, nextDir, food, score, running, loop;

function init() {
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  running = false;
  scoreEl.textContent = 'Score: 0';
  msgEl.textContent = 'Press any WASD key to start';
  placeFood();
  draw();
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function start() {
  if (running) return;
  running = true;
  msgEl.textContent = '';
  loop = setInterval(tick, SPEED);
}

function tick() {
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) return gameOver();
  // Self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) return gameOver();

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = 'Score: ' + score;
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Food as dot
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.arc(food.x * SIZE + SIZE / 2, food.y * SIZE + SIZE / 2, SIZE / 2 - 3, 0, Math.PI * 2);
  ctx.fill();

  // Snake
  snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? '#4ecca3' : '#2eaf87';
    ctx.fillRect(seg.x * SIZE + 1, seg.y * SIZE + 1, SIZE - 2, SIZE - 2);
  });
}

function gameOver() {
  clearInterval(loop);
  running = false;
  msgEl.textContent = 'Game Over! Score: ' + score + ' — Press WASD to restart';
  init();
}

document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  if      (key === 'w' && dir.y !== 1)  nextDir = { x: 0, y: -1 };
  else if (key === 's' && dir.y !== -1) nextDir = { x: 0, y: 1 };
  else if (key === 'a' && dir.x !== 1)  nextDir = { x: -1, y: 0 };
  else if (key === 'd' && dir.x !== -1) nextDir = { x: 1, y: 0 };
  else return;
  start();
});

init();
