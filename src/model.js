class Model {
  static create(xs) {
    const model = tf.sequential();

    model.add(tf.layers.dense({
      inputShape: [xs.shape[1]],
      units: 16,
      activation: 'sigmoid',
    }));

    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
    }));

    model.add(tf.layers.dense({
      units: 4,
      activation: 'softmax',
    }));

    const surface = {
      name: 'Model Summary',
      tab: 'Model Inspection'
    };
    tfvis.show.modelSummary(surface, model);

    return model;
  }

  static async train(model, xTrain, yTrain, xTest, yTest, learningRate = 0.01) {
    const optimizer = tf.train.adam(learningRate);

    model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })

    const trainLogs = [];
    const accSurface = {
      name: 'Accuracy',
      tab: 'Accuracy',
    };
    const lossSurface = {
      name: 'Loss',
      tab: 'Loss',
    }
    return await model.fit(xTrain, yTrain, {
      batchSize: 500,
      epochs: 100,
      validationData: [xTest, yTest],
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          // Plot the loss and accuracy values at the end of every training epoch.
          trainLogs.push(logs);
          tfvis.show.history(lossSurface, trainLogs, ['loss', 'val_loss'])
          tfvis.show.history(accSurface, trainLogs, ['acc', 'val_acc'])
        },
      }
    })
  }
}