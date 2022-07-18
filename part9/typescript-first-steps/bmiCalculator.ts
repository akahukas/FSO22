interface BmiValues {
  height: number;
  mass: number;
}

const parseBmiArguments = (args: Array<string>): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments!');
  if (args.length > 4) throw new Error('Too many arguments!');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      mass: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!')
  }
}

const calculateBmi = (height: number, mass: number): string => {
  const heightInMeters = height / 100;
  const bmi = mass / (heightInMeters * heightInMeters);

  if (bmi < 16) {
    return 'Underweight (Severe thinness)';
  }
  else if (bmi >= 16 && bmi < 17) {
    return 'Underweight (Moderate thinness)';
  }
  else if (bmi >= 17 && bmi < 18.5) {
    return 'Underweight (Mild thinness)';
  }
  else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal (healthy weight)';
  }
  else if (bmi >= 25 && bmi < 30) {
    return 'Overweight (Pre-obese)';
  }
  else if (bmi >= 30 && bmi < 35) {
    return 'Obese (Class I)';
  }
  else if (bmi >= 35 && bmi < 40) {
    return 'Obese (Class II)';
  }
  else {
    return 'Obese (Class III)';
  }
};

try {
  const { height, mass } = parseBmiArguments(process.argv);
  console.log(calculateBmi(height, mass));
}
catch (error: unknown) {
  let errorMessage = 'Something went wrong.';

  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }

  console.log(errorMessage);
}
