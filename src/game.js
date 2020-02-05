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
    return dist(snakeHead.x, snakeHead.y, this.food.x, this.food.y) === 0;
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

  autoplay() {
    if (this.isAuto) {
      this.key = random([37, 38, 39, 40]);
      return this.snake.move(this.key);
    }
    return false;
  }
}