// TODO: remove @ts-ignore
// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'
import { fetchListRoomAsync } from 'api/room.api'
import type { UserType } from 'lib/app.type'

const initialState = {
  fetchList: {
    loading: false,
    rooms: [],
  },
  selectedRoom: {
    id: null,
    recipient: {
      _id: null,
      display_name: null,
      picture: null,
      email: null,
    },
  },
}

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    selectedRoom: (state, action) => {
      const { roomId, recipient } = action.payload
      state.selectedRoom.id = roomId
      state.selectedRoom.recipient = recipient
    },
    selectedRoomId: (state, action) => {
      state.selectedRoom.id = action.payload
    },
    // TODO: remove @ts-ignore
    updateLatestMessage: (state, action) => {
      const _rooms = [...state.fetchList.rooms]
      const { roomId, latestMessage } = action.payload
      // @ts-ignore
      state.fetchList.rooms = _rooms.map(room => {
        // @ts-ignore
        return room?._id === roomId ? { ...room, latestMessage } : room
      })
    },
    addRoomChat(state, action) {
      state.fetchList.rooms = [action.payload, ...state.fetchList.rooms]
    },
    // detect user is typing
    updateStatusRoom(state, action) {
      const _rooms = [...state.fetchList.rooms]
      const { room_id, isTyping, userId } = action.payload
      state.fetchList.rooms = _rooms.map(room => {
        return room?._id === room_id
          ? { ...room, status: { userId, isTyping } }
          : room
      })
    },
  },
  extraReducers(builder) {
    builder
      // fetch list room by your login id
      .addCase(fetchListRoomAsync.pending, state => {
        state.fetchList.loading = true
      })
      .addCase(fetchListRoomAsync.fulfilled, (state, action) => {
        state.fetchList.loading = false
        state.fetchList.rooms = action.payload
      })
      .addCase(fetchListRoomAsync.rejected, state => {
        state.fetchList.loading = false
      })
  },
})

export const roomSelector = {
  selectCreateRoomLoading: (state: RootState) => state.room.create.loading,
  selectCreatedRoom: (state: RootState) => state.room.create.room,
  selectListRooms: (state: RootState) => state.room.fetchList.rooms,
  selectListRoomsLoading: (state: RootState) => state.room.fetchList.loading,
  selectRoomId: (state: RootState) => state.room.selectedRoom.id,
  selectRoomRecipient: (state: RootState) => state.room.selectedRoom.recipient,
}
export const {
  selectedRoom,
  selectedRoomId,
  updateLatestMessage,
  updateStatusRoom,
  addRoomChat,
} = roomSlice.actions

export default roomSlice.reducer
