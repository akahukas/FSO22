import express from 'express';
const app = express();

import { calculateBmi } from './bmiCalculator';

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {

  const height = Number(req.query.height);
  const mass = Number(req.query.weight);

  if (!height || !mass) {
    res.status(400).json({
      error: 'Malformatted parameters.'
    });
  } else {
  
    const stringInfo = calculateBmi(height, mass);

    res.status(200).json({
      weight: mass,
      height,
      bmi: stringInfo,
    });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});