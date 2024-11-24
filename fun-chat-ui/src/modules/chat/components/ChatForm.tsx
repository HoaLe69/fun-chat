import React, { useCallback, memo } from 'react'
import classNames from 'classnames'
import { SendIcon, LaughIcon, CloseIcon, PlusCircleIcon, ImageIcon } from 'modules/core/components/icons'

import EmojiPicker from './EmojiPicker'
import Tippy from '@tippyjs/react/headless'
import './MdxEditor.css'
import FilePreview from './FilePreview'
import { useChatForm } from 'modules/chat/hooks'
import MdxEditor from './MdxEditor'

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
          className="w-40 p-1 rounded-md bg-grey-50 shadow-[0_0_4px_rgba(0,0,0,0.2)] dark:shadow-[0_0_4px_rgba(0,0,0,0.9)] dark:bg-grey-900"
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

const ChatForm: React.FC = () => {
  const {
    markdownContent,
    replyMessage,
    visibleMenuMessageExtra,
    visibleEmojiPicker,
    userLogin,
    roomSelectedInfo,
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
  } = useChatForm()

  const renderReplyMessageContent = useCallback(() => {
    if (replyMessage?.content.text) return replyMessage.content.text
    if (!replyMessage?.content.text && replyMessage?.content.images) return 'image'
    if (!replyMessage?.content.text && replyMessage?.content.links) return 'link'
  }, [replyMessage])

  const renderReplyMessageElement = useCallback(() => {
    return (
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-xl/8 block font-semibold">
            Reply to {replyMessage?.ownerId === userLogin?._id ? 'yourself' : roomSelectedInfo?.name}
          </span>
          <button
            onClick={handleRemoveReplyMessage}
            className="text-xs text-grey-400 p-3 mr-2 hover:bg-grey-200 hover:dark:bg-grey-800 rounded-full cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>
        <p className="truncate text-sm text-grey-500">{renderReplyMessageContent()}</p>
      </div>
    )
  }, [replyMessage])

  return (
    <div className="bg-transparent py-2 px-2">
      {fileSelections.length > 0 && <FilePreview files={fileSelections} setFiles={setFileSelections} />}
      {replyMessage && renderReplyMessageElement()}
      <div className="flex items-center px-3 py-1 bg-zinc-300 dark:bg-zinc-700 rounded-md">
        {/*options menu*/}
        <MenuMessageExtra
          onSelect={handleFileSelectionAndPreview}
          onClose={handleCloseMenuMessageExtra}
          visible={visibleMenuMessageExtra}
        >
          <span onClick={handleOpenMenuMessageExtra} className="text-grey-500 cursor-pointer">
            <PlusCircleIcon />
          </span>
        </MenuMessageExtra>
        <form className="flex-1 flex gap-2 items-center px-2">
          <MdxEditor value={markdownContent} className="editor" onChange={handleEditorChange} onSubmit={handleSubmit} />
          <span className="text-grey-500 relative">
            <LaughIcon className="cursor-pointer" onClick={handleOpenEmojiPicker} />
            <EmojiPicker
              appendEmojiToText={handleAppendEmojiToMarkdownContent}
              isOpen={visibleEmojiPicker}
              onClose={handleCloseEmojiPicker}
            />
          </span>
        </form>
        <button
          //          onClick={handleSubmit}
          className={classNames(
            'w-10 h-10 rounded-full inline-flex items-center justify-center',
            markdownContent.trim().length === 0 ? 'bg-grey-400 dark:bg-grey-600' : 'bg-blue-500 dark:bg-blue-400',
          )}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  )
}

export default memo(ChatForm)
