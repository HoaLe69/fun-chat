import Tippy from '@tippyjs/react/headless'
import { PlusRawIcon } from 'modules/core/components/icons'
import { userServices } from 'modules/user/services'
import { useEffect, useState } from 'react'
import type { IUser } from '../types'
import { Button, Checkbox } from '@headlessui/react'

const CreateNewDirectMessage = () => {
  const [friends, setFriends] = useState<IUser[]>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    userServices
      .getUserAsync()
      .then((res) => {
        setFriends(res)
      })
      .catch((error) => console.log(error))
  }, [])

  return (
    <Tippy
      placement="bottom-end"
      interactive
      onClickOutside={() => setVisible(false)}
      visible={visible}
      render={(attrs) => (
        <div className="w-96 p-2 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl" {...attrs}>
          <div className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Select Friends</div>
          <input
            className="bg-zinc-200 dark:bg-zinc-900 w-full p-2 outline-none rounded-xl text-sm mt-4"
            name="email"
            id="email"
            type="text"
            placeholder="Type of your friend @email"
          />
          <ul className="list-none max-h-[200px] overflow-auto">
            {friends.map((friend, index) => (
              <li key={index} className="flex items-center gap-2 my-2 pr-4">
                <img src={friend.picture} alt={friend.display_name} className="w-8 h-8 rounded-full" />
                <span>{friend.display_name}</span>
                <Checkbox className="group ml-auto block size-4 rounded border bg-white data-[checked]:bg-blue-500">
                  <svg
                    className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Checkbox>
              </li>
            ))}
          </ul>
          <div className="py-1 mt-2">
            <Button className="w-full bg-purple-800 rounded-xl py-2">Create DM</Button>
          </div>
        </div>
      )}
    >
      <button onClick={() => setVisible(true)} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800">
        <PlusRawIcon className="w-4 h-4" />
      </button>
    </Tippy>
  )
}

export default CreateNewDirectMessage
