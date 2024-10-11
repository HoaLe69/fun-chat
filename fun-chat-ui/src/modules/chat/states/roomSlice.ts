import { createSlice } from '@reduxjs/toolkit'
import { IRoomStore } from './type'
import { RootState } from 'modules/core/store'
import { fetchListRoomAsync } from './roomActions'

const initialState: IRoomStore = { rooms: [] }
const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    selectRoom(state, action) {
      state.selectedRoom = action.payload
    },
    markCurrentRoomCreated(state) {
      if (state?.selectedRoom) state.selectedRoom.new = false
    },
    addRoom(state, action) {
      state.rooms = [...state.rooms, action.payload]
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchListRoomAsync.fulfilled, (state, action) => {
      state.rooms = action.payload
    })
  },
})

export const roomSelector = {}

export const { selectRoom, addRoom, markCurrentRoomCreated } = roomSlice.actions

export default roomSlice.reducer

// selector
const selectCurrentRoomId = (state: RootState) => state.room.selectedRoom?._id
const selectCurrentRoomInfo = (state: RootState) =>
  state.room.selectedRoom?.recipientInfo
const selectStatusCurrentRoom = (state: RootState) =>
  state.room.selectedRoom?.new

const selectListRoom = (state: RootState) => state.room.rooms

export {
  selectListRoom,
  selectCurrentRoomId,
  selectCurrentRoomInfo,
  selectStatusCurrentRoom,
}
