const scoreDisplay = document.querySelector('#score');
const hitsDisplay = document.querySelector('#hitsDisplay'); // Feature 5
const timeLeftDisplay = document.querySelector('#timeLeft');
const maxScoreDisplay = document.querySelector('#maxScore');
const lastScoreDisplay = document.querySelector('#lastScoreDisplay'); // Feature 7
const fastestHitDisplay = document.querySelector('#fastestHitDisplay'); // Feature 8
const startBtn = document.querySelector('#startBtn');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const statusMessage = document.querySelector('#statusMessage');
const countdownText = document.querySelector('#countdownText');
const hitSound = document.querySelector('#hitSound');
const popSound = document.querySelector('#popSound');

let score = 0;
let hits = 0; // Feature 5
let time = 30;
let bestScore = 0;
let playGame = false;
let gameTimer = null;
let lastHole = null;
let moleUpTime = 0; // Feature 8: To track when mole appeared

function onLoad(){
    // Load High Score
    let hs = localStorage.getItem("HighScore_Mole");
    if(hs) bestScore = hs;
    
    // Feature 7: Load Last Game Score from Session
    let ls = sessionStorage.getItem("lastScore");
    if(ls) lastScoreDisplay.textContent = ls;

    // Feature 8: Load Fastest Hit from Session
    let fh = sessionStorage.getItem("fastestHit");
    if(fh) fastestHitDisplay.textContent = fh + "ms";

    display();
}

function display(){
    scoreDisplay.textContent = score;
    hitsDisplay.textContent = hits; // Update Hits
    timeLeftDisplay.textContent = time;
    maxScoreDisplay.textContent = bestScore;

    // Feature 1: Gold Score when > 50
    if (score > 50) {
        scoreDisplay.classList.add('gold-text');
    } else {
        scoreDisplay.classList.remove('gold-text');
    }
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
    
    // Feature 8: Record time when mole goes up
    moleUpTime = Date.now();

    // Feature 4: Mole Speed Increases (Time Left < 10)
    // Normal: 400-1000ms. Fast: 200-600ms
    let minTime = (time < 10) ? 200 : 400;
    let maxTime = (time < 10) ? 600 : 1000;
    
    let timeRandom = Math.round(Math.random() * (maxTime - minTime) + minTime);

    setTimeout(()=>{
        mole.classList.remove("up");
        if(playGame) pop();
    }, timeRandom);
}

function startGame(){
    startBtn.disabled = true;
    
    // Feature 7 Bonus: Clear last score visual when starting
    lastScoreDisplay.textContent = sessionStorage.getItem("lastScore") || "-"; 

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
    hits = 0;
    time = 30;
    playGame = true;
    scoreDisplay.classList.remove('gold-text'); // Reset gold
    statusMessage.style.display = "none";
    maxScoreDisplay.classList.remove('glow-anim'); // Reset glow

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
    
    // Feature 3: Start Button Says "Play Again"
    startBtn.innerText = "Play Again";

    // Feature 7: Save Last Game Score
    sessionStorage.setItem('lastScore', score);
    lastScoreDisplay.textContent = score;

    let msg = `Game Over! Score: ${score}`;
    
    if(parseInt(score) > parseInt(bestScore)){
        bestScore = score;
        localStorage.setItem("HighScore_Mole", score);
        msg = `🎉 New High Score: ${score} 🎉`;

        // Feature 6: Glow effect for Best Score
        maxScoreDisplay.classList.add('glow-anim');
        // Remove glow after 1.5 seconds so it doesn't stay forever
        setTimeout(() => maxScoreDisplay.classList.remove('glow-anim'), 1500);
    }

    statusMessage.textContent = msg;
    statusMessage.style.display = "block";
}

function bonk(e){
    if(!playGame) return;
    if(!e.target.classList.contains('mole')) return;

    if(e.target.classList.contains('up')){
        // Feature 8: Calculate reaction time
        let reactionTime = Date.now() - moleUpTime;
        let currentFastest = sessionStorage.getItem('fastestHit');
        
        if (!currentFastest || reactionTime < currentFastest) {
            sessionStorage.setItem('fastestHit', reactionTime);
            fastestHitDisplay.textContent = reactionTime + "ms";
        }

        score++;
        hits++; // Feature 5: Increment hits
        hitSound.play();
        e.target.classList.add("hit");
        e.target.classList.remove("up");

        // Feature 2: Show "Whack!" briefly
        statusMessage.textContent = "Whack!";
        statusMessage.style.display = "block";
        setTimeout(() => {
            if(playGame) statusMessage.style.display = "none"; 
        }, 500);

        setTimeout(()=> e.target.classList.remove("hit"), 150);
        display();
    }
}

moles.forEach(m => m.addEventListener("click", bonk));
startBtn.addEventListener("click", startGame);

onLoad();