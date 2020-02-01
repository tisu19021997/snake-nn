const KEYS_LENGTH = 4;

function processData(data, testSplit = 0.2) {
  return tf.tidy(() => {
    const dataByKey = [];
    const targetsByKey = [];

    for (let i = 0; i < KEYS_LENGTH; ++i) {
      dataByKey.push([]);
      targetsByKey.push([]);
    }

    for (const example of data) {
      const key = example[example.length - 1];
      const input = example.slice(0, example.length - 1);
      dataByKey[key].push(input);
      targetsByKey[key].push(key);
    }

    const xTrains = [];
    const yTrains = [];
    const xTests = [];
    const yTests = [];

    for (let i = 0; i < KEYS_LENGTH; ++i) {
      const [xTrain, yTrain, xTest, yTest] = convertToTensors(dataByKey[i], targetsByKey[i], testSplit)
      xTrains.push(xTrain);
      yTrains.push(yTrain);
      xTests.push(xTest);
      yTests.push(yTest);
    }

    const concatAxis = 0;

    return [
      tf.concat(xTrains, concatAxis), tf.concat(yTrains, concatAxis),
      tf.concat(xTests, concatAxis), tf.concat(yTests, concatAxis)
    ];
  });
}

function convertToTensors(data, keys, testSplit) {
  const numExamples = data.length;

  const indices = [];

  for (let i = 0; i < numExamples; ++i) {
    indices.push(i);
  }
  tf.util.shuffle(indices);

  const shuffledData = [];
  const shuffledTarget = [];

  for (let i = 0; i < numExamples; ++i) {
    shuffledData.push(data[indices[i]]);
    shuffledTarget.push(keys[indices[i]]);
  }

  const numTestExamples = Math.round(numExamples * testSplit);
  const numTrainExamples = numExamples - numTestExamples;

  const xDims = shuffledData[0].length;

  const xs = tf.tensor2d(shuffledData, [numExamples, xDims]);
  const ys = tf.oneHot(tf.tensor1d(shuffledTarget).toInt(), KEYS_LENGTH);

  const xTrain = xs.slice([0, 0], [numTrainExamples, xDims]);
  const xTest = xs.slice([numTrainExamples, 0], [numTestExamples, xDims]);
  const yTrain = ys.slice([0, 0], [numTrainExamples, KEYS_LENGTH]);
  const yTest = ys.slice([0, 0], [numTestExamples, KEYS_LENGTH]);

  return [xTrain, yTrain, xTest, yTest];
}

/**
 * Generate the input (or features) for model based on snake's position
 * 
 * @param {object} snake - Snake object
 * @param {number} boardW - Board width
 * @param {number} boardH - Board height
 */
function generateInputs(snake, food, boardW, boardH) {
  const head = snake.body[0];

  // snake's x/y is about to be larger than the board width/height
  const cond1 = boolToInt(head.x + 2 >= boardW);
  const cond2 = boolToInt(head.y + 2 >= boardH);

  // snake's x/y is about to be negative
  const cond3 = boolToInt(head.x - 2 <= 0);
  const cond4 = boolToInt(head.y - 2 <= 0);

  // snake's current direction
  const cond5 = snake.xDir;
  const cond6 = snake.yDir;

  // distance between snake and food
  const maxDistance = dist(0, 0, boardW, boardH);
  const minDistance = 0;
  const cond7 = mmNormalize(dist(head.x, head.y, food.x, food.y), minDistance, maxDistance);

  // angle between snake and food
  const snakeDirectionVector = createVector(snake.xDir, snake.yDir);
  const snakeFoodVector = toVector(head, food);
  let cond8 = snakeFoodVector.angleBetween(snakeDirectionVector);

  if (!Number.isNaN(cond8)) {
    // normalize the angle between -1 and 1
    cond8 = (degrees(cond8)) / 180;
  } else {
    cond8 = 0;
  }

  return [cond1, cond2, cond3, cond4, cond5, cond6, cond7, cond8];
}