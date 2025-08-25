const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 10, paddleHeight = 80;
const ballSize = 10;
let playerY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 4, ballSpeedY = 4;
let playerSpeed = 6;
let score = 0;
let gameOver = false;

// Draw paddle
function drawPaddle(x, y) {
  ctx.fillStyle = "#0ff";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

// Draw ball
function drawBall(x, y) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, ballSize, ballSize);
}

// Draw score
function drawScore() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 20, 30);
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle(10, playerY);
  drawBall(ballX, ballY);
  drawScore();

  if (gameOver) {
    ctx.font = "36px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Press R to Restart", canvas.width / 2 - 80, canvas.height / 2 + 40);
  }
}

// Move player paddle
document.addEventListener('keydown', function(e) {
  if (e.key === "ArrowUp") {
    playerY -= playerSpeed;
    if (playerY < 0) playerY = 0;
  } else if (e.key === "ArrowDown") {
    playerY += playerSpeed;
    if (playerY > canvas.height - paddleHeight) playerY = canvas.height - paddleHeight;
  } else if (e.key.toLowerCase() === "r" && gameOver) {
    resetGame();
  }
});

// Update game state
function update() {
  if (gameOver) return;

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top/bottom
  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY *= -1;
  }

  // Ball collision with paddle
  if (
    ballX <= 10 + paddleWidth &&
    ballY + ballSize >= playerY &&
    ballY <= playerY + paddleHeight
  ) {
    ballSpeedX *= -1;
    ballX = 10 + paddleWidth; // Prevent sticking
    score++;
    // Increase speed slightly
    ballSpeedX *= 1.05;
    ballSpeedY *= 1.05;
  }

  // Ball goes out of bounds (right side bounces, left side is game over)
  if (ballX + ballSize >= canvas.width) {
    ballSpeedX *= -1;
    ballX = canvas.width - ballSize;
  }
  if (ballX <= 0) {
    gameOver = true;
  }
}

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function resetGame() {
  playerY = (canvas.height - paddleHeight) / 2;
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
  score = 0;
  gameOver = false;
}

// Start the game
resetGame();
loop();
