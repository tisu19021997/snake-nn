// game cofigurations
let game;
let resolution = 10;

// board weight and height
let w;
let h;

// nerual network
let tensorData;
let model;
let isTrained = false;
const batchSize = 32;
const epochs = 12;

// data processor helper
let dp;
let started = false;
let currentKey;

////////////////////////////////////////////////

function setup() {
  createCanvas(200, 200);
  frameRate(10);

  // width and height responding to the resolution
  w = width / resolution;
  h = height / resolution;

  // start a new game
  game = new Game(w, h, resolution);
  game.start();

  // neural network stuffs
  model = createModel();

  dp = new DataProcessor();
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
    const snakeHead = snake.body[0];

    // obstacles for the snake to consider
    const obs1 = boolToInt(snakeHead.x === w - 1);
    const obs2 = boolToInt(snakeHead.x - 1 === 0);
    const obs3 = boolToInt(snakeHead.y === h - 1);
    const obs4 = boolToInt(snakeHead.y - 1 === 0);

    const inputs = [obs1, obs2, obs3, obs4];

    const prediction = model.predict(tf.tensor2d(inputs, [1, 4])).round().dataSync();
    const key = numToKeyCode(prediction[0]);
    console.log(numToKeyCode(prediction[0]));
    snake.move(key);
  }

  if (game.isAuto) {
    currentKey = game.key;
    game.autoplay();
    frameRate(50);
    dp.turnOn();
    dp.recordData(game.snake, currentKey);
  }
}

////////////////////////////////////////////////

function keyPressed() {
  if (keyCode >= 37 && keyCode <= 40) {
    game.snake.move(keyCode);
    currentKey = keyCode;

    dp.turnOn();
    dp.recordData(game.snake, currentKey);

    return currentKey;
  }

  // press "t" to train
  if (keyCode === 84) {
    loadJSON('../dataFull.json', async (data) => {
      tensorData = dataToTensor(data);
      console.log(tensorData);
      const {
        inputs,
        keys
      } = tensorData;

      await trainModel(model, inputs, keys);

      //const prediction = model.predict(tf.tensor2d([0, 1, 0, 1], [1, 4])).round().dataSync();
      isTrained = true;
    });
  }

  // press "a" for autoplay
  if (keyCode === 65) {
    game.setAuto(true);
  }
}

function createModel() {
  const model = tf.sequential();

  model.add(tf.layers.dense({
    inputShape: [4],
    units: 1,
    useBias: true
  }));

  model.add(tf.layers.dense({
    units: 1,
    useBias: true
  }));

  return model;
}

function dataToTensor(data) {
  return tf.tidy(() => {
    tf.util.shuffle(data);

    const inputs = data.map((d) => d.xs);
    const keys = data.map((d) => d.ys);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 4]);
    const keyTensor = tf.tensor2d(keys, [keys.length, 1]);

    // normalize the data using min-max scaling
    // const normalizedKeys = minMaxNormalize(keyTensor);

    return {
      inputs: inputTensor,
      keys: keyTensor,
    }
  })
}

async function trainModel(model, inputs, keys) {
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  })

  return await model.fit(inputs, keys, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks({
        name: 'Training Performance',
      },
      ['loss', 'mse'], {
        height: 200,
        callbacks: ['onEpochEnd']
      }
    ),
  })
}

function minMaxNormalize(tensor) {
  const min = tensor.min();
  const max = tensor.max();

  // (value - min / max - min)
  return tensor.sub(min).div(max.sub(min));
};

