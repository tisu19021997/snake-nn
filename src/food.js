class Food {
  constructor(boardW, boardH) {
    this.x = floor(random(floor(boardW)));
    this.y = floor(random(floor(boardH)));
  }

  create() {
    fill(255, 0, 0);
    rect(this.x, this.y, 1, 1);
  }
}