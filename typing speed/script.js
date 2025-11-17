// DOM Elements
const textDisplay = document.querySelector('#textDisplay');
const typingArea = document.querySelector('#typingArea');
const timerDisplay = document.querySelector('#timer');
const wpmDisplay = document.querySelector('#wpm');
const accuracyDisplay = document.querySelector('#accuracy');
const bestWPMDisplay = document.querySelector('#bestWPM');
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');

// Test texts
const testTexts = [
  "The quick brown fox jumps over the lazy dog. Practice makes perfect when learning to type faster.He wondered if he should disclose the truth to his friends. It would be a risky move. Yes, the truth would make things a lot easier if they all stayed on the same page, but the truth might fracture the group leaving everything in even more of a mess than it was not telling the truth. It was time to decide which way to go.",

  "Technology has revolutionized the way we communicate and work in the modern digital era.She sat in the darkened room waiting. It was now a standoff. He had the power to put her in the room, but not the power to make her repent. It wasn't fair and no matter how long she had to endure the darkness, she wouldn't change her attitude. At three years old, Sandy's stubborn personality had already bloomed into full view.",

  "Typing speed is an essential skill for anyone working with computers in today's workplace.She tried not to judge him. His ratty clothes and unkempt hair made him look homeless. Was he really the next Einstein as she had been told? On the off chance it was true, she continued to try not to judge him."
];

// Game state
let currentText = '';
let timeLeft = 60;
let timerInterval = null;
let countdownInterval = null;
let startTime = null;
let isTestActive = false;
let bestWPM = 0;

function webLoad() {
  onLoad();
  displayContent();
}

function onLoad() {
  var temp = sessionStorage.getItem('previousWpm');
  if (temp != null) {
    bestWPM = parseInt(temp);
  } else {
    bestWPM = 0;
  }
}

function displayContent() {
  timerDisplay.textContent = timeLeft;
  bestWPMDisplay.textContent = bestWPM;
}

webLoad();

function endGame() {
  clearInterval(timerInterval);
  startBtn.disabled = false;
  typingArea.disabled = true;

  // Calculate final WPM
  const typedWords = typingArea.value.trim().split(/\s+/).filter(w => w.length > 0);
  const elapsedTime = (Date.now() - startTime) / 1000 / 60;
  const finalWPM = elapsedTime > 0 ? Math.floor(typedWords.length / elapsedTime) : 0;

  // Update Best WPM
  if (finalWPM > bestWPM) {
    bestWPM = finalWPM;
    sessionStorage.setItem('previousWpm', bestWPM);
  }

  bestWPMDisplay.textContent = bestWPM;

  timeLeft = 60;
  displayContent();

  textDisplay.innerHTML = `<p style="color:yellow;">Time’s up! Final WPM: <b>${finalWPM}</b></p>`;
}

function resetGame() {
  clearInterval(timerInterval);
  clearInterval(countdownInterval);
  typingArea.disabled = true;
  typingArea.value = "";
  textDisplay.textContent = "";
  wpmDisplay.textContent = 0;
  accuracyDisplay.textContent = 0;
  startTime = null;
  timeLeft = 60;
  startBtn.disabled = false;
  displayContent();
}

function startGame() {
  startBtn.disabled = true;
  typingArea.disabled = true;
  textDisplay.textContent = "";

  // Random text selection
  currentText = testTexts[Math.floor(Math.random() * testTexts.length)];

  // Countdown start
  let countdown = 3;
  textDisplay.innerHTML = `<p style="color:orange; font-size:22px;">Starting in ${countdown}...</p>`;

  countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      textDisplay.innerHTML = `<p style="color:orange; font-size:22px;">Starting in ${countdown}...</p>`;
    } else {
      clearInterval(countdownInterval);
      beginTypingTest();
    }
  }, 1000);
}

function beginTypingTest() {
  timeLeft = 60;
  displayContent();
  textDisplay.textContent = currentText;
  typingArea.disabled = false;
  typingArea.value = "";
  typingArea.focus();
  typingArea.setAttribute('placeholder', 'Start typing...');

  startTime = null;

  timerInterval = setInterval(function () {
    timeLeft--;
    if (timeLeft <= 0) {
      endGame();
    }
    displayContent();
  }, 1000);
}

function updateStatus() {
  var typed = typingArea.value;

  const words = typed.trim().split(/\s+/).filter(w => w.length > 0);
  const elapsedTime = (Date.now() - startTime) / 1000 / 60;
  const wpm = elapsedTime > 0 ? Math.floor(words.length / elapsedTime) : 0;
  wpmDisplay.textContent = wpm;

  var currentScore = 0;
  for (var i = 0; i < currentText.length; i++) {
    if (currentText[i] === typed[i]) {
      currentScore++;
    }
  }
  const accuracy = (typed.length > 0) ? Math.floor(currentScore / typed.length * 100) : 0;
  accuracyDisplay.textContent = accuracy;
}

function Highlights() {
  var typed = typingArea.value;
  var highlightText = '';

  for (let i = 0; i < currentText.length; i++) {
    if (i < typed.length) {
      if (currentText[i] === typed[i]) {
        highlightText += `<span class="correct">${currentText[i]}</span>`;
      } else {
        highlightText += `<span class="incorrect">${currentText[i]}</span>`;
      }
    } else {
      highlightText += currentText[i];
    }
  }
  textDisplay.innerHTML = highlightText;
}

function typeControl() {
  if (startTime == null) {
    startTime = Date.now();
  }
  updateStatus();
  Highlights();
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
typingArea.addEventListener('input', typeControl);
