import { configureStore } from '@reduxjs/toolkit'
import successNotificationReducer from './reducers/successNotificationReducer'
import errorNotificationReducer from './reducers/errorNotificationReducer'

// Redux-store, jossa kullakin kentällä on oma reducer.
export const store = configureStore({
  reducer: {
    successNotification: successNotificationReducer,
    errorNotification: errorNotificationReducer,
  }
})