interface Course {
  name: string;
  exerciseCount: number;
}

interface TotalProps {
  courseParts: Array<Course>;
}

const Total = ({ courseParts }: TotalProps): JSX.Element => {
  return (
    <p>
        Number of exercises{" "}
        {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
  );
};

export default Total;
