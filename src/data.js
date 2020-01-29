const KEYS_LENGTH = 4;

function processData(data) {
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

    const xs = [];
    const ys = [];

    for (let i = 0; i < KEYS_LENGTH; ++i) {
      const [x, y] = convertToTensors(dataByKey[i], targetsByKey[i])
      xs.push(x);
      ys.push(y);
    }

    const concatAxis = 0;

    return [tf.concat(xs, concatAxis), tf.concat(ys, concatAxis)];
  });
}

function convertToTensors(data, keys) {
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

  const xDims = shuffledData[0].length;
  console.log(xDims)
  const x = tf.tensor2d(shuffledData, [numExamples, xDims]);
  const y = tf.oneHot(tf.tensor1d(shuffledTarget).toInt(), KEYS_LENGTH);

  return [x, y];
}

function createModel(xs) {
  const model = tf.sequential();

  model.add(tf.layers.dense({
    inputShape: [xs.shape[1]],
    units: 1,
    activation: 'sigmoid',
  }));

  model.add(tf.layers.dense({
    units: 4,
    activation: 'softmax',
  }));

  model.summary();

  return model;
}

async function trainModel(model, xs, ys) {
  const optimizer = tf.train.adam(LR);

  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  })

  return await model.fit(xs, ys, {
    epochs: 40,
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