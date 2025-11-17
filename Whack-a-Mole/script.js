const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#timeLeft');
const maxScoreDisplay = document.querySelector('#maxScore');
const startBtn = document.querySelector('#startBtn');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const statusMessage = document.querySelector('#statusMessage');
const countdownText = document.querySelector('#countdownText');
const hitSound = document.querySelector('#hitSound');
const popSound = document.querySelector('#popSound');

let score = 0;
let time = 30;
let bestScore = 0;
let playGame = false;
let gameTimer = null;
let lastHole = null;

function onLoad(){
    let hs = localStorage.getItem("HighScore_Mole");
    if(hs) bestScore = hs;
    display();
}

function display(){
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = time;
    maxScoreDisplay.textContent = bestScore;
}

function randomHole(){
    let hole;
    do {
        hole = holes[Math.floor(Math.random() * holes.length)];
    } while(hole === lastHole);

    lastHole = hole;
    return hole;
}

function pop(){
    if(!playGame) return;

    let hole = randomHole();
    let mole = hole.querySelector('.mole');

    popSound.play();
    mole.classList.add("up");

    let timeRandom = Math.random()*600 + 400; // 400-1000ms

    setTimeout(()=>{
        mole.classList.remove("up");
        if(playGame) pop();
    }, timeRandom);
}

function startGame(){
    startBtn.disabled = true;
    countdownText.textContent = "3";
    
    let c = 3;
    let countdown = setInterval(()=>{
        c--;
        countdownText.textContent = c;
        if(c === 0){
            clearInterval(countdown);
            countdownText.textContent = "";
            begin();
        }
    },1000);
}

function begin(){
    score = 0;
    time = 30;
    playGame = true;
    statusMessage.style.display = "none";
    display();
    pop();

    gameTimer = setInterval(()=>{
        time--;
        display();
        if(time <= 0){
            endGame();
        }
    },1000);
}

function endGame(){
    playGame = false;
    clearInterval(gameTimer);
    startBtn.disabled = false;

    let msg = `Game Over! Score: ${score}`;
    if(score > bestScore){
        bestScore = score;
        localStorage.setItem("HighScore_Mole", score);
        msg = `🎉 New High Score: ${score} 🎉`;
    }

    statusMessage.textContent = msg;
    statusMessage.style.display = "block";
}

function bonk(e){
    if(!playGame) return;
    if(!e.target.classList.contains('mole')) return;

    if(e.target.classList.contains('up')){
        score++;
        hitSound.play();
        e.target.classList.add("hit");
        e.target.classList.remove("up");

        setTimeout(()=> e.target.classList.remove("hit"),150);
        display();
    }
}

moles.forEach(m => m.addEventListener("click", bonk));
startBtn.addEventListener("click", startGame);

onLoad();
