import { Wrapper } from 'modules/core/components/menus'
import { CloseButton } from '@headlessui/react'
import { LaughSmallIcon } from 'modules/core/components/icons'

type Props = {
  onReact: (emoji: string) => void
}

const ReactionPicker: React.FC<Props> = ({ onReact }) => {
  const reactIcons = ['❤️', '👍', '👎', '😂', '😮', '😞']

  return (
    <Wrapper
      icon={
        <span className="">
          <LaughSmallIcon />
        </span>
      }
      anchor="bottom start"
    >
      <div className="p-2 rounded-2xl bg-grey-50  dark:bg-grey-900">
        <ul className="flex items-center">
          {reactIcons.map(icon => (
            <CloseButton key={icon}>
              <li onClick={() => onReact(icon)} className="reaction_icon">
                {icon}
              </li>
            </CloseButton>
          ))}
        </ul>
      </div>
    </Wrapper>
  )
}
export default ReactionPicker
