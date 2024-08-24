import { Popover, PopoverPanel, PopoverButton } from '@headlessui/react'
import { ThreeDotVerticalIcon, TrashIcon, ReplyIcon } from './icons'

import classNames from 'classnames'
const ContextualMenu = () => {
  const classes =
    'flex items-center py-3 px-4 cursor-pointer hover:bg-grey-200 dark:hover:bg-grey-800 '
  return (
    <Popover>
      {({ open }) => (
        <>
          <PopoverButton className="outline-none">
            <span
              className={classNames('btn_icon', {
                '!opacity-100 text-blue-500 dark:text-blue-400 bg-grey-100 dark:bg-grey-900':
                  open,
              })}
            >
              <ThreeDotVerticalIcon />
            </span>
          </PopoverButton>
          <PopoverPanel
            anchor="top start"
            className="[--anchor-gap:10px] shadow-xl rounded-2xl"
          >
            <ul className="bg-grey-50 dark:bg-grey-900 text-grey-950 dark:text-grey-50 w-60 rounded-2xl overflow-hidden">
              <li className={classes}>
                <span className="mr-4">
                  <ReplyIcon />
                </span>
                Reply
              </li>
              <li className={`${classes} text-red-600 rounded-b-2xl`}>
                <span className="mr-4">
                  <TrashIcon />
                </span>
                Delete message
              </li>
            </ul>
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}
export default ContextualMenu
