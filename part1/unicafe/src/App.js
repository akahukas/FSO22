import { useState } from 'react'

const Statistics = (props) => {
  return (
    <div>
      <h1>{props.header}</h1>
      <p>
        {props.goodStr} {props.good}
      </p>
      <p>
        {props.neutralStr} {props.neutral}
      </p>
      <p>
        {props.badStr} {props.bad}
      </p>
      <p>
        {props.totalStr} {props.total}
      </p>
      <p>
        {props.averageStr} {props.average}
      </p>
      <p>
        {props.positiveStr} {10 * props.positive} %
      </p>
    </div>
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
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
  }

  // Muuttujat, jotka sisältävät tilastotietoa.
  const totalFeedback = (good + neutral + bad)
  const averageFeedback = (good * 1 + neutral * 0 + bad * (-1))/totalFeedback
  const positiveFeedback = good/totalFeedback

  return (
    <div>
      <h1>Give feedback!</h1>
      <button onClick={handleGood}>Good</button>
      <button onClick={handleNeutral}>Neutral</button>
      <button onClick={handleBad}>Bad</button>
      <Statistics header='Statistics:' goodStr='Good:' good={good}
                                       neutralStr='Neutral:' neutral={neutral}
                                       badStr='Bad:' bad={bad}
                                       totalStr='Total:' total={totalFeedback}
                                       averageStr='Average:' average={averageFeedback}
                                       positiveStr='Positive:' positive={positiveFeedback} />
    </div>
  )
}

export default App
