// TODO: remove @ts-ignore
// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'
import { createRoomAsync, fetchListRoomAsync } from 'api/room.api'

const initialState = {
  create: {
    loading: false,
    room: {
      _id: null,
      members: [],
    },
  },
  fetchList: {
    loading: false,
    rooms: [],
  },
  selectedRoom: {
    id: null,
    partnerId: null,
    type: null,
  },
}

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    selectRoom: (state, action) => {
      const { type, roomId, partnerId } = action.payload
      state.selectedRoom.id = roomId
      state.selectedRoom.partnerId = partnerId
      state.selectedRoom.type = type
    },
    // TODO: remove @ts-ignore
    updateLatestMessage: (state, action) => {
      const _rooms = [...state.fetchList.rooms]
      const { room_id, latest_message } = action.payload
      // @ts-ignore
      state.fetchList.rooms = _rooms.map(room => {
        // @ts-ignore
        return room?._id === room_id ? { ...room, latest_message } : room
      })
    },
    // detect user is typing
    updateStatusRoom: (state, action) => {
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
      .addCase(createRoomAsync.pending, state => {
        state.create.loading = true
      })
      .addCase(createRoomAsync.fulfilled, (state, action) => {
        state.create.loading = false
        state.create.room = action.payload
      })
      .addCase(createRoomAsync.rejected, state => {
        state.create.loading = false
      })
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
  selectRoomPartnerId: (state: RootState) => state.room.selectedRoom.partnerId,
  selectRoomType: (state: RootState) => state.room.selectedRoom.type,
}
export const { selectRoom, updateLatestMessage, updateStatusRoom } =
  roomSlice.actions

export default roomSlice.reducer
