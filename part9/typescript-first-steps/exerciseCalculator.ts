interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (dailyExerciseHours: Array<number>, targetValue: number): Result => {
  let totalHours = 0;
  let trainingDays = 0;
  
  dailyExerciseHours.forEach((dailyHours) => {
    if (dailyHours > 0) {
      trainingDays += 1;
    }
    totalHours += dailyHours;
  })

  const averageHours = totalHours / dailyExerciseHours.length;

  const difference = averageHours - targetValue;
  
  let rating = null
  let ratingDescription = null

  if (difference >= -2 && difference < -1) {
    rating = 1;
    ratingDescription = 'There is a lot to improve!';
  } else if (difference >= -1 && difference < 0) {
    rating = 2;
    ratingDescription = 'Not too bad but could definitely be better!';
  } else {
    rating = 3;
    ratingDescription = 'Great work, keep it up!';
  }

  return {
    periodLength: dailyExerciseHours.length,
    trainingDays,
    success: averageHours >= targetValue,
    rating,
    ratingDescription,
    target: targetValue,
    average: averageHours, 
  };
};

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
