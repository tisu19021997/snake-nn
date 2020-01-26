class Food {
  place(coordinate) {
    const { x, y } = coordinate;
    this.x = x;
    this.y = y;
  }

  create() {
    fill(255, 0, 0);
    rect(this.x, this.y, 1, 1);
  }
}