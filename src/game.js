class Game {
  constructor(boardW, boardH, resolution) {
    this.resolution = resolution;
    this.boardW = boardW;
    this.boardH = boardH;
    this.isAuto = false;
  }

  start() {
    // create new snake instance
    this.snake = new Snake();
    // place snake and food on random locations on the board
    this.snake.place(this.randomPlaceOnBoard());
    this.createNewFood();
  }

  end() {
    if (!this.isAuto) {
      alert(`GAME OVER. YOUR SCORE: ${this.snake.length}`);
    }
    this.start();
  }

  snakeGotFood() {
    const snakeHead = this.snake.body[0];
    return snakeHead.x === this.food.x && snakeHead.y === this.food.y
  }

  createNewFood() {
    this.food = new Food(this.boardW, this.boardH);
    this.food.place(this.randomPlaceOnBoard());

    if (this.snakeGotFood()) {
      this.snake.grow();
    }

    return true;
  }

  snakeOutOfBoard() {
    return this.snake.body[0].x >= this.boardW || this.snake.body[0].y >= this.boardH || this.snake.body[0].x < 0 || this.snake.body[0].y < 0;
  }

  randomPlaceOnBoard() {
    return {
      x: floor(random(this.boardW)),
      y: floor(random(this.boardH)),
    }
  }

  setAuto(bool = false) {
    this.isAuto = bool;
  }

  // auto play to collect data
  autoplay() {
    if (this.isAuto) {
      const key = floor(random(37, 40));
      this.key = key;
      this.snake.move(key);
    }
  }
}