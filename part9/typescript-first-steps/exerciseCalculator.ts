interface ExerciseValues {
  dailyExerciseHours: Array<number>;
  targetValue: number;
}

const parseExerciseArguments = (args: Array<string>): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments!');

  const stringArguments = args.slice(2);
  
  const numberArguments: Array<number> = stringArguments.map((stringNumber) => {
    
    if (isNaN(Number(stringNumber))) {
      throw new Error('Provided values were not numbers!');
    }
    else {
      return Number(stringNumber);
    }
  });
  
  const targetValue = numberArguments.shift();
  if (!targetValue) {
    throw new Error('Target value wasn\'t provided!');
  }

  const dailyExerciseHours: Array<number> = [];

  numberArguments.forEach((number) => {
    dailyExerciseHours.push(number);
  });

  return {
    dailyExerciseHours,
    targetValue
  };
};

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
  });

  const averageHours = totalHours / dailyExerciseHours.length;

  const difference = averageHours - targetValue;
  
  let rating = null;
  let ratingDescription = null;

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

try {
  const { dailyExerciseHours, targetValue } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(dailyExerciseHours, targetValue));
}
catch (error: unknown) {
  let errorMessage = 'Something went wrong.';

  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }

  console.log(errorMessage);
}
