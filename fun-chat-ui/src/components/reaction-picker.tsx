import {
  Popover,
  CloseButton,
  PopoverPanel,
  PopoverButton,
} from '@headlessui/react'
import classNames from 'classnames'
import { LaughSmallIcon } from './icons'

type Props = {
  onReact: (emoji: string) => void
}

const ReactionPicker: React.FC<Props> = ({ onReact }) => {
  const reactIcons = ['❤️', '👍', '👎', '😂', '😮', '😞']

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
                    <li onClick={() => onReact(icon)} className="reaction_icon">
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
