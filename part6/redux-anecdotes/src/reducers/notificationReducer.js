import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    set(state, action) {
      return action.payload
    },
    remove(state, action) {
      if (state === action.payload) {
        return ''
      }
      return state
    }
  }
})

const { set, remove } = notificationSlice.actions

export const setNotification = (content, seconds) => {
  return async dispatch => {
    dispatch(set(content))
    setTimeout(() => {
      dispatch(remove(content))
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer