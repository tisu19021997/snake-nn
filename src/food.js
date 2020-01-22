class Food {
  constructor(resolution) {
    this.x = floor(random(floor(width / resolution)));
    this.y = floor(random(floor(height / resolution)));
  }

  create() {
    fill(255, 0, 0);
    rect(this.x, this.y, 1, 1);
  }
}