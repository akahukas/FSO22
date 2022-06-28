import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Default notification'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.notification
    }
  }
})

export const { setNotification } = notificationSlice.actions
export default notificationSlice.reducer