import { createSlice } from '@reduxjs/toolkit'
import type { ICommunityStore } from './type'
import { RootState } from 'modules/core/store'

const initialState: ICommunityStore = {
  community: [],
}

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setCommunity(state, action) {
      state.community = action.payload
    },
  },
})

export const { setCommunity } = communitySlice.actions

export const communitySelector = {
  selectCommunity: (state: RootState) => state.community.community,
}

export default communitySlice.reducer
