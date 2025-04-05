const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;  
let snake = [{ x: 9 * box, y: 10 * box }]; 
let direction = 'RIGHT'; // dirección inicial
let food = {
  x: Math.floor(Math.random() * 19 + 1) * box,
  y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
document.getElementById('highScore').textContent = highScore;

document.addEventListener('keydown', setDirection);

function setDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la serpiente
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'lightgreen';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Dibujar la comida
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Guardar la posición de la cabeza de la serpiente
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Actualizar la posición de la cabeza de la serpiente según la dirección
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Si la serpiente come la comida
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').textContent = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop(); // Eliminar la última parte del cuerpo de la serpiente si no ha comido
    }

    // Nueva cabeza de la serpiente
    const newHead = { x: snakeX, y: snakeY };

    // Comprobar colisión con el cuerpo o los bordes
    if (collision(newHead, snake) || snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
        clearInterval(game);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        alert('Game Over');
        document.location.reload();
    }

    snake.unshift(newHead); // Añadir la nueva cabeza al inicio del array de la serpiente
}

// Comprobar colisiones
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

let lastDirection = direction; // Almacenar la última dirección válida

document.addEventListener('keydown', setDirection);

function setDirection(event) {
    if (event.keyCode === 37 && lastDirection !== 'RIGHT') direction = 'LEFT';
    if (event.keyCode === 38 && lastDirection !== 'DOWN') direction = 'UP';
    if (event.keyCode === 39 && lastDirection !== 'LEFT') direction = 'RIGHT';
    if (event.keyCode === 40 && lastDirection !== 'UP') direction = 'DOWN';
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la serpiente
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'lightgreen';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Dibujar la comida
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Guardar la posición de la cabeza de la serpiente
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Actualizar la posición de la cabeza de la serpiente según la dirección
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Si la serpiente come la comida
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').textContent = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop(); // Eliminar la última parte del cuerpo de la serpiente si no ha comido
    }

    // Nueva cabeza de la serpiente
    const newHead = { x: snakeX, y: snakeY };

    // Comprobar colisión con el cuerpo o los bordes
    if (collision(newHead, snake) || snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
        clearInterval(game);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        alert('Game Over');
        document.location.reload();
    }

    snake.unshift(newHead); // Añadir la nueva cabeza al inicio del array de la serpiente
    lastDirection = direction; // Actualizar la última dirección válida
}

// Comprobar colisiones
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

const game = setInterval(draw, 100); // Ejecutar la función draw cada 100 ms

