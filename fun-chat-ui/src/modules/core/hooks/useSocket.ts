import { io } from 'socket.io-client'

export const socket = io('http://localhost:8082', {
  transports: ['websocket'],
})

export const useSocket = () => {
  const emitEvent = (event: string, data: any, ...args: any) => {
    socket.emit(event, data, ...args)
  }

  const subscribeEvent = (event: string, eventHandler: any) => {
    socket.on(event, eventHandler)
  }

  const unSubcribeEvent = (event: string) => {
    socket.off(event)
  }
  return { socket, emitEvent, subscribeEvent, unSubcribeEvent }
}
