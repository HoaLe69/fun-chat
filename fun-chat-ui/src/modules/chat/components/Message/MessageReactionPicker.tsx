import { LaughSmallIcon } from 'modules/core/components/icons'
import classNames from 'classnames'
import Tippy from '@tippyjs/react/headless'
import { useCallback, useState } from 'react'
import { useAppSelector, useSocket, useAppDispatch } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import { IMessageReact } from 'modules/chat/types'
import { SOCKET_EVENTS } from 'const'
import { updateMessageReaction } from 'modules/chat/states/messageSlice'
import { useParams } from 'react-router-dom'
import Picker from '@emoji-mart/react'

type Props = {
  messageId?: string
  setContextualMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>
  react?: IMessageReact[]
}

const MessageReactionPicker: React.FC<Props> = ({ messageId, react, setContextualMenuOpen }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const { roomId } = useParams()
  const { emitEvent } = useSocket()
  const userLoginId = useAppSelector(authSelector.selectUserId)
  const dispatch = useAppDispatch()

  const show = () => {
    setVisible(true)
    if (typeof setContextualMenuOpen === 'function') setContextualMenuOpen(true)
  }

  const hide = () => {
    setVisible(false)
    if (typeof setContextualMenuOpen === 'function') setContextualMenuOpen(false)
  }

  const handleDropEmoji = useCallback(
    (emoji: Record<string, string>) => {
      if (!emoji) return
      emitEvent(
        SOCKET_EVENTS.MESSAGE.REACT,
        {
          roomId: roomId,
          msgId: messageId,
          body: {
            ownerId: userLoginId,
            emoji: emoji?.native,
          },
        },
        (response: any) => {
          dispatch(updateMessageReaction({ react: response.react, _id: response._id }))
        },
      )
      hide()
    },
    [userLoginId],
  )

  return (
    <div>
      <Tippy
        onClickOutside={hide}
        interactive
        placement="top-start"
        zIndex={100}
        visible={visible}
        render={(attrs) => (
          <div {...attrs} className="p-2 rounded-2xl bg-grey-50  dark:bg-grey-900 shadow-xl">
            <Picker onEmojiSelect={handleDropEmoji} />
          </div>
        )}
      >
        <button
          onClick={show}
          className={classNames(
            'w-7 h-7 rounded-full flex items-center justify-center text-grey-500  hover:bg-grey-200 hover:dark:bg-grey-800',
            {
              'bg-grey-200 dark:bg-grey-800 !text-blue-500 dark:text-blue-400': visible,
            },
          )}
        >
          <LaughSmallIcon />
        </button>
      </Tippy>
    </div>
  )
}
export default MessageReactionPicker
