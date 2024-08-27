import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Button from './button'
type Props = {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  callback?: () => void
}
const AppModal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  message,
  callback,
}) => {
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={onClose}
      >
        <div className="fixed inset-0 z-10 w-screen bg-black/20 dark:bg-black/40 backdrop-blur-[10px] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-xl bg-grey-50 dark:bg-grey-900 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-grey-950 dark:text-grey-50"
              >
                {title}
              </DialogTitle>
              <p className="mt-2 text-grey-950 dark:text-grey-50">{message}</p>
              <div className="flex items-center justify-end py-2">
                <Button title="Cancel" textBold onClick={onClose} />
                <Button title="DELETE" textBold onClick={callback} />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default AppModal
