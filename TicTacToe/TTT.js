let playerX = true;
let board = ["", "", "", "", "", "", "", "", ""]; // Array to store board state
let gameActive = true;

// Get all button elements
const buttons = document.querySelectorAll('.cell');
const playerTurnDisplay = document.querySelector('.player-turn');
const resetButton = document.querySelector('.reset-button');

// Create audio elements for sound effects
const winSound = new Audio('win-sound.mp3'); // Make sure to add this sound file to your project
const clickSound = new Audio('click-sound.mp3'); // Make sure to add this sound file to your project

// Function to update cell with symbol and board state
function updateCell(button, index) {
    if (board[index] !== "" || !gameActive) return;

    clickSound.play(); // Play click sound

    const symbol = playerX ? "X" : "O";
    button.textContent = symbol;
    board[index] = symbol;
    playerX = !playerX;

    updatePlayerTurn();
    checkWinner();
}

// Function to update player turn display
function updatePlayerTurn() {
    playerTurnDisplay.textContent = `Player ${playerX ? 'X' : 'O'}'s Turn`;
}

// Function to check for a winner
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            highlightWinningCells(combination);
            celebrateWin(board[a]);
            return;
        }
    }

    // Check if the board is full without a winner
    if (!board.includes("")) {
        gameActive = false;
        setTimeout(() => {
            alert("It's a draw!");
        }, 100);
    }
}

// Function to highlight winning cells
function highlightWinningCells(combination) {
    combination.forEach(index => {
        buttons[index].classList.add('winning-cell');
    });
}

// Function to celebrate win
function celebrateWin(winner) {
    winSound.play(); // Play win sound

    // Create fireworks effect
    for (let i = 0; i < 5; i++) {
        createFirework();
    }

    setTimeout(() => {
        alert(`Player ${winner} wins!`);
    }, 1000);
}

// Function to create a firework
function createFirework() {
    const firework = document.createElement('div');
    firework.classList.add('firework');
    document.body.appendChild(firework);

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight;
    const endX = startX + (Math.random() - 0.5) * 200;
    const endY = startY - Math.random() * window.innerHeight * 0.75;

    firework.style.left = `${startX}px`;
    firework.style.top = `${startY}px`;

    setTimeout(() => {
        firework.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
        firework.style.opacity = '0';
    }, 10);

    setTimeout(() => {
        document.body.removeChild(firework);
    }, 1000);
}

// Reset the board after a game ends
function resetBoard() {
    board.fill(""); // Clear the board array
    buttons.forEach(button => {
        button.textContent = ""; // Reset button contents
        button.classList.remove('winning-cell');
    });
    playerX = true; // Reset to player X's turn
    gameActive = true;
    updatePlayerTurn();
}

// Add event listeners to each button
buttons.forEach((button, index) => {
    button.addEventListener('click', () => updateCell(button, index));
});

resetButton.addEventListener('click', resetBoard);

updatePlayerTurn();
