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

function mmNormalize(value, min, max) {
  return (value - min) / (max - min);
}

/**
 * Create a vector object for two points
 * 
 * @param {object} p1 - Point 1
 * @param {object} p2  - Point 2
 */
function toVector(p1, p2) {
  return createVector(p2.x - p1.x, p2.y - p1.y);
}