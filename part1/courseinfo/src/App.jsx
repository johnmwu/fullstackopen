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
      {props.parts.map((part, i) => <Part key={i} part={part["name"]} exercise={part["exercises"]} />)}
    </>
  )
}

const Total = (props) => {
  const sum = props.parts.reduce((acc, part) => acc + part["exercises"], 0)
  return <p>Number of Exercises {sum}</p>
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  const parts = [part1, part2, part3]
  // const exercises = [exercises1, exercises2, exercises3]

  return (
    <div>
      <Header course={course}></Header>
      <Content parts={parts}/>
      {/* <p>Number of exercises {exercises1 + exercises2 + exercises3}</p> */}
      <Total parts={parts}/>
    </div>
  )
}

export default App