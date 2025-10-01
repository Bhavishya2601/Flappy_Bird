const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const MAX_FALL_SPEED = 8;
const PIPE_SPEED = 3;
const PIPE_GAP = 180;
const PIPE_WIDTH = 80;

let gameState = 'waiting'; 
let score = 0;
let highScore = localStorage.getItem('flappyBirdHighScore') || 0;
let pipes = [];
let frameCount = 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
    x: 150,
    y: 200, 
    width: 60,
    height: 45,
    velocity: 0,
    rotation: 0
};

const messageTitle = document.getElementById('messageTitle');
const messageText = document.getElementById('messageText');
const gameMessage = document.getElementById('gameMessage');
const highScoreElement = document.getElementById('highScore');

const backgroundImg = new Image();
const birdImg = new Image();
const topPipeImg = new Image();
const bottomPipeImg = new Image();

backgroundImg.src = '../img/bg.jpg';
birdImg.src = '../img/flappybird.png';
topPipeImg.src = '../img/toppipe.png';
bottomPipeImg.src = '../img/bottompipe.png';

// Initialize game
function init() {

    resizeCanvas();
    highScoreElement.textContent = highScore;
    resetGame();
    
    document.addEventListener('keydown', handleInput);
    
    window.addEventListener('resize', resizeCanvas);
    gameLoop();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    if (gameState === 'waiting' || gameState === 'gameOver') {
        bird.y = canvas.height / 2;
    }
}

function resetGame() {
    bird.x = 150;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    bird.rotation = 0;    
    pipes = [];
    score = 0;
    frameCount = 0;
    
    gameState = 'waiting';
    showMessage('Get Ready!', 'Press SPACE to start');
}

function startGame() {
    gameState = 'playing';
    hideMessage();
    jump();
}

function handleInput(e) {
    if (e.type === 'keydown' && e.code === 'Space') {
        e.preventDefault();
        
        if (gameState === 'waiting') {
            startGame();
        } else if (gameState === 'playing') {
            jump();
        } else if (gameState === 'gameOver') {
            resetGame();
        }
    }
}

function jump() {
    if (gameState === 'playing') {
        bird.velocity = JUMP_FORCE;
        bird.rotation = -0.4;
    }
}

function showMessage(title, text) {
    messageTitle.textContent = title;
    messageText.textContent = text;
    gameMessage.style.display = 'block';
}

function hideMessage() {
    gameMessage.style.display = 'none';
}

function updateBird() {
    if (gameState === 'playing') {
        bird.velocity += GRAVITY;
        
        if (bird.velocity > MAX_FALL_SPEED) {
            bird.velocity = MAX_FALL_SPEED;
        }
        
        bird.y += bird.velocity;
        
        if (bird.velocity < 0) {
            bird.rotation = Math.max(bird.velocity * 0.06, -0.5);
        } else {
            bird.rotation = Math.min(bird.velocity * 0.04, 0.8);
        }
        
        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            gameOver();
        }
    } else if (gameState === 'gameOver') {
        if (bird.y + bird.height < canvas.height) {
            bird.velocity += GRAVITY * 0.8; 
            bird.y += bird.velocity;
            bird.rotation = 1.2;
        } else {
            bird.y = canvas.height - bird.height;
            bird.velocity = 0;
        }
    }
}

function updatePipes() {
    if (gameState !== 'playing') return;
    
    if (frameCount % 130 === 0) {
        addPipe();
    }
    
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= PIPE_SPEED;
        
        if (!pipe.scored && pipe.x + PIPE_WIDTH < bird.x) {
            pipe.scored = true;
            score++;
        }
        
        if (pipe.x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
        }
        
        if (checkCollision(bird, pipe)) {
            gameOver();
        }
    }
}

function addPipe() {
    const minGapY = 80;
    const maxGapY = canvas.height - PIPE_GAP - 80;
    const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
    
    pipes.push({
        x: canvas.width,
        topHeight: gapY,
        bottomY: gapY + PIPE_GAP,
        bottomHeight: canvas.height - (gapY + PIPE_GAP),
        scored: false
    });
}

function checkCollision(bird, pipe) {
    const birdLeft = bird.x;
    const birdRight = bird.x + bird.width;
    const birdTop = bird.y;
    const birdBottom = bird.y + bird.height;
    
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + PIPE_WIDTH;
    
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < pipe.topHeight) {
            return true;
        }
        if (birdBottom > pipe.bottomY) {
            return true;
        }
    }
    
    return false;
}

function gameOver() {
    gameState = 'gameOver';
    
    if (bird.y + bird.height < canvas.height) {
        bird.rotation = 1.2;
    } else {
        bird.velocity = 0;
        bird.y = canvas.height - bird.height;
    }
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyBirdHighScore', highScore);
        highScoreElement.textContent = highScore;
        
        showMessage('New High Score!', `Amazing! You scored ${score} points! Press SPACE to play again`);
    } else {
        showMessage('Game Over', `Score: ${score} - Press SPACE to play again`);
    }
    
    canvas.classList.add('shake');
    setTimeout(() => canvas.classList.remove('shake'), 500);
}

function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawBird() {
    ctx.save();
    
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate(bird.rotation);
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
    
    ctx.restore();
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(topPipeImg, pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        
        ctx.drawImage(bottomPipeImg, pipe.x, pipe.bottomY, PIPE_WIDTH, pipe.bottomHeight);
    });
}

function drawScore() {
    if (gameState === 'playing') {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.font = 'bold 48px FlappyBirdy, Arial';
        ctx.textAlign = 'center';
        
        const text = score.toString();
        const x = canvas.width / 2;
        const y = 80;
        
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    drawPipes();
    drawBird();
    drawScore();
    
    if (gameState === 'playing') {
        updateBird();
        updatePipes();
        frameCount++;
    }
    
    requestAnimationFrame(gameLoop);
}

window.addEventListener('load', () => {
    setTimeout(init, 100);
});

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });