import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>{props.text}</button>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value} {props.suffix}</td>
    </tr>
  )
}

const Statistics = (props) => {
  
  // Ehdollinen renderöinti kokonaismäärämuuttujan avulla.
  if (props.total === 0) {
    return (
      <div>
        No feedback given.
      </div>
    )
  }
  
  return (
    <table>
      <tbody>
        <StatisticLine text={props.goodStr} value={props.good} />
        <StatisticLine text={props.neutralStr} value={props.neutral} />
        <StatisticLine text={props.badStr} value={props.bad} />
        <StatisticLine text={props.totalStr} value={props.total} />
        <StatisticLine text={props.averageStr} value={props.average} />
        <StatisticLine text={props.positiveStr} value={10 * props.positive} 
                       suffix='%' />
      </tbody>
    </table>
  )
}

const App = () => {
  // Tallennetaan nappien tilat.
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // Nappien tapahtumankäsittelijät.
  const handleGood = () => {
    setGood(good + 1)
    console.log('One positive feedback received.')
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
    console.log('One neutral feedback received.')
  }

  const handleBad = () => {
    setBad(bad + 1)
    console.log('One negative feedback received.')
  }

  // Muuttujat, jotka sisältävät tilastotietoa.
  const totalFeedback = (good + neutral + bad)
  const averageFeedback = (good * 1 + neutral * 0 + bad * (-1))/totalFeedback
  const positiveFeedback = good/totalFeedback

  return (
    <div>
      <h1>Give feedback!</h1>
      <Button handleClick={handleGood} text='Good'/>
      <Button handleClick={handleNeutral} text='Neutral'/>
      <Button handleClick={handleBad} text='Bad'/>
      <h1>Statistics:</h1>
      <Statistics goodStr='Good:' good={good}
                  neutralStr='Neutral:' neutral={neutral}
                  badStr='Bad:' bad={bad}
                  totalStr='Total:' total={totalFeedback}
                  averageStr='Average:' average={averageFeedback}
                  positiveStr='Positive:' positive={positiveFeedback} />
    </div>
  )
}

export default App
