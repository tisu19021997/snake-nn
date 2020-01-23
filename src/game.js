class Game {
  constructor(boardW, boardH, resolution) {
    this.resolution = resolution;
    this.boardW = boardW;
    this.boardH = boardH;
  }
  start() {
    this.snake = new Snake();
    this.createNewFood();
  }

  end() {
    alert(`GAME OVER. YOUR SCORE: ${this.snake.length}`);
    this.start();
  }

  snakeGotFood() {
    const snakeHead = this.snake.body[0];
    return snakeHead.x === this.food.x && snakeHead.y === this.food.y
  }

  createNewFood() {
    this.food = new Food(this.boardW, this.boardH);

    if (this.snakeGotFood()) {
      this.snake.grow();
    }

    return true;
  }

  snakeOutOfBoard() {
    return this.snake.body[0].x >= this.boardW || this.snake.body[0].y >= this.boardH || this.snake.body[0].x < 0 || this.snake.body[0].y < 0;
  }
}