import { CoursePart } from '../types';


interface TotalProps {
  courseParts: Array<CoursePart>;
}

const Total = ({ courseParts }: TotalProps): JSX.Element => {
  return (
    <div>
      <p>
        Number of exercises{" "}
        {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    </div>
    
  );
};

export default Total;
