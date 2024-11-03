import { ChangeEvent, FC, FocusEventHandler } from 'react'

interface InputProps {
  type: 'text' | 'number' | 'email' | 'password'
  label?: string
  value: string | number
  name: string
  errorMessage?: string
  disable?: boolean
  placeholder: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEventHandler<HTMLInputElement>) => void
}

const Input: FC<InputProps> = ({ type, label, value, name, errorMessage, disable, onBlur, onChange, placeholder }) => {
  return (
    <div className="mt-5">
      {label && (
        <label className="font-semibold  block mb-2 text-gray-700 text-left " htmlFor={label}>
          {label}
        </label>
      )}
      <input
        className="text-base py-3 px-4 w-full shadow-md rounded-3xl border focus:border-blue-400 focus:outline-none"
        type={type}
        id={label}
        name={name}
        value={value}
        onChange={onChange}
        //@ts-ignore
        onBlur={onBlur}
        disabled={disable}
        placeholder={placeholder}
      />
      {errorMessage && <p className="text-sm text-red-500 text-left mt-2">{errorMessage}</p>}
    </div>
  )
}

export default Input
