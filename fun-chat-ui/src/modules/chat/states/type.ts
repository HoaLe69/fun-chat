import { IConversation } from '../types'
export type IRoomStore = {
  rooms: IConversation[]
  selectedRoom?: {
    _id: string
    new?: boolean
    recipientInfo: {
      _id: string
      name: string
      picture: string
    }
  }
}
