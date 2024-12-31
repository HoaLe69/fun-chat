import { configureStore } from '@reduxjs/toolkit'
import authReducer from 'modules/auth/states/authSlice'
import messageReducer from 'modules/chat/states/messageSlice'
import roomReducer from 'modules/chat/states/roomSlice'
import userReducer from 'modules/user/states/userSlice'
import commentReducer from 'modules/community/states/commentSlice'
import communityReducer from 'modules/community/states/communitySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    message: messageReducer,
    room: roomReducer,
    comment: commentReducer,
    community: communityReducer,
  },
})

// Infer the 'rootstate' and 'Appdispatch' types from the store itself
export type RootState = ReturnType<typeof store.getState>
//Inferred type : {posts :  PostsState , commnets : CommentsState , users : UsersState}
export type AppDispatch = typeof store.dispatch
