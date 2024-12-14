import NavSidebar from './NavSidebar'
interface Props {
  children: React.ReactNode
}
const CommonLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="grid grid-cols-[72px_272px_1fr] h-screen">
      <NavSidebar />
      {children}
    </div>
  )
}

export default CommonLayout
