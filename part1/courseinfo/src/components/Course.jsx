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
    return <p><b>Total of {sum} exercises</b></p>
  }
  
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

  export default Course