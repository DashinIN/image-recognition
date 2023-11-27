const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const Jimp = require('jimp');
const cors = require('cors');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const app = express();
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(express.json());
app.use(cors());

async function preprocessImage(imageBuffer) {
  try {
    const image = await loadImage(imageBuffer);
    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, 32, 32);
    const imageData = ctx.getImageData(0, 0, 32, 32).data;

    // Преобразование данных в тензор
    const inputTensor = tf.tensor(imageData).reshape([1, 32, 32, 4]).slice([0, 0, 0, 0], [1, 32, 32, 3]); // (batch_size, height, width, channels)

    // Нормализация значений пикселей в диапазоне [0, 1]
    const normalizedTensor = inputTensor.div(255.0);

    return normalizedTensor;
  } catch (error) {
    console.error('Ошибка при обработке изображения:', error);
    return null;
  }
}

const modelPath = 'file://C:/Users/igree/Desktop/digit-recognition/server/model/model.json';
// app.use('/model', express.static(path.join(__dirname, 'model')));
// const modelPath = 'https://digit-recognition-api.onrender.com/model/model.json'

app.post('/classify', upload.single('image'), async (req, res) => {
  try {
    const model = await tf.loadLayersModel(modelPath);
    const image = req.file.buffer;
    const preprocessedImage = await preprocessImage(image);
    console.log(preprocessedImage)

    if (preprocessedImage === null) {
      return res.status(500).json({ error: 'Ошибка при обработке изображения' });
    }
    const inputTensor = preprocessedImage.reshape([1, 32, 32, 3]);
    const prediction = await model.predict(inputTensor);
    const predictionArray = prediction.arraySync();
    const results = predictionArray[0]
    const maxIndex = results.indexOf(Math.max(...results))
    res.json({result: maxIndex, resultArray:results});
  

  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
