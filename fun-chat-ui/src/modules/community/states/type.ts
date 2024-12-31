import type { ICommentCustom, ICommunity } from '../types'

export type ICommentStore = {
  historyComment: {
    status: 'idle' | 'loading' | 'successful' | 'failure'
    data: ICommentCustom[]
  }
}

export type ICommunityStore = {
  community: ICommunity[]
}
