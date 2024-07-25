import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user.store'
import roomReducer from './channel.store'
import messageReducer from './message.store'

export const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
    message: messageReducer,
  },
})

// Infer the 'rootstate' and 'Appdispatch' types from the store itself
export type RootState = ReturnType<typeof store.getState>
//Inferred type : {posts :  PostsState , commnets : CommentsState , users : UsersState}
export type AppDispatch = typeof store.dispatch
