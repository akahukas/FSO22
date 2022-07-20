interface Course {
  name: string;
  exerciseCount: number;
}

interface ContentProps {
  courseParts: Array<Course>;
}

const Content = ({ courseParts }: ContentProps): JSX.Element => {
  return (
    <div>
      <p>
      {courseParts[0].name} {courseParts[0].exerciseCount}
      </p>
      <p>
      {courseParts[1].name} {courseParts[1].exerciseCount}
      </p>
      <p>
      {courseParts[2].name} {courseParts[2].exerciseCount}
      </p>
    </div>
  );
};

export default Content;
