function boolArrayToInt(arr) {
  return arr.map((a) => boolToInt(a));
}

function boolToInt(bool) {
  return bool === false ? 0 : 1;
}

function numToKeyCode(num) {
  return 36 + num;
}

function keyCodeToNum(key) {
  return key - 36;
}