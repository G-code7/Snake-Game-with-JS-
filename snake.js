const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;  
let snake = [{ x: 9 * box, y: 10 * box }]; 
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let food = {
  x: Math.floor(Math.random() * 19 + 1) * box,
  y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
document.getElementById('highScore').textContent = highScore;
document.addEventListener('keydown', setDirection);

function setDirection(event) {
    if (!game) return;
    
    if (event.keyCode === 37 && direction !== 'RIGHT') nextDirection = 'LEFT';
    if (event.keyCode === 38 && direction !== 'DOWN') nextDirection = 'UP';
    if (event.keyCode === 39 && direction !== 'LEFT') nextDirection = 'RIGHT';
    if (event.keyCode === 40 && direction !== 'UP') nextDirection = 'DOWN';
}

function draw() {
    direction = nextDirection;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? '#4CAF50' : '#8BC34A';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#45a049';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Comida
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'darkred';
    ctx.stroke();

    // Mover la serpiente
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Comer comida
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').textContent = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    // Crear nueva cabeza
    const newHead = { x: snakeX, y: snakeY };
    if (checkCollision(newHead)) {
        gameOver();
        return;
    }

    snake.unshift(newHead);
}

function checkCollision(head) {
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function gameOver() {
    clearInterval(game);
    game = null;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
    
    // Mensaje de game over
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
    
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 40);
    ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 80);
    
    // Escuchar para reiniciar
    document.addEventListener('keydown', function restart(e) {
        if (e.keyCode === 82) { // Tecla R
            document.location.reload();
            document.removeEventListener('keydown', restart);
        }
    });
}

let game = setInterval(draw, 100);
