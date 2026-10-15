import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import api from './config/api'
import { login, setLoading } from './app/features/authSlice'

import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      dispatch(setLoading(false))
      return
    }

    api.get('/api/users/data', {
      headers: { Authorization: token }
    }).then(({ data }) => {
      dispatch(login({ token, user: data.user }))
    }).catch(() => {
      localStorage.removeItem('token')
    }).finally(() => {
      dispatch(setLoading(false))
    })
  }, [dispatch])

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />
        </Route>

        <Route path='view/:resumeId' element={<Preview />} />
        <Route path='login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App