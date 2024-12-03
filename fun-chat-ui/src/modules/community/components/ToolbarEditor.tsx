import { EditorView } from '@uiw/react-codemirror'
import Tippy from '@tippyjs/react/headless'
import { useCallback } from 'react'
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  LinkIcon,
  OrderedListIcon,
  UnorderedListIcon,
  CodeIcon,
  CodeBlockIcon,
  ImageAttachmentIcon,
  QouteIcon,
  HeadingIcon,
} from 'modules/core/components/icons'

interface ToolbarButtonProps {
  icon: React.ReactNode
  type: string
  onClick?: () => void
}
const ToolbarButton: React.FC<ToolbarButtonProps> = ({ type, icon, onClick }) => {
  return (
    <Tippy
      render={(attrs) => (
        <div
          className="p-2 text-xs font-semibold text-gray-950 dark:text-gray-50 shadow-xl rounded-md bg-zin-50 dark:bg-zinc-800"
          {...attrs}
        >
          {type}
        </div>
      )}
      placement="bottom"
    >
      <button
        onClick={onClick}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-800"
      >
        {icon}
      </button>
    </Tippy>
  )
}

const ToolbarEditor = ({ view }: { view?: EditorView }) => {
  const applyFormat = useCallback(
    (format: string) => {
      if (!view) return
      const state = view.state
      const dispatch = view.dispatch
      const transaction = view.state.update({
        changes: { from: state.selection.main.from, to: state.selection.main.to, insert: format },
      })

      dispatch(transaction)
    },
    [view],
  )
  const buttons = [
    {
      type: 'Bold',
      icon: <BoldIcon />,
      onClick: () => applyFormat('**'),
    },
    {
      type: 'Italic',
      icon: <ItalicIcon />,
      onClick: () => applyFormat('*'),
    },
    {
      type: 'Strikethrough',
      icon: <StrikethroughIcon />,
      onClick: () => applyFormat('~~'),
    },
    {
      type: 'Heading',
      icon: <HeadingIcon />,
      onClick: () => applyFormat('### '),
    },
    {
      type: 'Bullet List',
      icon: <UnorderedListIcon />,
      onClick: () => applyFormat('- '),
    },
    {
      type: 'Numbered List',
      icon: <OrderedListIcon />,
      onClick: () => applyFormat('1. '),
    },
    {
      type: 'Code',
      icon: <CodeIcon />,
      onClick: () => applyFormat('`'),
    },
    {
      type: 'Code Block',
      icon: <CodeBlockIcon />,
      onClick: () => applyFormat('```'),
    },
    { type: 'Image', icon: <ImageAttachmentIcon /> },
    {
      type: 'Quote',
      icon: <QouteIcon />,
      onClick: () => applyFormat('> '),
    },
    {
      type: 'Link',
      icon: <LinkIcon />,
      onClick: () => applyFormat('[]()'),
    },
  ]

  return (
    <div className="ml-auto flex py-1 pr-1">
      {buttons.map((button) => (
        <ToolbarButton key={button.type} type={button.type} icon={button.icon} onClick={button?.onClick} />
      ))}
    </div>
  )
}

export default ToolbarEditor
