import { Wrapper } from 'modules/core/components/menus'
import {
  ThreeDotVerticalIcon,
  TrashIcon,
  ReplyIcon,
} from 'modules/core/components/icons'
import { useState } from 'react'
import { AppModal } from 'modules/core/components'
import { Button } from 'modules/core/components'

type Props = {
  onRecall: () => void
  isCurrentUser: boolean
}
const ContextualMenu: React.FC<Props> = ({ onRecall, isCurrentUser }) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  const onClose = () => {
    setShowModal(false)
  }

  const classes =
    'flex items-center py-3 px-4 cursor-pointer hover:bg-grey-200 dark:hover:bg-grey-800 '
  return (
    <>
      <Wrapper anchor="bottom start" icon={<ThreeDotVerticalIcon />}>
        <ul className="bg-grey-50 dark:bg-grey-900 text-grey-950 dark:text-grey-50 w-60 rounded-2xl overflow-hidden">
          <li className={classes}>
            <span className="mr-4">
              <ReplyIcon />
            </span>
            Reply
          </li>
          {isCurrentUser && (
            <li
              onClick={() => setShowModal(true)}
              className={`${classes} text-red-600 rounded-b-2xl`}
            >
              <span className="mr-4">
                <TrashIcon />
              </span>
              Delete message
            </li>
          )}
        </ul>
      </Wrapper>
      <AppModal isOpen={showModal} onClose={onClose} title="Delete Message">
        <p className="mt-2 text-grey-950 dark:text-grey-50">
          Are you sure you want to permanently delete this message
        </p>
        <div className="flex items-center justify-end py-2">
          <Button title="Cancel" textBold onClick={onClose} />
          <Button title="DELETE" textBold onClick={onRecall} />
        </div>
      </AppModal>
    </>
  )
}
export default ContextualMenu
