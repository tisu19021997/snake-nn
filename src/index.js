// game cofigurations
let game;
let resolution = 10;
const WIDTH = 300;
const HEIGHT = 300;

// board weight and height
let w;
let h;

// nerual network
let dataURL = 'https://tisu19021997.github.io/snake-nn/data.json';
let data;
let model;
let isTrained = false;
let lr;
let ts;

// inputs
let lrInput;
let tsInput;

// data processor helper
let dp;
let started = false;
let currentKey;

////////////////////////////////////////////////

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(10);

  // width and height responding to the resolution
  w = width / resolution;
  h = height / resolution;

  // start a new game
  game = new Game(w, h, resolution);
  game.start();

  dp = new DataRecorder();

  const trainBtn = createButton('Train');
  trainBtn.mousePressed(getDataAndTrain);
}

function draw() {
  background(0);
  scale(resolution);

  const {
    snake,
    food
  } = game;

  snake.update();
  food.create();

  if (game.snakeOutOfBoard()) {
    dp.turnOff();
    game.end();
  }

  if (game.snakeGotFood()) {
    game.createNewFood();
    snake.grow();
  } else if (snake.selfBite()) {
    dp.turnOff();
    game.end();
  }

  if (isTrained) {
    const {
      snake
    } = game;

    // convert current snake position to inputs
    const input = tf.tensor2d(generateInputs(snake, w, h), [1, 4]);
    input.print();
    const prediction = model.predict(input);
    // get the index of the highest posibility key
    const indice = prediction.argMax(-1).dataSync()[0];
    // convert index back to keyCode
    const key = intToKeyCode(indice);

    console.log(key);

    snake.move(key);
  }


  if (game.isAuto) {
    if (game.key) {
      currentKey = game.key;
    }
    dp.recordData(game.snake, currentKey, w, h);
    // game.autoplay();
    // frameRate(50);
  }
}

////////////////////////////////////////////////

function keyPressed() {
  if (keyCode >= 37 && keyCode <= 40) {
    game.snake.move(keyCode);
    currentKey = keyCode;

    dp.turnOn();
    dp.recordData(game.snake, currentKey, w, h);

    return currentKey;
  }

  // press "t" to train
  if (keyCode === 84) {
    isTrained = false;

    data = loadJSON(dataURL, async (json) => {
      const [xTrain, yTrain, xTest, yTest] = await processData(json, ts);
      model = createModel(xTrain);
      await trainModel(model, xTrain, yTrain, xTest, yTest);

      isTrained = true;
    });

  }

  // press "a" to autoplay
  if (keyCode === 65) {
    game.setAuto(true);
  }

  // press "r" to record data
  if (keyCode === 82) {
    dp.turnOn();
  }

  // press "s" to save the model
  if (keyCode === 83) {
    model.save('localstorage://snake-model');
  }
}

function getDataAndTrain() {
  isTrained = false;
  lr = parseFloat(document.getElementById('lr').value) || 0.01;
  ts = parseFloat(document.getElementById('ts').value) || 0.2;

  console.log(typeof ts, typeof lr);

  data = loadJSON(dataURL, async (json) => {
    const [xTrain, yTrain, xTest, yTest] = await processData(json, ts);
    model = createModel(xTrain);
    await trainModel(model, xTrain, yTrain, xTest, yTest, lr);

    isTrained = true;
  })
}