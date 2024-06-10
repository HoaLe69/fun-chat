import { Popover, PopoverPanel, PopoverButton } from '@headlessui/react'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { LaughSmallIcon } from './icons'

const ReactionPicker = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <div>
      <Popover>
        {({ open }) => (
          <>
            <PopoverButton autoFocus>
              <span
                className={classNames('btn_icon', {
                  '!opacity-100 !outline-none': open,
                })}
              >
                <LaughSmallIcon />
              </span>
            </PopoverButton>
            <PopoverPanel anchor="top" className="shadow-xl">
              <div className="p-2 rounded-2xl bg-grey-50   dark:bg-grey-900 dark:bg-grey-900">
                <ul className="flex items-center">
                  <li className="reaction_icon">❤️</li>
                  <li className="reaction_icon">👍</li>
                  <li className="reaction_icon">👍 </li>
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
    </div>
  )
}
export default ReactionPicker
