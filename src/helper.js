/**
 * Convert array of boolean to array of integers, `false` is 0 and `true` to 1
 * 
 * @param {array} arr - Array of boolean to convert
 */
function boolArrayToInt(arr) {
  if (arr.length < 1) {
    return false;
  }

  return arr.map((a) => boolToInt(a));
}

/**
 * Generate a one-hot array with a given length 
 * 
 * @param {number} length - The length of the result array
 * @param {number} position - The position of `on` value
 */
function oneHot(length, position) {
  let array = Array(length).fill(0);
  array[position] = 1;

  return array;
}

/**
 * Convert one hot array to javascript keycode
 * 
 * @param {array} oneHotArray - One hot array to convert to key code
 */
function oneHotToKeyCode(oneHotArray) {
  const index = oneHotArray.indexOf(1) + 1;
  return intToKeyCode(index);
}

/**
 * Convert boolean to integer
 * 
 * @param {boolean} bool 
 */
function boolToInt(bool) {
  return bool === false ? 0 : 1;
}

/**
 * Convert integer to javascript keycode
 * 
 * @param {number} num 
 */
function intToKeyCode(num) {
  return 37 + num;
}

/**
 * Convert javascript keycode to number
 * 
 * @param {number} key 
 */
function keyCodeToInt(key) {
  return key - 37;
}

/**
 * Convert the prediction of the model to javascript keycode
 * 
 * @param {number} prediction 
 */
function predictionToKeyCode(prediction) {
  const max = Math.max(...prediction);
  const maxIndex = prediction.indexOf(max);

  return oneHotToKeyCode(oneHot(prediction.length, maxIndex));
}

/**
 * Generate the input (or features) for model based on snake's position
 * 
 * @param {object} snake - Snake object
 * @param {number} boardW - Board width
 * @param {number} boardH - Board height
 */
function generateInputs(snake, boardW, boardH) {
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

  return [cond1, cond2, cond3, cond4, cond5, cond6];
}