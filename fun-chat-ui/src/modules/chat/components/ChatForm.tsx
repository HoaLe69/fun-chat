import React, { useCallback, memo } from 'react'
import classNames from 'classnames'
import { SendIcon, LaughIcon, CloseIcon, PlusCircleIcon, ImageIcon } from 'modules/core/components/icons'

import EmojiPicker from './EmojiPicker'
import Tippy from '@tippyjs/react/headless'
import './MdxEditor.css'
import FilePreview from './FilePreview'
import { useChatForm } from 'modules/chat/hooks'
import MdxEditor from './MdxEditor'
import type { IUser } from '../types'

interface MenuMessageExtraProps {
  children: JSX.Element
  visible: boolean
  onClose: () => void
  onSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const MenuMessageExtra: React.FC<MenuMessageExtraProps> = ({ children, onClose, visible, onSelect }) => (
  <div>
    <Tippy
      interactive
      visible={visible}
      onClickOutside={onClose}
      placement="top-start"
      render={(attrs) => (
        <ul
          {...attrs}
          className="list-none w-40 p-1 rounded-md bg-grey-50 shadow-[0_0_4px_rgba(0,0,0,0.2)] dark:shadow-[0_0_4px_rgba(0,0,0,0.9)] dark:bg-grey-900"
        >
          <li>
            <label
              htmlFor="file"
              className="p-2 flex items-center cursor-pointer rounded-md hover:bg-grey-200 dark:hover:bg-grey-800 "
            >
              <span className="mr-2 inline-block">
                <ImageIcon />
              </span>
              Attach a file
            </label>
            <input
              onChange={onSelect}
              type="file"
              multiple
              id="file"
              accept="image/*, text/*, application/*"
              className="absolute hidden"
            />
          </li>
        </ul>
      )}
    >
      {children}
    </Tippy>
  </div>
)

interface Props {
  chatMembers: Record<string, IUser>
  refContainer: React.RefObject<HTMLDivElement>
}

const ChatForm: React.FC<Props> = ({ chatMembers, refContainer }) => {
  const {
    isSending,
    markdownContent,
    replyMessage,
    visibleMenuMessageExtra,
    visibleEmojiPicker,
    userLoginId,
    fileSelections,
    setFileSelections,
    handleRemoveReplyMessage,
    handleCloseMenuMessageExtra,
    handleFileSelectionAndPreview,
    handleOpenMenuMessageExtra,
    handleSubmit,
    handleEditorChange,
    handleOpenEmojiPicker,
    handleCloseEmojiPicker,
    handleAppendEmojiToMarkdownContent,
  } = useChatForm({ msgContainer: refContainer })

  const renderReplyMessageElement = useCallback(() => {
    return (
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-xl/8 block font-semibold">
            Reply to{' '}
            {replyMessage?.ownerId === userLoginId ? 'yourself' : chatMembers[replyMessage?.ownerId]?.display_name}
          </span>
          <button
            onClick={handleRemoveReplyMessage}
            className="text-xs text-grey-400 p-3 mr-2 hover:bg-grey-200 hover:dark:bg-grey-800 rounded-full cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    )
  }, [replyMessage, userLoginId, chatMembers])

  return (
    <div className={classNames('py-2 px-2', { 'opacity-20': isSending })}>
      {fileSelections.length > 0 && <FilePreview files={fileSelections} setFiles={setFileSelections} />}
      {replyMessage && renderReplyMessageElement()}
      <div className="flex items-end px-3 py-1 bg-zinc-200 dark:bg-zinc-700 rounded-md">
        {/*options menu*/}
        <MenuMessageExtra
          onSelect={handleFileSelectionAndPreview}
          onClose={handleCloseMenuMessageExtra}
          visible={visibleMenuMessageExtra}
        >
          <span onClick={handleOpenMenuMessageExtra} className="text-grey-500 cursor-pointer w-6 h-6  inline-block">
            <PlusCircleIcon className="w-6 h-6" />
          </span>
        </MenuMessageExtra>
        <form className="flex-1 flex gap-2 items-center px-2">
          <MdxEditor
            setFiles={setFileSelections}
            value={markdownContent}
            className="editor"
            onChange={handleEditorChange}
            onSubmit={handleSubmit}
          />
        </form>
        <div className="text-grey-500 relative p-2 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-800">
          <LaughIcon className="cursor-pointer" onClick={handleOpenEmojiPicker} />
          <EmojiPicker
            appendEmojiToText={handleAppendEmojiToMarkdownContent}
            isOpen={visibleEmojiPicker}
            onClose={handleCloseEmojiPicker}
          />
        </div>

        <button
          onClick={handleSubmit}
          className={classNames(
            'w-8 h-8 rounded-full flex items-center justify-center mb-1',
            markdownContent.trim().length === 0 ? 'bg-grey-400 dark:bg-grey-600' : 'bg-blue-500 dark:bg-blue-400',
          )}
        >
          <SendIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default memo(ChatForm)
