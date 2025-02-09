import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}
const AppModal: React.FC<Props> = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
        <div className="fixed inset-0 z-10 w-screen bg-black/20 dark:bg-black/40 backdrop-blur-[10px] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-xl bg-grey-50 dark:bg-grey-900 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
              <DialogTitle as="h3" className="text-base/7 font-medium text-grey-950 dark:text-grey-50">
                {title}
              </DialogTitle>
              {children}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export const AppModalHeadless: React.FC<Props> = ({ isOpen, onClose, children }) => {
  return (
    <Dialog onClose={onClose} open={isOpen} as="div" className="relative z-10 focus:outline-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-10 w-screen bg-black/20 dark:bg-black/40 overflow-y-auto"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel as={motion.div} initial={{ opacity: 0.9, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            {children}
          </DialogPanel>
        </div>
      </motion.div>
    </Dialog>
  )
}

export default AppModal
