import { io } from 'socket.io-client'

export const socket = io('http://localhost:8082', {
  transports: ['websocket'],
})
