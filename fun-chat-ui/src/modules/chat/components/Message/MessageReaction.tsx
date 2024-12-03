import { useCallback, useState } from 'react'
import type { MessageSectionProps } from './type'
import { groupReactionByEmoji } from 'modules/chat/utils/message'
import MessageReactionModal from './MessageReactionModal'

const MessageReaction: React.FC<MessageSectionProps> = ({ react }) => {
  const [reactionListModal, setReactionListModal] = useState({
    visible: false,
    activeEmoji: '',
  })

  const handleCloseMessageReactionListModal = useCallback(() => {
    setReactionListModal({ visible: false, activeEmoji: '' })
  }, [])

  const handleOpenMessageReactionListModal = useCallback((emoji: string) => {
    setReactionListModal({ visible: true, activeEmoji: emoji })
  }, [])

  return (
    <>
      <ul className="flex flex-wrap items-center gap-2 list-none">
        {groupReactionByEmoji(react || []).map((r) => (
          <li
            key={r.emoji}
            onClick={() => handleOpenMessageReactionListModal(r.emoji)}
            className="p-1 dark:bg-secondary-bg-dark bg-secondary-bg-light rounded-md text-xs cursor-pointer border border-transparent dark:hover:border-zinc-700 hover:border-zinc-200"
          >
            {r.emoji} {r.amount > 0 ? r.amount : ''}
          </li>
        ))}
      </ul>
      {reactionListModal.visible && (
        <MessageReactionModal
          onClose={handleCloseMessageReactionListModal}
          initialTab={reactionListModal.activeEmoji}
          react={react}
        />
      )}
    </>
  )
}
export default MessageReaction
