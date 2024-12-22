import { useParams } from 'react-router-dom'
import Image from 'modules/core/components/Image'
import { CommentBoxIcon } from 'modules/core/components/icons'
import { RelationshipButton } from 'modules/community/components/UserInformationCard'
import { useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import Tippy from '@tippyjs/react/headless'
import useSendImmediateMsg from 'modules/community/hooks/useSendImmediateMsg'

const UserProfileHeader = () => {
  const { userId } = useParams()
  const userLoginId = useAppSelector(authSelector.selectUserId)

  const { userInfo, openChatBox, handleOpenChatbox, message, handleChange, handleCloseChatbox, handleSubmitMessage } =
    useSendImmediateMsg(userId)

  return (
    <div>
      <header className="flex items-center gap-4 p-4">
        <Image
          src={userInfo?.picture || ''}
          alt={userInfo?.display_name || ''}
          className="w-20 h-20 rounded-full border-zinc-200 dark:border-zinc-200 border-2"
        />
        <div>
          <h2 className="text-2xl font-bold">{userInfo?.display_name}</h2>
          <p className="text-sm text-gray-600  dark:text-gray-400 font-medium">{userInfo?.email}</p>
        </div>
        {userLoginId !== userId && (
          <div className="ml-auto flex items-center gap-2">
            <RelationshipButton userLoginId={userLoginId} userDestinationId={userInfo?._id} />
            <Tippy
              placement="bottom-end"
              onClickOutside={handleCloseChatbox}
              visible={openChatBox}
              interactive
              render={(attrs) => (
                <div
                  {...attrs}
                  className="flex flex-col gap-2 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                >
                  <form onSubmit={(e: React.FormEvent) => e.preventDefault()} onKeyDown={handleSubmitMessage}>
                    <input
                      className="p-1 outline-none bg-zinc-200 dark:bg-zinc-700"
                      placeholder="Enter your message"
                      value={message}
                      onChange={handleChange}
                      name="message"
                      id="message"
                      {...attrs}
                    />
                  </form>
                </div>
              )}
            >
              <button
                onClick={handleOpenChatbox}
                className="flex items-center gap-2 hover:opacity-80 p-3 py-1 bg-zinc-200 dark:bg-zinc-700 rounded-full text-sm font-semibold"
              >
                <CommentBoxIcon /> Chat
              </button>
            </Tippy>
          </div>
        )}
      </header>
    </div>
  )
}

export default UserProfileHeader
