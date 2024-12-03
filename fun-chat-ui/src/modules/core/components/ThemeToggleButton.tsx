import classNames from 'classnames'
import { MoonSolidIcon, SunnyIcon } from 'modules/core/components/icons'
import { useCallback, useEffect, useState } from 'react'

const themes = ['light', 'dark']
const ThemeToggleButton = (): JSX.Element => {
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== undefined && localStorage.getItem('theme')) return localStorage.getItem('theme')
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
  })
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.remove('dark')
      root.setAttribute('data-color-mode', 'light')
    } else {
      root.classList.add('dark')
      root.setAttribute('data-color-mode', 'dark')
    }
  }, [theme])
  const handleChangeTheme = useCallback(() => {
    const t = theme === 'light' ? 'dark' : 'light'
    setTheme(t)
    localStorage.setItem('theme', t)
  }, [theme])
  return (
    <div className={classNames('bg-grey-400 p-1 flex items-center rounded-3xl')}>
      {themes.map((th: string) => {
        const t = th === 'dark'
        return (
          <button
            key={th}
            onClick={handleChangeTheme}
            className={classNames('p-1 transition-all', {
              'bg-white rounded-full': theme === th,
            })}
          >
            {t ? <MoonSolidIcon /> : <SunnyIcon />}
          </button>
        )
      })}
    </div>
  )
}

export default ThemeToggleButton
