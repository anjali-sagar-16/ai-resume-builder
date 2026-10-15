import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Login from './Login'
import Navbar from '../components/Navbar'

const Layout = () => {
  const { loading, user } = useSelector((state) => state.auth)

  if (loading) return <Loader />
  if (!user) return <Login />

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Outlet />
      </main>

    </div>
  )
}

export default Layout