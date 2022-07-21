const Course = ({ course }) => {
    return (
      <div>
        <Header course={course} />
        <Content course={course} />
        <Total text='Total exercises:' course={course} />
      </div>
    )
  }
  
  const Header = ({ course }) => {
    return (
      <div>
        <h2><strong>{course.name}</strong></h2>
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part} {props.exercises}
      </p>
    )
  }
  
  const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(part =>
          <Part key={part.id} part={part.name} exercises={part.exercises} />
        )}
      </div>
    )
  }
  
  const Total = (props) => {
    const totalExercises = props.course.parts.reduce((sum, { exercises }) => {
      console.log('Summa, harjoitukset:', sum, ',', exercises)
      return (sum + exercises)}, 0)
  
    return (
      <strong>
        {props.text} {totalExercises}
      </strong>
    )
  }

export default Course
