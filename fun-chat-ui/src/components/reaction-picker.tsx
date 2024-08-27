import {
  Popover,
  CloseButton,
  PopoverPanel,
  PopoverButton,
} from '@headlessui/react'
import classNames from 'classnames'
import { LaughSmallIcon } from './icons'
import useSocket from 'hooks/useSocket'
import { apiClient } from 'api/apiClient'

type Props = {
  messageId?: string
  createdAt?: string
  roomId: string | null
  userLoginId: string | null
  recipientId: string | null
}

const ReactionPicker: React.FC<Props> = ({
  roomId,
  messageId,
  userLoginId,
}) => {
  const reactIcons = ['❤️', '👍', '👎', '😂', '😮', '😞']
  const { sendMessage } = useSocket()
  const updateMessage = async (icon: string) => {
    try {
      await apiClient.patch(`/message/react/${messageId}`, {
        react: {
          ownerId: userLoginId,
          emoji: icon,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }
  const handleReactMessage = async (icon: string) => {
    if (!icon) return

    await updateMessage(icon)
    sendMessage({
      destination: 'chat:sendReactIcon',
      data: {
        icon,
        roomId,
        messageId,
        ownerId: userLoginId,
      },
    })
  }

  return (
    <Popover>
      {({ open }) => (
        <>
          <PopoverButton autoFocus className="outline-none">
            <span
              className={classNames('btn_icon', {
                '!opacity-100 text-blue-500 dark:text-blue-400 bg-grey-100 dark:bg-grey-900':
                  open,
              })}
            >
              <LaughSmallIcon />
            </span>
          </PopoverButton>
          <PopoverPanel
            anchor="top"
            className=" [--anchor-gap:10px] shadow-xl mb-9 rounded-2xl"
          >
            <div className="p-2 rounded-2xl bg-grey-50  dark:bg-grey-900">
              <ul className="flex items-center">
                {reactIcons.map(icon => (
                  <CloseButton key={icon}>
                    <li
                      onClick={() => handleReactMessage(icon)}
                      className="reaction_icon"
                    >
                      {icon}
                    </li>
                  </CloseButton>
                ))}
              </ul>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}
export default ReactionPicker
