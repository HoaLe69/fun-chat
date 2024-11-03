import { useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import classNames from 'classnames'
import { UserAvatar } from 'modules/core/components'
import type { IMessageReact } from 'modules/chat/types'
import { useCallback, useMemo, useState } from 'react'
import { selectCurrentRoomInfo } from 'modules/chat/states/roomSlice'
import { groupReactionByEmoji } from 'modules/chat/utils/message'

type Props = {
  onClose: () => void
  initialTab: string
  react?: IMessageReact[]
}

const MessageReactionModal: React.FC<Props> = ({ onClose, react, initialTab }) => {
  const [activeEmojiTab, setActiveEmojiTab] = useState(initialTab)
  const userLogin = useAppSelector(authSelector.selectUser)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)

  const tabList = useMemo(() => {
    if (!react) return []
    return groupReactionByEmoji(react)
  }, [react])

  const tabPanel = useMemo(() => {
    const currTab = tabList.find((tab) => tab.emoji === activeEmojiTab)
    if (currTab) return currTab.ownerIds
    return []
  }, [activeEmojiTab, tabList])

  const handleActiveEmojiTab = useCallback((emoji: string) => {
    setActiveEmojiTab(emoji)
  }, [])

  return (
    <div className="fixed inset-0 z-10">
      <div onClick={onClose} className="bg-black/80 w-full h-full flex items-center justify-center">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[500px] h-[440px] flex items-center rounded-md overflow-hidden animate-zoom"
        >
          <div className="cursor-pointer p-2 w-24 bg-secondary-bg-light dark:bg-secondary-bg-dark h-full">
            <ul>
              {tabList.map((tab) => (
                <li
                  onClick={() => handleActiveEmojiTab(tab.emoji)}
                  key={tab.emoji}
                  className={classNames(
                    'dark:hover:bg-zinc-700/80  hover:bg-zinc-200 flex items-center px-1 mb-1 justify-center rounded-md',
                    {
                      ' dark:bg-grey-800 bg-grey-300 pointer-events-none': activeEmojiTab === tab.emoji,
                    },
                  )}
                >
                  <span className="inline-block p-1">{tab.emoji}</span>
                  <span className="font-medium">{tab.amount}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-main-bg-light dark:bg-main-bg-dark h-full">
            <ul>
              {tabPanel.map((p) => {
                let picture
                let display_name
                if (p === userLogin?._id) {
                  picture = userLogin.picture
                  display_name = userLogin.display_name
                } else {
                  picture = roomSelectedInfo?.picture
                  display_name = roomSelectedInfo?.name
                }
                return (
                  <li
                    key={p}
                    className="flex h-11 items-center border-b dark:border-zinc-700 border-zinc-200 ml-3 mr-1"
                  >
                    <UserAvatar className="!w-[24px] !h-[24px]" src={picture || ''} alt={display_name || ''} />
                    <span className="ml-3 inline-block">{display_name}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageReactionModal
