import { io } from 'socket.io-client'

export const socket = io('http://localhost:8082', {
  transports: ['websocket'],
})

type SendMessageProps = {
  destination: string
  data?: any
}
const useSocket = () => {
  const sendMessage = ({ destination, data }: SendMessageProps) => {
    socket.emit(destination, { ...data })
  }
  return { socket, sendMessage }
}

export default useSocket
