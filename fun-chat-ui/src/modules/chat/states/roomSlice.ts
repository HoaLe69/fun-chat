import { createSlice } from '@reduxjs/toolkit'
import { IRoomStore } from './type'
import { RootState } from 'modules/core/store'

const initialState: IRoomStore = {}
const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    selectRoom(state, action) {
      state.selectedRoom = action.payload
    },
  },
  extraReducers(builder) {},
})

export const roomSelector = {}

export const { selectRoom } = roomSlice.actions

export default roomSlice.reducer

// selector
const selectCurrentRoomId = (state: RootState) => state.room.selectedRoom?._id
const selectCurrentRoomInfo = (state: RootState) =>
  state.room.selectedRoom?.info

export { selectCurrentRoomId, selectCurrentRoomInfo }
