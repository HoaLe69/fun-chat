import { IConversation, IMessage } from '../types'
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

export type IMessageStore = {
  historyMsgs: {
    status: 'idle' | 'loading' | 'successful' | 'failure'
    msgs: IMessage[]
  }
  replyMsg?: {
    _id: string
    ownerId: string
    content: string
  }
}
