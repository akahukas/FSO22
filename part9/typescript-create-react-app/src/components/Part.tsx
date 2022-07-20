import { CoursePart } from '../types';

interface PartProps {
  coursePart: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ coursePart }: PartProps): JSX.Element => {

  switch(coursePart.type) {
    case 'normal':
      return (
        <div>
          <p><strong>{coursePart.name}</strong> {coursePart.exerciseCount}</p>
          <p><i>{coursePart.description}</i></p>
        </div>
      );
    case 'groupProject':
      return (
        <div>
          <p><strong>{coursePart.name}</strong> {coursePart.exerciseCount}</p>
          <p>Project exercises: {coursePart.groupProjectCount}</p>
        </div>
      );
    case 'submission':
      return (
        <div>
          <p><strong>{coursePart.name}</strong> {coursePart.exerciseCount}</p>
          <p><i>{coursePart.description}</i></p>
          <p>Submit to: 
            <a href={coursePart.exerciseSubmissionLink}>
              {coursePart.exerciseSubmissionLink}
            </a>
          </p>
        </div>
      );
    case 'special':
      return (
        <div>
          <p><strong>{coursePart.name}</strong> {coursePart.exerciseCount}</p>
          <p><i>{coursePart.description}</i></p>
          <p> Required skills:{' '}
            {coursePart.requirements.join(', ')}
            </p>
        </div>
      )
    default:
      return assertNever(coursePart);
  }  
};

export default Part;
