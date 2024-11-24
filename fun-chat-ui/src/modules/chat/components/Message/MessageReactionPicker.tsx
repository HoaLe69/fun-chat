import { CloseButton } from '@headlessui/react'
import { LaughSmallIcon } from 'modules/core/components/icons'
import classNames from 'classnames'
import Tippy from '@tippyjs/react/headless'
import { useCallback, useMemo, useState } from 'react'
import { useAppSelector, useSocket } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import { selectCurrentRoomId } from 'modules/chat/states/roomSlice'
import { IMessageReact } from 'modules/chat/types'

type Props = {
  messageId?: string
  setContextualMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>
  react?: IMessageReact[]
}

const MessageReactionPicker: React.FC<Props> = ({ messageId, react, setContextualMenuOpen }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const { emitEvent } = useSocket()
  const userLogin = useAppSelector(authSelector.selectUser)
  const roomSelectedId = useAppSelector(selectCurrentRoomId)
  const reactIcons = ['❤️', '👍', '👎', '😂', '😮', '😞']

  const show = () => {
    setVisible(true)
    if (typeof setContextualMenuOpen === 'function') setContextualMenuOpen(true)
  }

  const hide = () => {
    setVisible(false)
    if (typeof setContextualMenuOpen === 'function') setContextualMenuOpen(false)
  }

  const userReaction = useMemo(() => {
    return react?.find((r) => r.ownerId === userLogin?._id)
  }, [react])

  const handleDropEmoji = useCallback((emoji: string) => {
    if (!emoji) return
    emitEvent('chat:messageActions', {
      type: 'reaction',
      roomId: roomSelectedId,
      msgId: messageId,
      body: {
        ownerId: userLogin?._id,
        emoji,
      },
    })
    hide()
  }, [])

  return (
    <div>
      <Tippy
        onClickOutside={hide}
        interactive
        visible={visible}
        render={(attrs) => (
          <div {...attrs} className="p-2 rounded-2xl bg-grey-50  dark:bg-grey-900 shadow-xl">
            <ul className="flex items-center">
              {reactIcons.map((icon) => (
                <CloseButton
                  key={icon}
                  onClick={() => {
                    handleDropEmoji(icon)
                  }}
                >
                  <li
                    className={classNames('reaction_icon', {
                      'bg-blue-100 dark:bg-blue-900': userReaction?.emoji === icon,
                    })}
                  >
                    {icon}
                  </li>
                </CloseButton>
              ))}
            </ul>
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
