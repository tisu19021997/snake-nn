let snake;
let food;
let resolution = 10;
let trueWidth;
let trueHeight;

////////////////////////////////////////////////

function setup() {
  createCanvas(400, 400);
  frameRate(10);

  trueWidth = width / resolution;
  trueHeight = height / resolution;

  startGame();
}

function draw() {
  background(0);
  scale(resolution);

  snake.update();
  food.create();

  if (outOfBoard()) {
    gameOver();
  }

  if (gotFood()) {
    food = new Food(resolution);
    snake.grow();
  } else if (snake.selfBite()) {
    gameOver();
  }
}

////////////////////////////////////////////////

function keyPressed() {
  snake.move(keyCode);
}

function gotFood() {
  return snake.body[0].x === food.x && snake.body[0].y === food.y;
}

function outOfBoard() {
  return snake.body[0].x >= trueWidth || snake.body[0].y >= trueHeight || snake.body[0].x < 0 || snake.body[0].y < 0;
}

function startGame() {
  snake = new Snake();
  food = new Food(resolution);
}

function gameOver() {
  alert(`Game Over!!! Your Score: ${snake.length}`);
  startGame();
}