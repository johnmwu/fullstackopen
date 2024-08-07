import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import { setNotification } from '../reducers/notificationReducer'

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }


// const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // vote: (state, action) => {
    //   const id = action.payload.id
    //   const anecdote = state.find(a => a.id === id)
    //   const voted = {
    //     ...anecdote,
    //     votes: anecdote.votes + 1
    //   }
    //   return state.map(a => a.id !== id ? a : voted)
    // },
    // create: (state, action) => {
    //   const content = action.payload.content
    //   const newAnecdote = {
    //     content,
    //     id: getId(),
    //     votes: 0
    //   }
    //   return state.concat(newAnecdote)
    // },
    append: (state, action) => state.concat(action.payload),
    set: (state, action) => action.payload
  }
})

export const { set, append } = anecdoteSlice.actions

export const vote = anecdote => {
  return async (dispatch, getState) => {
    const newAnecdote = await anecdoteService.vote(anecdote)
    const state = getState()
    dispatch(set(state.anecdotes.map(a => a.id !== newAnecdote.id ? a : newAnecdote)))
  }
}

export const create = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(append(newAnecdote))
    dispatch(setNotification(`you created '${content}'`, 5))
    // setTimeout(() => {
    //   dispatch(removeNotification(`you created '${content}'`))
    // }, 5000)
  }
}

export const initialize = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(set(anecdotes))
  }
}

export default anecdoteSlice.reducer