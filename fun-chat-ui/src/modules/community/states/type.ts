import type { ICommentCustom } from '../types'

export type ICommentStore = {
  historyComment: {
    status: 'idle' | 'loading' | 'successful' | 'failure'
    data: ICommentCustom[]
  }
}
