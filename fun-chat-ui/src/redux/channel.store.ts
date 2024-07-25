import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'
import { createRoomAsync, fetchListRoomAsync } from '../api/room.api'

const initialState = {
  create: {
    loading: false,
    room: {
      _id: null,
    },
  },
  fetchList: {
    loading: false,
    rooms: [],
  },
  selectedRoom: {
    id: null,
    partnerId: null,
  },
}

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    selectRoom: (state, action) => {
      ;(state.selectedRoom.id = action.payload.id),
        (state.selectedRoom.partnerId = action.payload.partnerId)
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
}
export const { selectRoom } = roomSlice.actions

export default roomSlice.reducer
