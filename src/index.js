let snake;
let food;
let game;
let resolution = 10;
let trueWidth;
let trueHeight;

////////////////////////////////////////////////

function setup() {
  createCanvas(200, 200);
  frameRate(10);

  w = width / resolution;
  h = height / resolution;

  game = new Game(w, h, resolution);
  game.start();
}

function draw() {
  background(0);
  scale(resolution);

  game.snake.update();
  game.food.create();

  if (game.snakeOutOfBoard()) {
    game.end();
  }

  if (game.snakeGotFood()) {
    game.createNewFood();
    game.snake.grow();
  } else if (game.snake.selfBite()) {
    game.end();
  }
}

////////////////////////////////////////////////

function keyPressed() {
  game.snake.move(keyCode);
}
