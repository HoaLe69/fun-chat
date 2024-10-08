import { CloseButton } from '@headlessui/react'
import { LaughSmallIcon } from 'modules/core/components/icons'
import classNames from 'classnames'
import Tippy from '@tippyjs/react/headless'
import { useState } from 'react'

type Props = {
  setContextualMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ReactionPicker: React.FC<Props> = ({ setContextualMenuOpen }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const reactIcons = ['❤️', '👍', '👎', '😂', '😮', '😞']

  const show = () => {
    setVisible(true)
    setContextualMenuOpen(true)
  }

  const hide = () => {
    setVisible(false)
    setContextualMenuOpen(false)
  }

  return (
    <Tippy
      onClickOutside={hide}
      interactive
      visible={visible}
      render={attrs => (
        <div
          {...attrs}
          className="p-2 rounded-2xl bg-grey-50  dark:bg-grey-900 shadow-xl"
        >
          <ul className="flex items-center">
            {reactIcons.map(icon => (
              <CloseButton key={icon} onClick={hide}>
                <li className="reaction_icon">{icon}</li>
              </CloseButton>
            ))}
          </ul>
        </div>
      )}
    >
      <button
        onClick={show}
        className={classNames(
          'w-9 h-9 rounded-full flex items-center justify-center text-grey-500  hover:bg-grey-200 hover:dark:bg-grey-800',
          {
            'bg-grey-200 dark:bg-grey-800 !text-blue-500 dark:text-blue-400':
              visible,
          },
        )}
      >
        <LaughSmallIcon />
      </button>
    </Tippy>
  )
}
export default ReactionPicker
