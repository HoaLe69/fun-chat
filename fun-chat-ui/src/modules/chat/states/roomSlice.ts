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
    updateRoomUnreadMessage(state, action) {
      const _room = action.payload
      state.rooms = state.rooms.map((room) => {
        if (room?._id === _room?._id) return _room
        return room
      })
    },
    markLatestMessageAsSeen(state, action) {
      const { roomId, status } = action.payload
      const rooms = state.rooms
      state.rooms = rooms.map((room) => {
        if (room._id === roomId) return { ...room, latestMessage: { ...room.latestMessage, status } }
        return room
      })
    },
    updateRoomLatestMessage(state, action) {
      const msg = action.payload
      const rooms = state.rooms
      state.rooms = rooms.map((room) => {
        if (room._id === msg.roomId)
          return {
            ...room,
            latestMessage: msg,
          }
        return room
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchListRoomAsync.fulfilled, (state, action) => {
      state.rooms = action.payload
    })
  },
})

export const roomSelector = {}

export const { selectRoom, addRoom, markLatestMessageAsSeen, markCurrentRoomCreated, updateRoomLatestMessage, updateRoomUnreadMessage } =
  roomSlice.actions

export default roomSlice.reducer

// selector
const selectCurrentRoomId = (state: RootState) => state.room.selectedRoom?._id
const selectCurrentRoomInfo = (state: RootState) => state.room.selectedRoom?.recipientInfo
const selectStatusCurrentRoom = (state: RootState) => state.room.selectedRoom?.new

const selectListRoom = (state: RootState) => state.room.rooms

export { selectListRoom, selectCurrentRoomId, selectCurrentRoomInfo, selectStatusCurrentRoom }
