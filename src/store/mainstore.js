import { createSlice } from '@reduxjs/toolkit'
import { io } from "socket.io-client"

export const mainstore = createSlice({
  name: 'mainstore',
  initialState: {
    nickname:null,
    roomid:null,
    team:null,
    host:null,
  },
  reducers: {
    update_nickname: (state, action) => {
      state.nickname=action.payload
    },
    update_roomid(state,action){
      state.roomid=action.payload
  },
  update_team(state,action){
    state.team=action.payload
  },
  update_host(state,action){
    state.host=action.payload
  }
  },
})

// Action creators are generated for each case reducer function
export const { update_nickname, update_roomid, update_team,update_host } = mainstore.actions

export default mainstore.reducer