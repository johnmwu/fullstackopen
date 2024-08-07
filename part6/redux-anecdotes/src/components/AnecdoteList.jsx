import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setFilter } from '../reducers/filterReducer'
import { setNotification } from '../reducers/notificationReducer'
import { initialize as initializeAnecdotes } from '../reducers/anecdoteReducer'

const Filter = () => {
  const dispatch = useDispatch()
  const handleChange = (event) => {
    dispatch(setFilter(event.target.value))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

const AnecdoteList = () => {
  const unsortedAnecdotes = useSelector(state => {
    // console.log(state)
    return state.anecdotes.filter((a) => a.content.includes(state.filter))
  })
  const anecdotes = unsortedAnecdotes.sort((a, b) => b.votes - a.votes)
  const dispatch = useDispatch()

  const handleClick = (anecdote) => {
    dispatch(vote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
    // setTimeout(() => {
    //   dispatch(removeNotification(`you voted '${anecdote.content}'`))
    // }, 5000)
  }

  useEffect(() => {
    // anecdoteService.getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes))
    // )
    dispatch(initializeAnecdotes())
  }, [])
    

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleClick(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList