import { Popover, PopoverPanel, PopoverButton } from '@headlessui/react'
import classNames from 'classnames'
import { LaughSmallIcon } from './icons'

const ReactionPicker = (): JSX.Element => {
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
          <PopoverPanel anchor="top" className="shadow-xl rounded-2xl">
            <div className="p-2 rounded-2xl bg-grey-50  dark:bg-grey-900">
              <ul className="flex items-center">
                <li className="reaction_icon">❤️</li>
                <li className="reaction_icon">👍</li>
                <li className="reaction_icon">👎</li>
                <li className="reaction_icon">😂</li>
                <li className="reaction_icon">😮</li>
                <li className="reaction_icon">😞</li>
              </ul>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}
export default ReactionPicker
