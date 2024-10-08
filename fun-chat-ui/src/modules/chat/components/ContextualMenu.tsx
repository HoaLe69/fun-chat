import {
  ThreeDotVerticalIcon,
  TrashIcon,
  ReplyIcon,
} from 'modules/core/components/icons'
import { useState } from 'react'
import { Button, AppModal } from 'modules/core/components'
import classNames from 'classnames'
import Tippy from '@tippyjs/react/headless'

type Props = {
  setContextualMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const ContextualMenu: React.FC<Props> = ({ setContextualMenuOpen }) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  const show = () => {
    setVisible(true)
    setContextualMenuOpen(true)
  }
  const hide = () => {
    setVisible(false)
    setContextualMenuOpen(false)
  }
  const onClose = () => {
    setShowModal(false)
  }

  const classes =
    'flex items-center py-3 px-4 cursor-pointer hover:bg-grey-200 dark:hover:bg-grey-800 '
  return (
    <>
      <div>
        <Tippy
          interactive
          visible={visible}
          onClickOutside={hide}
          render={attrs => (
            <ul
              {...attrs}
              className="bg-grey-50 dark:bg-grey-900 text-grey-950 dark:text-grey-50 w-60 rounded-2xl overflow-hidden shadow-xl"
            >
              <li className={classes} onClick={hide}>
                <span className="mr-4">
                  <ReplyIcon />
                </span>
                Reply
              </li>
              <li
                onClick={() => {
                  setShowModal(true)
                  hide()
                }}
                className={`${classes} text-red-600 rounded-b-2xl`}
              >
                <span className="mr-4">
                  <TrashIcon />
                </span>
                Delete message
              </li>
            </ul>
          )}
        >
          <button
            onClick={show}
            className={classNames(
              'w-9 h-9 rounded-full flex items-center justify-center text-grey-500 hover:bg-grey-200 hover:dark:bg-grey-800',
              {
                'bg-grey-200 dark:bg-grey-800 !text-blue-500 dark:text-blue-400':
                  visible,
              },
            )}
          >
            <ThreeDotVerticalIcon />
          </button>
        </Tippy>
      </div>
      <AppModal isOpen={showModal} onClose={onClose} title="Delete Message">
        <p className="mt-2 text-grey-950 dark:text-grey-50">
          Are you sure you want to permanently delete this message
        </p>
        <div className="flex items-center justify-end py-2">
          <Button title="Cancel" textBold onClick={onClose} />
          <Button title="DELETE" textBold />
        </div>
      </AppModal>
    </>
  )
}
export default ContextualMenu
