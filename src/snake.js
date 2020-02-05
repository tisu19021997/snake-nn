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
    this.tail = [];
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
      fill(color(255));
      rect(part.x, part.y, 1, 1);
    })
  }

  update() {
    const head = this.body[0].copy();
    this.body.pop();
    head.x += this.xDir;
    head.y += this.yDir;
    this.body.unshift(head);

    this.look();

    return this.visualize();
  }

  grow() {
    // increase the length by 1
    this.length += 1;

    // copy the head and add it to the beginning of the body
    this.body.unshift(this.body[0]);
  }

  selfBite() {
    if (this.length <= 2) {
      return false;
    }

    for (let i = 3; i < this.length; i++) {
      const part = this.body[i];
      const distance = this.distanceFromHead(part);

      if (distance === 0) {
        return true;
      }
    }

    return false;
  }

  distanceFromHead(part, normalize = false) {
    let head = this.body[0];

    if (normalize) {
      head = this.body[0].copy().normalize();
    }

    return dist(head.x, head.y, part.x, part.y);
  }

  directionalDistanceFromHead(directionVector) {
    const head = this.body[0];
    stroke(255, 0, 0);
    strokeWeight(0.5);
    line(head.x, head.y, directionVector.x, directionVector.y);

    let distance = 1;

    if (this.length <= 2) {
      return distance;
    }

    // make a line (boundary) from the start and the start of snake's body
    const start = this.body[2];
    const end = this.body[this.length - 1];

    line(start.x, start.y, end.x, end.y);

    // perform a raycast for 3 directions from the head to the boundar to find
    // the intersection point, then find the distance between the head and that point
    let intersection = findLinesIntersectionPoint(start, end, head, directionVector);

    if (intersection) {
      intersection = intersection.normalize();
      distance = this.distanceFromHead(intersection, true);
    }

    return distance;
  }

  look() {
    const head = this.body[0];
    return [this.lookLeft(head), this.lookFoward(head), this.lookRight(head)];
  }

  lookFoward(head) {
    const directionVector = createVector(head.x + this.xDir, head.y + this.yDir);
    return this.directionalDistanceFromHead(directionVector);
  }

  lookLeft(head) {
    let directionVector = createVector();
    directionVector.x = head.x + this.yDir;

    // snake is going RIGHT or LEFT
    if (abs(this.xDir) === 1) {
      directionVector.y = head.y - this.xDir;
    } else {
      directionVector.y = head.y + this.xDir;
    }
    return this.directionalDistanceFromHead(directionVector);
  }

  lookRight(head) {
    let directionVector = createVector();
    directionVector.y = head.y + this.xDir;

    // snake is going RIGHT or LEFT
    if (abs(this.xDir) === 1) {
      directionVector.x = head.x + this.yDir;
    } else {
      directionVector.x = head.x - this.yDir;
    }

    return this.directionalDistanceFromHead(directionVector);
  }
}