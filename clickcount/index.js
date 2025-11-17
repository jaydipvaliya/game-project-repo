const currentScoreDisplay = document.querySelector('#currentScore');
const highScoreDisplay = document.querySelector('#highScore');
const timerDisplay = document.querySelector('#timer');
const clickButton = document.querySelector('#clickButton');
const startButton = document.querySelector('#startButton');
const resetButton = document.querySelector('#resetButton');
const statusMessage = document.querySelector('#statusMessage');
const pauseButton = document.querySelector('#pauseButton');
const body = document.querySelector('body');
const video = document.querySelector('video');

let currentScore = 0;
let highScore = 0;
let timeRemaining = 10;
let gameTimerId = null;
let isGameActive = false;
let isPaused = false;

let size = 1;      // For button growth (Feature 3)
const maxSize = 2; // Max 2× size

function initializeGame() {
    loadHighScore();
    updateDisplay();
}

function loadHighScore() {
    const savedHighScore = localStorage.getItem('clickGameHighScore');
    highScore = savedHighScore ? parseInt(savedHighScore) : 0;
}

function saveHighScore() {
    localStorage.setItem('clickGameHighScore', currentScore);
    highScore = currentScore;
}

// FEATURE 1: Score turns red if > 20
function updateDisplay() {
    currentScoreDisplay.innerText = currentScore;
    highScoreDisplay.innerText = highScore;
    timerDisplay.innerText = timeRemaining;

    currentScoreDisplay.style.color = currentScore > 20 ? 'red' : 'white';
}

function updateStatus(message) {
    statusMessage.innerText = message;
}

function startGame() {
    currentScore = 0;
    timeRemaining = 10;
    isGameActive = true;
    isPaused = false;
    size = 1;
    clickButton.style.transform = "scale(1)";

    clickButton.disabled = false;
    startButton.disabled = true;

    updateDisplay();
    updateStatus('Game in progress... Click fast!');

    // FEATURE 2: Flash "Click Me!" for 1 sec
    clickButton.innerHTML = "Click Me!";
    setTimeout(() => {
        clickButton.innerHTML = "";
    }, 1000);

    gameTimerId = setInterval(() => {
        if (!isPaused) {
            timeRemaining--;
            updateDisplay();
            if (timeRemaining <= 0) endGame();
        }
    }, 1000);
}

function pauseGame() {
    if (!isGameActive) return;

    if (!isPaused) {
        isPaused = true;
        clickButton.disabled = true;
        pauseButton.innerText = 'Resume';
        updateStatus('Game paused');
    } else {
        isPaused = false;
        clickButton.disabled = false;
        pauseButton.innerText = 'Pause';
        updateStatus('Game resumed');
    }
}

function endGame() {
    clearInterval(gameTimerId);
    gameTimerId = null;
    isGameActive = false;

    clickButton.disabled = true;
    startButton.disabled = false;

    // FEATURE 5: Start button → "Play Again"
    startButton.textContent = 'Play Again';

    const cps = (currentScore / 10).toFixed(1); // FEATURE 4

    if (currentScore > highScore) {
        saveHighScore();

        updateStatus(`New High Score: ${currentScore} | CPS: ${cps}`);

        // VIDEO
        video.style.display = 'block';
        video.play();
        setTimeout(() => (video.style.display = 'none'), 5000);

        // FEATURE 6: Background flash
        body.style.background = 'gold';
        setTimeout(() => {
            body.style.background = '';
        }, 1000);

    } else if (currentScore === highScore) {
        updateStatus(`Score Equal: ${currentScore} | CPS: ${cps}`);
    } else {
        updateStatus(`Game Over! Score: ${currentScore} | CPS: ${cps}`);
    }

    updateDisplay();
}

// FEATURE 3: Button grows with each click
function handleClick() {
    if (isGameActive && !isPaused) {
        currentScore++;
        updateDisplay();

        if (size < maxSize) {
            size += 0.1;
            clickButton.style.transform = `scale(${size})`;
        }
    }
}

function resetHighScore() {
    localStorage.removeItem('clickGameHighScore');
    highScore = 0;
    currentScore = 0;
    updateDisplay();
    updateStatus('High score has been reset');
}

clickButton.addEventListener('click', handleClick);
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetHighScore);
pauseButton.addEventListener('click', pauseGame);

initializeGame();
