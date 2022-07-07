import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import blogReducer from './reducers/blogReducer'
import successNotificationReducer from './reducers/successNotificationReducer'
import errorNotificationReducer from './reducers/errorNotificationReducer'

// Redux-store, jossa kullakin kentällä on oma reducer.
export const store = configureStore({
  reducer: {
    user: userReducer,
    blogs: blogReducer,
    successNotification: successNotificationReducer,
    errorNotification: errorNotificationReducer,
  }
})