import { useCallback } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
}
const Image: React.FC<Props> = ({ src, alt, className }) => {
  const onError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/public/fallback.png'
  }, [])

  return <img onError={onError} src={src} alt={alt} className={className} />
}

export default Image
