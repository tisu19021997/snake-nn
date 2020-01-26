class DataProcessor {
  constructor() {
    this.on = false;
  }

  recordData(snake, keyCode) {
    if (this.on) {
      console.log('is recording');
      const snakeHead = snake.body[0];

      // obstacles for the snake to consider
      const obs1 = snakeHead.x === w - 1;
      const obs2 = snakeHead.x - 1 === 0;
      const obs3 = snakeHead.y === h - 1;
      const obs4 = snakeHead.y - 1 === 0;
      const inputs = boolArrayToInt([obs1, obs2, obs3, obs4]);

      const newData = {
        xs: inputs,
        ys: keyCode,
      };


      this.appendToLocal(newData, 'data', []);
    }
  }

  appendToLocal(data, label, defaults) {
    let localData = JSON.parse(localStorage.getItem(label)) || defaults;
    localData.data.push(data);
    localStorage.setItem(label, JSON.stringify(localData));

    return true;
  }

  turnOn() {
    return this.on = true;
  }

  turnOff() {
    return this.on = false;
  }
}