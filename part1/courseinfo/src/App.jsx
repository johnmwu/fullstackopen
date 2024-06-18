const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return <p>{props.part} {props.exercise}</p>
}

const Content = (props) => {
  return (
    <>
      {props.parts.map((part, i) => <Part key={i} part={part} exercise={props.exercises[i]} />)}
    </>
  )
}

const Total = (props) => {
  const sum = props.exercises.reduce((acc, curr) => acc + curr)
  return <p>Number of Exercises {sum}</p>
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  const parts = [part1, part2, part3]
  const exercises = [exercises1, exercises2, exercises3]

  return (
    <div>
      <Header course={course}></Header>
      <Content parts={parts} exercises={exercises} />
      {/* <p>Number of exercises {exercises1 + exercises2 + exercises3}</p> */}
      <Total exercises={exercises} />
    </div>
  )
}

export default App