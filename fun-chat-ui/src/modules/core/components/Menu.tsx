import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  anchor?: 'top-center'
  hideClickOnItems?: boolean | false
  triggerButton: (active: boolean) => React.ReactNode
  setMenuStatus?: React.Dispatch<React.SetStateAction<boolean>>
}

const Menu: React.FC<Props> = ({
  children,
  setMenuStatus,
  triggerButton,
  hideClickOnItems,
  anchor = 'bottom-left',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)

  const trigger = useRef<HTMLButtonElement>(null)
  const dropdown = useRef<HTMLDivElement>(null)

  // handle click outsdie
  useEffect(() => {
    //@ts-ignore
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return
      const hideOnClick = !hideClickOnItems && dropdown.current.contains(target)

      if (
        !dropdown.current ||
        //@ts-ignore
        trigger.current.contains(target) ||
        hideOnClick
      ) {
        if (typeof setMenuStatus !== 'undefined') setMenuStatus(true)
        return
      }
      setDropdownOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  //close if the esc key is pressed
  useEffect(() => {
    //@ts-ignore
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  const setMenuPosition = () => {
    switch (anchor) {
      case 'top-center':
        return '-top-2 -translate-y-full -translate-x-1/2 left-1/2'
      default:
        return 'left-0 right-0 top-full mt-3'
    }
  }

  return (
    <section className="bg-gray-2 dark:bg-dark">
      <div className="container">
        <div className="flex justify-center">
          <div className="relative inline-block">
            {/*trigger button*/}
            <button
              className="cursor-pointer"
              ref={trigger}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {triggerButton(dropdownOpen)}
            </button>
            {/*Menu body*/}
            <div
              ref={dropdown}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setDropdownOpen(false)}
              className={classNames(
                'content absolute z-50 w-[295px] divide-y divide-stroke overflow-hidden rounded-lg shadow-xl hidden',
                setMenuPosition(),
                { '!block': dropdownOpen },
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Menu
