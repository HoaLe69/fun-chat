import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'modules/core/store'
import { fetchListRoomAsync } from 'modules/chat/states/roomActions'

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
    latestMessage: {
      text: null,
      createdAt: null,
    },
  },
  selectedRoomList: [],
}

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    quitSelectedRoom: state => {
      state.selectedRoom.id = null
      state.selectedRoom.recipient = null
    },
    selectedRoom: (state, action) => {
      const { roomId, recipient, latestMessage } = action.payload
      state.selectedRoom.id = roomId
      state.selectedRoom.recipient = recipient
      state.selectedRoom.latestMessage = latestMessage
    },
    selectedRoomId: (state, action) => {
      state.selectedRoom.id = action.payload
    },
    updateLatestMessage: (state, action) => {
      const { roomId, latestMessage } = action.payload
      state.selectedRoom.latestMessage = latestMessage
      const _room = state.fetchList.rooms.map(room => {
        return room?._id === roomId ? { ...room, latestMessage } : room
      })

      state.fetchList.rooms = _room.sort((roomA, roomB) => {
        const lstMsgTimeA = roomA.latestMessage.createdAt
        const lstMsgTimeB = roomB.latestMessage.createdAt
        if (lstMsgTimeA > lstMsgTimeB) return -1
        if (lstMsgTimeA < lstMsgTimeB) return 1
        return 0
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
  selectListRooms: (state: RootState) => state.room.fetchList.rooms,
  selectListRoomsLoading: (state: RootState) => state.room.fetchList.loading,
  selectRoomId: (state: RootState) => state.room.selectedRoom.id,
  selectRoomRecipient: (state: RootState) => state.room.selectedRoom.recipient,
  selectListRoomAlreadyVisited: (state: RootState) =>
    state.room.selectedRoomList,
  selectLatestMessageOfSelectdRoom: (state: RootState) =>
    state.room.selectedRoom.latestMessage,
}
export const {
  selectedRoom,
  selectedRoomId,
  quitSelectedRoom,
  updateLatestMessage,
  updateStatusOfLatestMessage,
  addRoomChat,
  addSelectedRoomToStack,
} = roomSlice.actions

export default roomSlice.reducer
