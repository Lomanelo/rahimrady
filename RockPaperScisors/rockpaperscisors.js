let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

updateScoreElement();

function pickComputerMove() {
  const randomNumber = Math.random();
  if (randomNumber < 1/3) return 'rock';
  if (randomNumber < 2/3) return 'paper';
  return 'scissors';
}

function updateScoreElement() {
  document.querySelector('.js-score').innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

let isAutoPlaying = false;
let intervalId;

function autoPlay() {
  if (!isAutoPlaying) {
    intervalId = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1000);
    isAutoPlaying = true;
  } else {
    clearInterval(intervalId);
    isAutoPlaying = false;
  }
}

document.querySelector('.js-rock-button').addEventListener('click', () => playGame('rock'));
document.querySelector('.js-paper-button').addEventListener('click', () => playGame('paper'));
document.querySelector('.js-scissors-button').addEventListener('click', () => playGame('scissors'));

document.body.addEventListener('keydown', (event) => {
  if (event.key === 'r') playGame('rock');
  else if (event.key === 'p') playGame('paper');
  else if (event.key === 's') playGame('scissors');
});

function playGame(playerMove) {
  const computerMove = pickComputerMove();
  let result = '';

  if (playerMove === computerMove) {
    result = 'Tie.';
  } else if (
    (playerMove === 'rock' && computerMove === 'scissors') ||
    (playerMove === 'paper' && computerMove === 'rock') ||
    (playerMove === 'scissors' && computerMove === 'paper')
  ) {
    result = 'You Win';
  } else {
    result = 'You Lose';
  }

  if (result === 'You Win') score.wins++;
  else if (result === 'You Lose') score.losses++;
  else if (result === 'Tie.') score.ties++;

  localStorage.setItem('score', JSON.stringify(score));
  updateScoreElement();

  document.querySelector('.js-result').innerHTML = result;
  document.querySelector('.js-moves').innerHTML = `
    You <img src="images/${playerMove}.png" class="move-icon" alt="${playerMove}">
    <img src="images/${computerMove}.png" class="move-icon" alt="${computerMove}"> Computer
  `;
}

function resetScore() {
  score = { wins: 0, losses: 0, ties: 0 };
  localStorage.removeItem('score');
  updateScoreElement();
}
