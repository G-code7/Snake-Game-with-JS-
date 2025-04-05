const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;  
let snake = [{ x: 9 * box, y: 10 * box }]; 
let direction = 'RIGHT';
let nextDirection = 'RIGHT'; // Nueva variable para manejar el siguiente movimiento
let food = {
  x: Math.floor(Math.random() * 19 + 1) * box,
  y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
document.getElementById('highScore').textContent = highScore;

// Eliminar los event listeners duplicados y usar solo uno
document.addEventListener('keydown', setDirection);

function setDirection(event) {
    // Solo cambiar la dirección si el juego está activo
    if (!game) return;
    
    // Usar nextDirection para hacer los cambios más fluidos
    if (event.keyCode === 37 && direction !== 'RIGHT') nextDirection = 'LEFT';
    if (event.keyCode === 38 && direction !== 'DOWN') nextDirection = 'UP';
    if (event.keyCode === 39 && direction !== 'LEFT') nextDirection = 'RIGHT';
    if (event.keyCode === 40 && direction !== 'UP') nextDirection = 'DOWN';
}

function draw() {
    // Actualizar la dirección al inicio del frame para mayor fluidez
    direction = nextDirection;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la serpiente con bordes para mejor visualización
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? '#4CAF50' : '#8BC34A';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#45a049';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Dibujar la comida con diseño mejorado
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

    // Detección de colisiones mejorada
    if (checkCollision(newHead)) {
        gameOver();
        return;
    }

    snake.unshift(newHead);
}

// Función de colisión mejorada
function checkCollision(head) {
    // Colisión con paredes
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    
    // Colisión consigo misma (empezar desde 1 para no contar la cabeza)
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
    
    // Mostrar mensaje de game over más elegante
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