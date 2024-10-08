import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react'
import { ReactNode, Fragment } from 'react'
import classNames from 'classnames'

type Props = {
  icon: ReactNode
  children: ReactNode
  transition?: boolean
  anchor: 'bottom start' | 'bottom end'
}

const Wrapper: React.FC<Props> = ({ icon, transition, anchor, children }) => {
  const WrapperContentMenu = ({ children }: { children: ReactNode }) =>
    transition ?
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {children}
      </Transition>
    : <Fragment>{children}</Fragment>
  return (
    <Menu>
      <MenuButton className="w-11 h-11">
        {({ active }) => (
          <span
            className={classNames(
              'w-full h-full rounded-full flex items-center justify-center text-gray-500',
              {
                'bg-grey-200 dark:bg-grey-800 !text-blue-500 dark:text-blue-400':
                  active,
              },
            )}
          >
            {icon}
          </span>
        )}
      </MenuButton>
      <WrapperContentMenu>
        <MenuItems
          anchor={anchor}
          className="w-menu drop-shadow-md dark:drop-shadow-tablet-modal-shadow-dark rounded-md mt-2 absolute"
        >
          {children}
        </MenuItems>
      </WrapperContentMenu>
    </Menu>
  )
}

export default Wrapper
