import type { ReactNode } from 'react'

export type MenuItemType = {
  tag: string
  name: string
  avatar_path?: string
  icon?: JSX.Element
  right?: JSX.Element
}
