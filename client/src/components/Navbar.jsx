import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logout } from '../app/features/authSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-4 sm:px-16">
      <Link to="/" className="text-2xl font-bold tracking-tight text-slate-800">
        resume<span className="text-green-500">.</span>
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <span className="hidden text-gray-600 sm:block">Hi, {user?.name}</span>
        <button type="button" onClick={handleLogout} className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar