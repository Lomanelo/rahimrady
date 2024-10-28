const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;  // Increased width
canvas.height = 600; // Increased height

let bird = {
    x: 50,
    y: 200,
    width: 34,
    height: 24,
    gravity: 0.3,  // Reduced gravity
    lift: -5,      // Reduced lift
    velocity: 0
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 150;  // Increased gap
let pipeFrequency = 90;
let frames = 0;
let score = 0;
let highScore = localStorage.getItem('flappyBirdHighScore') || 0;
let gameOver = false;
let gameStarted = false;

const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, "#1a1a2e");
backgroundGradient.addColorStop(1, "#0f3460");

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        if (!gameStarted) {
            gameStarted = true;
            gameLoop();
        } else if (gameOver) {
            resetGame();
        } else {
            bird.velocity = bird.lift;
        }
    }
});

function resetGame() {
    bird = {
        x: 50,
        y: 200,
        width: 34,
        height: 24,
        gravity: 0.3,
        lift: -5,
        velocity: 0
    };
    pipes = [];
    frames = 0;
    score = 0;
    gameOver = false;
    gameStarted = false;
    draw();
}

function generatePipes() {
    let pipeHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: pipeHeight + pipeGap,
        width: pipeWidth,
        scored: false
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.height || bird.y < 0) {
        gameOver = true;
    }
}

function updatePipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
        }

        if (!pipes[i].scored && pipes[i].x + pipes[i].width < bird.x) {
            score++;
            pipes[i].scored = true;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('flappyBirdHighScore', highScore);
            }
        }
    }

    if (frames % pipeFrequency === 0) {
        generatePipes();
    }
}

function detectCollisions() {
    for (let pipe of pipes) {
        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)) {
            gameOver = true;
        }
    }
}

function draw() {
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#e94560";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = "#4ecca3";
    for (let pipe of pipes) {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
    }

    ctx.fillStyle = "#e94560";
    ctx.font = "24px 'Press Start 2P'";
    ctx.fillText(`Score: ${score}`, 10, 40);
    ctx.fillText(`High Score: ${highScore}`, 10, 80);

    if (!gameStarted) {
        ctx.fillStyle = "rgba(233, 69, 96, 0.8)";
        ctx.fillRect(0, canvas.height / 2 - 60, canvas.width, 120);
        ctx.fillStyle = "#fff";
        ctx.font = "24px 'Press Start 2P'";
        ctx.fillText("Press Space", canvas.width / 2 - 100, canvas.height / 2 - 10);
        ctx.fillText("to Start", canvas.width / 2 - 70, canvas.height / 2 + 30);
    } else if (gameOver) {
        ctx.fillStyle = "rgba(233, 69, 96, 0.8)";
        ctx.fillRect(0, canvas.height / 2 - 60, canvas.width, 120);
        ctx.fillStyle = "#fff";
        ctx.font = "24px 'Press Start 2P'";
        ctx.fillText("Game Over", canvas.width / 2 - 90, canvas.height / 2 - 10);
        ctx.font = "16px 'Press Start 2P'";
        ctx.fillText("Press Space to Restart", canvas.width / 2 - 130, canvas.height / 2 + 30);
    } else {
        updateBird();
        updatePipes();
        detectCollisions();
        frames++;
    }

    requestAnimationFrame(gameStarted ? draw : null);
}

function gameLoop() {
    if (gameStarted && !gameOver) {
        draw();
    }
}

draw();
