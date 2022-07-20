import { CoursePart } from '../types';
import Part from './Part';

interface ContentProps {
  courseParts: Array<CoursePart>;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Content = ({ courseParts }: ContentProps): JSX.Element => {
  return (
    <div>
      <>
        {courseParts.map(part => {
          switch (part.type) {
            case 'normal':
              return <Part key={part.name} coursePart={part} />;
            case 'groupProject':
              return <Part key={part.name} coursePart={part} />;
            case 'submission':
              return <Part key={part.name} coursePart={part} />;
            case 'special':
              return <Part key={part.name} coursePart={part} />;
            default:
              assertNever(part);
          }
        })}
      </>
    </div>
  );
};

export default Content;
