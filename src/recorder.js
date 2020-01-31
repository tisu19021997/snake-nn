class DataRecorder {
  constructor() {
    this.on = false;
    this.dataLength = 0;
  }

  recordData(snake, keyCode, boardW, boardH) {
    if (this.on) {
      const xs = generateInputs(snake, boardW, boardH);
      const ys = keyCodeToInt(keyCode);
      const newData = [...xs, ys];

      this.dataLength += 1;
      console.log(this.dataLength, xs);
      
      this.appendToLocal(newData, 'data', []);
    }
  }

  appendToLocal(data, label, defaults) {
    let localData = JSON.parse(localStorage.getItem(label)) || defaults;
    localData.push(data);
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