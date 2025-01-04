import Tippy from '@tippyjs/react/headless'
import { PlusRawIcon } from 'modules/core/components/icons'
import { userServices } from 'modules/user/services'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IConversation, type IUser } from '../types'
import { Button, Checkbox } from '@headlessui/react'
import { useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import { roomServices } from '../services'
import { useSocket, useAppDispatch } from 'modules/core/hooks'
import { SOCKET_EVENTS } from 'const'
import { addMessage } from '../states/messageSlice'
import Image from 'modules/core/components/Image'

const CreateNewDirectMessage = () => {
  const [friends, setFriends] = useState<IUser[]>([])
  const [filterFriend, setFilterFriend] = useState<IUser[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState<string>('')
  const [room, setRoom] = useState<IConversation | null>(null)
  const { roomId } = useParams()
  const userLogin = useAppSelector(authSelector.selectUser)
  const { emitEvent } = useSocket()
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    const processFriends: Promise<any>[] | undefined = userLogin?.friends.map((friendId) =>
      userServices.getUserById(friendId),
    )

    if (!processFriends) return
    Promise.all(processFriends).then((res) => {
      setFriends(res)
      setFilterFriend(res)
    })
  }, [userLogin])

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setInputValue(value)

      if (!value) return

      setFilterFriend(() => {
        return friends.filter((friend) => friend.email.includes(value))
      })
    },
    [friends],
  )

  const handleCreateDM = useCallback(async () => {
    if (!message || !userLogin) return
    try {
      if (!room) {
        emitEvent(
          SOCKET_EVENTS.ROOM.CREATE,
          {
            msg: {
              content: { text: message },
              ownerId: userLogin?._id,
            },
            room: { members: [userLogin?._id, selectedFriend] },
            recipient: selectedFriend,
          },
          (response: any) => {
            navigate(`/devchat/@me/${response?.room?._id}/${selectedFriend}`)
          },
        )
        return
      }
      emitEvent(
        SOCKET_EVENTS.MESSAGE.SEND,
        {
          msg: {
            content: { text: message },
            ownerId: userLogin?._id,
            roomId: room._id,
          },
          recipientId: selectedFriend,
        },
        (response: any) => {
          //ignore
          console.log(response)
          if (roomId === room._id) {
            dispatch(addMessage(response))
          }
        },
      )
      navigate(`/devchat/@me/${room?._id}/${selectedFriend}`, { replace: true })
    } catch (error) {
      console.log(error)
    }

    setVisible(false)
    setSelectedFriend('')
  }, [userLogin, selectedFriend, message])

  const handleCheckboxChange = useCallback(
    async (userId: string, checked: boolean) => {
      if (!checked) {
        setSelectedFriend('')
      } else {
        if (userLogin) {
          const checkRoom = await roomServices.checkRoomExistAsync([userLogin?._id, userId])
          setRoom(checkRoom)
          setSelectedFriend(userId)
        }
      }
    },
    [userLogin],
  )

  return (
    <Tippy
      placement="bottom-end"
      interactive
      onClickOutside={() => {
        setVisible(false)
        setInputValue('')
        setFilterFriend(friends)
        setSelectedFriend('')
      }}
      visible={visible}
      render={(attrs) => (
        <div className="w-96 p-2 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl" {...attrs}>
          <div className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Select Friends</div>
          <input
            onChange={handleInputChange}
            value={inputValue}
            className="bg-zinc-200 dark:bg-zinc-900 w-full p-2 outline-none rounded-xl text-sm mt-4"
            name="email"
            id="email"
            type="text"
            placeholder="Type of your friend @email"
          />
          <ul className="list-none max-h-[200px] overflow-auto">
            {filterFriend.map((friend, index) => (
              <li key={index} className="flex items-center gap-2 my-2 pr-4">
                <Image src={friend.picture} alt={friend.display_name} className="w-8 h-8 rounded-full" />
                <span>{friend.display_name}</span>
                <Checkbox
                  checked={selectedFriend === friend?._id}
                  onChange={(checked) => handleCheckboxChange(friend?._id, checked)}
                  className="group ml-auto block size-4 rounded border bg-white data-[checked]:bg-blue-500"
                >
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
          {selectedFriend && (
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your first message"
              className="outline-none bg-zinc-200 dark:bg-zinc-900 w-full p-2 rounded-xl text-sm mt-2"
            />
          )}
          <div className="py-1 mt-2">
            <Button onClick={handleCreateDM} className="w-full bg-purple-800 rounded-xl py-2">
              Create DM
            </Button>
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
