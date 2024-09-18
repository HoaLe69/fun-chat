import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {
    _id: null,
    display_name: null,
    picture: null,
    email: null,
  },
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
  },
})

export const greet = 'this is test'

export default userSlice.reducer
