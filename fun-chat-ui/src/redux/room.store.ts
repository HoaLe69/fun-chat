// TODO: remove @ts-ignore
// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'
import { fetchListRoomAsync } from 'api/room.api'
import type { UserType } from 'lib/app.type'

const MAXIMUM_ROOM_AMOUNT = 3

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
  selectedRoomList: [],
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
    addSelectedRoomToStack(state, action) {
      const { roomId } = action.payload
      const currentListRoomSelected = state.selectedRoomList
      const isRoomAlreadyExist = currentListRoomSelected.some(
        currentRoomId => currentRoomId === roomId,
      )
      if (isRoomAlreadyExist) return
      if (currentListRoomSelected.length >= MAXIMUM_ROOM_AMOUNT) {
        currentListRoomSelected.shift() // remove first room
        state.selectedRoomList = [...currentListRoomSelected, roomId]
      } else {
        state.selectedRoomList = [...currentListRoomSelected, roomId]
      }
    },
    // detect user is typing
    updateStatusOfLatestMessage(state, action) {
      const _rooms = [...state.fetchList.rooms]
      const { roomId, isTyping, userId } = action.payload
      state.fetchList.rooms = _rooms.map(room => {
        return room?._id === roomId
          ? { ...room, t: { userId, isTyping } }
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
  selectListRoomAlreadyVisited: (state: RootState) =>
    state.room.selectedRoomList,
}
export const {
  selectedRoom,
  selectedRoomId,
  updateLatestMessage,
  updateStatusOfLatestMessage,
  addRoomChat,
  addSelectedRoomToStack,
} = roomSlice.actions

export default roomSlice.reducer
