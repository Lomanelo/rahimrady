const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
const livesContainer = document.getElementById('lives');
const gameWidth = 800;
const gameHeight = 400;

gameContainer.style.width = `${gameWidth}px`;
gameContainer.style.height = `${gameHeight}px`;

let playerX = 50;
let playerY = gameHeight - 50;
let playerVelocityY = 0;
let playerSpeed = 5;
let isJumping = false;
let dots = [];
let rectangles = [];
let score = 0;
let lives = 3;
let isGameOver = false;
let difficulty = 1;
let lastDifficultyIncrease = 0;
let isInvincible = false;

console.log('Game initialized');

// Initialize player position
player.style.left = `${playerX}px`;
player.style.bottom = '0px';

// Create lives display
function createLivesDisplay() {
    livesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        if (i < lives) {
            heart.classList.add('active');
        }
        livesContainer.appendChild(heart);
    }
    console.log('Lives display created');
}

createLivesDisplay();

// Move player based on keypress
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') rightPressed = true;
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowUp' && !isJumping) jump();
    console.log('Key pressed:', e.key);
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') rightPressed = false;
    if (e.key === 'ArrowLeft') leftPressed = false;
});

function jump() {
    if (!isJumping) {
        isJumping = true;
        playerVelocityY = 15;
        console.log('Player jumped');
    }
}

function movePlayer() {
    if (rightPressed) playerX = Math.min(gameWidth - 40, playerX + playerSpeed);
    if (leftPressed) playerX = Math.max(0, playerX - playerSpeed);

    playerVelocityY -= 0.8; // Gravity
    playerY += playerVelocityY;

    if (playerY <= gameHeight - 50) {
        playerY = gameHeight - 50;
        isJumping = false;
        playerVelocityY = 0;
    }

    player.style.left = `${playerX}px`;
    player.style.bottom = `${playerY - (gameHeight - 50)}px`;
}

class Dot {
    constructor() {
        this.width = 10;
        this.height = 10;
        this.x = Math.random() * (gameWidth - this.width);
        this.y = -this.height;
        this.speed = 2 + Math.random() * 3 * difficulty;
        this.element = document.createElement('div');
        this.element.className = 'dot';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        gameContainer.appendChild(this.element);
        console.log('Dot created at:', this.x, this.y);
    }

    move() {
        this.y += this.speed;
        this.element.style.top = `${this.y}px`;

        if (this.y > gameHeight) {
            this.element.remove();
            return false;
        }
        return true;
    }

    checkCollision() {
        return (
            this.x < playerX + 40 &&
            this.x + this.width > playerX &&
            this.y + this.height > playerY &&
            this.y < playerY + 50
        );
    }
}

class Rectangle {
    constructor() {
        this.width = 30;
        this.height = 60;
        this.x = gameWidth;
        this.y = gameHeight - this.height;
        this.speed = 3 + Math.random() * 2 * difficulty;
        this.element = document.createElement('div');
        this.element.className = 'rectangle';
        this.element.style.left = `${this.x}px`;
        this.element.style.bottom = '0px';
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        gameContainer.appendChild(this.element);
        console.log('Rectangle created at:', this.x, this.y);
    }

    move() {
        this.x -= this.speed;
        this.element.style.left = `${this.x}px`;

        if (this.x + this.width < 0) {
            this.element.remove();
            return false;
        }
        return true;
    }

    checkCollision() {
        const playerWidth = 40;
        const playerHeight = 50;
        const playerBottom = gameHeight - playerY;

        // Adjust these values to fine-tune the hitbox
        const hitboxMargin = 5;

        return (
            this.x < playerX + playerWidth - hitboxMargin &&
            this.x + this.width > playerX + hitboxMargin &&
            playerBottom < this.height &&
            playerBottom + playerHeight > hitboxMargin
        );
    }
}

function spawnDot() {
    if (Math.random() < 0.02 * difficulty) {
        dots.push(new Dot());
    }
}

function spawnRectangle() {
    if (Math.random() < 0.005 * difficulty) {
        rectangles.push(new Rectangle());
    }
}

function updateGame() {
    if (isGameOver) return;

    movePlayer();
    spawnDot();
    spawnRectangle();

    dots = dots.filter(dot => {
        const active = dot.move();
        if (dot.checkCollision() && !isInvincible) {
            dot.element.remove();
            loseLife();
            return false;
        }
        return active;
    });

    rectangles = rectangles.filter(rectangle => {
        const active = rectangle.move();
        if (rectangle.checkCollision() && !isInvincible) {
            loseLife();
            console.log('Collision with rectangle detected');
        }
        return active;
    });

    score++;
    scoreElement.textContent = `Score: ${score}`;

    // Increase difficulty every 1000 points
    if (score - lastDifficultyIncrease > 1000) {
        difficulty += 0.1;
        lastDifficultyIncrease = score;
        console.log(`Difficulty increased to ${difficulty}`);
    }

    requestAnimationFrame(updateGame);
}

function loseLife() {
    if (isInvincible) return;
    
    lives--;
    createLivesDisplay();
    console.log('Life lost. Remaining lives:', lives);
    if (lives <= 0) {
        endGame();
    } else {
        // Provide temporary invincibility
        isInvincible = true;
        player.style.opacity = '0.5';
        setTimeout(() => {
            isInvincible = false;
            player.style.opacity = '1';
        }, 2000);
    }
}

function endGame() {
    isGameOver = true;
    console.log('Game over');
    const gameOverPopup = document.createElement('div');
    gameOverPopup.className = 'game-over-popup';
    gameOverPopup.innerHTML = `
        <h2>Game Over!</h2>
        <p>Your score: ${score}</p>
        <button id="restart-button">Restart</button>
    `;
    document.body.appendChild(gameOverPopup);

    document.getElementById('restart-button').addEventListener('click', () => {
        gameOverPopup.remove();
        restartGame();
    });
}

function restartGame() {
    console.log('Game restarted');
    isGameOver = false;
    score = 0;
    lives = 3;
    difficulty = 1;
    lastDifficultyIncrease = 0;
    playerX = 50;
    playerY = gameHeight - 50;
    playerVelocityY = 0;
    isJumping = false;
    isInvincible = false;
    dots.forEach(dot => dot.element.remove());
    rectangles.forEach(rectangle => rectangle.element.remove());
    dots = [];
    rectangles = [];
    scoreElement.textContent = `Score: ${score}`;
    createLivesDisplay();
    player.style.left = `${playerX}px`;
    player.style.bottom = '0px';
    player.style.opacity = '1';
    updateGame();
}

// Start the game
console.log('Starting game');
updateGame();
