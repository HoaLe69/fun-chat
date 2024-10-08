import React, { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  triggerButton: (active: boolean) => React.ReactNode
}

const Menu: React.FC<Props> = ({ children, triggerButton }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)

  const trigger = useRef<HTMLButtonElement>(null)
  const dropdown = useRef<HTMLDivElement>(null)

  useEffect(() => {
    //@ts-ignore
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return
      if (
        !dropdownOpen ||
        //@ts-ignore
        dropdown.current.contains(target) ||
        //@ts-ignore
        trigger.current.contains(target)
      )
        return
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

  return (
    <section className="bg-gray-2 dark:bg-dark">
      <div className="container">
        <div className="flex justify-center">
          <div className="relative inline-block">
            {/*trigger button*/}
            <button
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
              className={`content absolute z-50 left-0 right-0 top-full w-[295px] divide-y divide-stroke overflow-hidden rounded-lg bg-balck dark:divide-dark-3 dark:bg-dark-2 ${dropdownOpen ? 'block' : 'hidden'} shadow-xl`}
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
