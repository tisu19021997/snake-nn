const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

class Snake {
  constructor() {
    this.body = [];
    // this.body[0] = createVector(5, 5);

    this.xDir = 0;
    this.yDir = 0;

    this.length = 1;
  }

  place(coordinate) {
    const {
      x,
      y
    } = coordinate;
    this.body[0] = createVector(x, y);
  }

  setDir(x, y) {
    this.xDir = x;
    this.yDir = y;

    return [x, y];
  }

  getDir() {
    return {
      x: this.xDir,
      y: this.yDir,
    }
  }

  move(direction = DOWN) {
    const dir = this.getDir();

    switch (direction) {
      case UP:
        if (dir.x === 0 && dir.y === 1) {
          break;
        }
        this.setDir(0, -1);
        break;

      case DOWN:
        if (dir.x === 0 && dir.y === -1) {
          break;
        }
        this.setDir(0, 1);
        break;

      case RIGHT:
        if (dir.x === -1 && dir.y === 0) {
          break;
        }
        this.setDir(1, 0);
        break;

      case LEFT:
        if (dir.x === 1 && dir.y === 0) {
          break;
        }
        this.setDir(-1, 0);
        break;
    }

    return [this.xDir, this.yDir];
  }

  visualize() {
    noStroke();

    this.body.map((part) => {
      fill(color(random(255), random(255), random(255)));
      rect(part.x, part.y, 1, 1);
    })
  }

  update() {
    const head = this.body[0].copy();
    this.body.pop();
    head.x += this.xDir;
    head.y += this.yDir;
    this.body.unshift(head);

    return this.visualize();
  }

  grow() {
    // increase the length by 1
    this.length += 1;

    // copy the head and add it to the beginning of the body
    const head = this.body[0].copy();
    this.body.unshift(head);
  }

  selfBite() {
    if (this.length <= 2) {
      return false;
    }

    for (let i = 1; i < this.length; i++) {
      if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
        return true;
      }
    }

    return false;
  }
}