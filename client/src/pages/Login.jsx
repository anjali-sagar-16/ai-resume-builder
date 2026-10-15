
import { useState } from 'react'
import { Lock, Mail, User2Icon } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../config/api'
import { login } from '../app/features/authSlice'

const Login = () => {
  const queryState = new URLSearchParams(window.location.search).get('state')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [state, setState] = useState(
    queryState === 'register' ? 'register' : 'login'
  )

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = isSignUp ? '/api/users/register' : '/api/users/login'
      const { data } = await api.post(endpoint, formData)
      dispatch(login(data))
      localStorage.setItem('token', data.token)
      toast.success(data.message)
      navigate('/app')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const isSignUp = state === 'register'

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">

      <form
        onSubmit={handleSubmit}
        className="sm:w-[380px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-10 bg-white shadow-sm"
      >

        <h1 className="text-gray-900 text-3xl font-medium">
          {isSignUp ? 'Sign up' : 'Login'}
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Please {isSignUp ? 'sign up' : 'sign in'} to continue
        </p>

        {isSignUp && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} className="text-gray-500 shrink-0" />

            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-none outline-none ring-0 w-full text-sm pr-4 bg-transparent"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={16} className="text-gray-500 shrink-0" />

          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0 w-full text-sm pr-4 bg-transparent"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={16} className="text-gray-500 shrink-0" />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0 w-full text-sm pr-4 bg-transparent"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-full transition-all"
        >
          {isSignUp ? 'Sign up' : 'Login'}
        </button>

        <p className="text-gray-500 text-sm mt-6">
          {isSignUp
            ? 'Already have an account? '
            : "Don't have an account? "}

          <span
            onClick={() =>
              setState(isSignUp ? 'login' : 'register')
            }
            className="text-green-600 cursor-pointer underline hover:text-green-700"
          >
            {isSignUp ? 'Login' : 'Sign up'}
          </span>
        </p>

      </form>
    </div>
  )
}

export default Login

