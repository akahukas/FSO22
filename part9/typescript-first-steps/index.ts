import express from 'express';
const app = express();

app.use(express.json());

import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
import { Result } from './exerciseCalculator';

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

app.post('/exercises', (req, res) => {
  const exerciseData = req.body; // eslint-disable-line @typescript-eslint/no-unsafe-assignment

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const dailyExerciseHours: Array<number> = exerciseData.daily_exercises;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  let targetValue: number = exerciseData.target;

  if (!dailyExerciseHours || !targetValue) {
    return res.status(400).json({
      error: 'Missing parameters.'
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  targetValue = Number(exerciseData.target);

  if (!targetValue) {
    return res.status(400).json({
      error: 'Malformatted parameters.'
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const targetNumber: number = targetValue;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  dailyExerciseHours.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (stringNumber) => {
    
      if (isNaN(Number(stringNumber))) {
        return res.status(400).json({
          error: 'Malformatted parameters.'
        });
      }
      else {
        return Number(stringNumber);
      }
    }
  );

  const result: Result = calculateExercises(dailyExerciseHours, targetNumber);
  
  return res.status(200).json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});