import { ThreeDotVerticalIcon, TrashIcon, ReplyIcon } from 'modules/core/components/icons'
import { useCallback, useState } from 'react'
import { Button, AppModal } from 'modules/core/components'
import { useAppDispatch, useSocket } from 'modules/core/hooks'
import classNames from 'classnames'
import Tippy from '@tippyjs/react/headless'
import { removeMessage, replyMessage, removeReplyMessage } from 'modules/chat/states/messageSlice'
import type { IMessage } from 'modules/chat/types'
import { useParams } from 'react-router-dom'
import { SOCKET_EVENTS } from 'const'

type Props = {
  setContextualMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>
  message?: IMessage
  allowDel?: boolean
}
const MessageActionsMenu: React.FC<Props> = ({ allowDel, message, setContextualMenuOpen }) => {
  const { roomId } = useParams()
  const { emitEvent } = useSocket()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const show = () => {
    setVisible(true)
    if (typeof setContextualMenuOpen === 'function') setContextualMenuOpen(true)
  }
  const hide = () => {
    setVisible(false)
    if (typeof setContextualMenuOpen === 'function') setContextualMenuOpen(false)
  }
  const onClose = () => {
    setShowModal(false)
  }

  const handleReplyMessage = useCallback(() => {
    if (!message?._id || !message?.content) return
    dispatch(replyMessage(message))
    hide()
  }, [message])

  const handleRemoveMessage = useCallback(() => {
    if (!message?._id || !allowDel) return
    emitEvent(
      SOCKET_EVENTS.MESSAGE.DELETE,
      {
        msgId: message?._id,
        roomId,
      },
      (response: any) => {
        dispatch(removeMessage(response))
        if (response?.replyBy?.length) dispatch(removeReplyMessage(response?.replyBy))
      },
    )
  }, [allowDel, message])

  const classes = 'flex items-center py-3 px-4 cursor-pointer hover:bg-grey-200 dark:hover:bg-grey-800 '
  return (
    <>
      <div>
        <Tippy
          interactive
          visible={visible}
          onClickOutside={hide}
          render={(attrs) => (
            <ul
              {...attrs}
              className="bg-grey-50 dark:bg-grey-900 text-grey-950 dark:text-grey-50 w-60 rounded-2xl overflow-hidden shadow-xl"
            >
              <li className={classes} onClick={handleReplyMessage}>
                <span className="mr-4">
                  <ReplyIcon />
                </span>
                Reply
              </li>
              {allowDel && (
                <li
                  onClick={() => {
                    setShowModal(true)
                    hide()
                  }}
                  className={`${classes} text-red-600 rounded-b-2xl`}
                >
                  <span className="mr-4">
                    <TrashIcon />
                  </span>
                  Delete message
                </li>
              )}
            </ul>
          )}
        >
          <button
            onClick={show}
            className={classNames(
              'w-7 h-7 rounded-full flex items-center justify-center text-grey-500 hover:bg-grey-200 hover:dark:bg-grey-800',
              {
                'bg-grey-200 dark:bg-grey-800 !text-blue-500 dark:text-blue-400': visible,
              },
            )}
          >
            <ThreeDotVerticalIcon />
          </button>
        </Tippy>
      </div>
      <AppModal isOpen={showModal} onClose={onClose} title="Delete Message">
        <p className="mt-2 text-grey-950 dark:text-grey-50">Are you sure you want to permanently delete this message</p>
        <div className="flex items-center justify-end py-2">
          <Button title="Cancel" textBold onClick={onClose} />
          <Button title="DELETE" textBold onClick={handleRemoveMessage} />
        </div>
      </AppModal>
    </>
  )
}
export default MessageActionsMenu
