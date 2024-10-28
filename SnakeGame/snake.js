var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody=[];

var foodX;
var foodY;

var gameOver = false;
var score = 0;
var gradient;

// Add at the top with other variables
var gameStarted = false;

window.onload = function(){
  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d");
  placefood();
  document.addEventListener("keyup", changeDirection);
  document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && gameOver) {
      resetGame();
    }
  });
  
  // Create gradient for snake
  gradient = context.createLinearGradient(0, 0, board.width, board.height);
  gradient.addColorStop(0, '#4CAF50');
  gradient.addColorStop(1, '#45a049');
  
  // Decrease speed from 15 FPS to 10 FPS for more manageable gameplay
  setInterval(update, 1000/10);
}


function update() {
  if (gameOver) {
    return;
  }

  // Don't update snake position if game hasn't started
  if (!gameStarted) {
    // Draw initial screen
    context.fillStyle = "#000";
    context.fillRect(0, 0, board.width, board.height);
    
    // Draw initial snake
    context.fillStyle = gradient;
    context.beginPath();
    context.roundRect(snakeX, snakeY, blockSize, blockSize, 5);
    context.fill();
    
    // Draw "Press arrow keys to start" text
    context.fillStyle = "#fff";
    context.font = "25px Arial";
    context.textAlign = "center";
    context.fillText("Press arrow keys to start", board.width/2, board.height/2);
    return;
  }

  // Update snake position - Add these lines
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;

  // Background
  context.fillStyle = "#000";
  context.fillRect(0, 0, board.width, board.height);
  
  // Grid effect
  context.strokeStyle = "#111";
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      context.strokeRect(j * blockSize, i * blockSize, blockSize, blockSize);
    }
  }

  // Food with glow effect
  context.shadowBlur = 20;
  context.shadowColor = "red";
  context.fillStyle = "#ff0000";
  context.beginPath();
  context.arc(foodX + blockSize/2, foodY + blockSize/2, blockSize/2, 0, 2 * Math.PI);
  context.fill();
  context.shadowBlur = 0;

  // Snake body with gradient
  if (snakeX == foodX && snakeY == foodY) {
    // Add new segment at the end of the snake
    let tail = snakeBody.length > 0 ? 
      [...snakeBody[snakeBody.length - 1]] : 
      [snakeX, snakeY];
    snakeBody.push(tail);
    placefood();
    score += 10;
    document.getElementById("score").textContent = score;
  }

  // Move body segments first
  for (let i = snakeBody.length-1; i > 0; i--) {
    snakeBody[i] = [...snakeBody[i-1]];
  }
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  // Draw snake with gradient and rounded corners
  context.fillStyle = gradient;
  context.shadowBlur = 10;
  context.shadowColor = "#45a049";
  
  // Draw head
  context.beginPath();
  context.roundRect(snakeX, snakeY, blockSize, blockSize, 5);
  context.fill();

  // Draw body
  for (let i = 0; i < snakeBody.length; i++) {
    context.beginPath();
    context.roundRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize, 5);
    context.fill();
  }
  context.shadowBlur = 0;

  // Collision detection
  if (snakeX < 0 || snakeX >= cols * blockSize || snakeY < 0 || snakeY >= rows * blockSize) {
    gameOver = true;
    showGameOver();
  }

  // Check collision with body, but skip the head position
  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
      gameOver = true;
      showGameOver();
    }
  }
}

function showGameOver() {
  context.fillStyle = "rgba(0, 0, 0, 0.75)";
  context.fillRect(0, 0, board.width, board.height);
  
  context.fillStyle = "#fff";
  context.font = "40px Arial";
  context.textAlign = "center";
  context.fillText("GAME OVER", board.width/2, board.height/2);
  
  context.font = "20px Arial";
  context.fillText("Press Space to Restart", board.width/2, board.height/2 + 40);
}

function resetGame() {
  snakeX = blockSize * 5;
  snakeY = blockSize * 5;
  velocityX = 0;
  velocityY = 0;
  snakeBody = [];
  score = 0;
  document.getElementById("score").textContent = score;
  gameOver = false;
  gameStarted = false;  // Add this line
  placefood();
}

function changeDirection(e){
  if (!gameStarted && 
      (e.code == "ArrowUp" || 
       e.code == "ArrowDown" || 
       e.code == "ArrowLeft" || 
       e.code == "ArrowRight")) {
    gameStarted = true;
  }

  if (e.code == "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  }
  else if (e.code == "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  }
  else if (e.code == "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  }
  else if (e.code == "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
}

function placefood() {
  while(true) {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
    
    // Check if food spawned on snake body
    let foodOnSnake = false;
    for (let segment of snakeBody) {
      if (segment[0] === foodX && segment[1] === foodY) {
        foodOnSnake = true;
        break;
      }
    }
    
    // Check if food spawned on snake head
    if (foodX === snakeX && foodY === snakeY) {
      foodOnSnake = true;
    }
    
    // If food is not on snake, break the loop
    if (!foodOnSnake) {
      break;
    }
  }
}
