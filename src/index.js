// game cofigurations
let game;
let resolution = 10;
const WIDTH = 300;
const HEIGHT = 300;

// board weight and height
let w = WIDTH / resolution;
let h = HEIGHT / resolution;

// nerual network
let data = {
  // url: 'https://tisu19021997.github.io/snake-nn/dataFull.json',
  url: '../dataApple.json',
  body: [],
};
let model;
let modelTrained;

// learning rate and test split
let lr;
let ts;

// inputs
let lrInput;
let tsInput;

// data processor helper
let dp;
let currentKey;

// keycode
let A_KEY = 65;
let R_KEY = 82;
let S_KEY = 83;


////////////////////////////////////////////////

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(10);

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

  if (modelTrained) {
    // convert current snake position to inputs
    const input = generateInputs(snake, food, w, h);
    const inputTensor = tf.tensor2d(input, [1, input.length]);
    const prediction = model.predict(inputTensor);

    inputTensor.print();

    // get the index of the highest posibility key and convert it back to keycode
    const indice = prediction.argMax(-1).dataSync()[0];
    const key = intToKeyCode(indice);

    console.log(key);

    snake.move(key);
  }


  if (game.isAuto) {
    if (game.key) {
      dp.turnOn();
      currentKey = game.key;
    }
    dp.recordData(game.snake, game.food, currentKey, w, h);
  }
}

////////////////////////////////////////////////

function keyPressed() {
  if (keyCode >= 37 && keyCode <= 40) {
    // record the input data and the keycode before changing the direction
    currentKey = keyCode;
    dp.recordData(game.snake, game.food, currentKey, w, h);

    // change snake direction
    game.snake.move(keyCode);

    return currentKey;
  }

  // press "a" to autoplay
  if (keyCode === A_KEY) {
    game.setAuto(true);
  }

  // press "r" to record data
  if (keyCode === R_KEY) {
    dp.turnOn();
  }

  // press "s" to save the model
  if (keyCode === S_KEY) {
    model.save('localstorage://snake-model');
  }
}

function getDataAndTrain() {
  // allow to re-train a model
  if (model) {
    modelTrained = false;
  }

  // learning rate and test split
  lr = parseFloat(document.getElementById('lr').value) || 0.01;
  ts = parseFloat(document.getElementById('ts').value) || 0.2;

  // load data and train
  data.body = loadJSON(data.url, async (json) => {
    const [xTrain, yTrain, xTest, yTest] = await processData(json, ts);
    model = Model.create(xTrain);
    await Model.train(model, xTrain, yTrain, xTest, yTest, lr);
    modelTrained = true;
  })
}