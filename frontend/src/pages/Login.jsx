import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { getError } from '../services/api'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const submit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const user = await login(form)
      toast.success(`Welcome back, ${user.name}`)
      navigate(location.state?.from || (user.role === 'seller' ? '/seller' : '/'), { replace: true })
    } catch (error) {
      toast.error(getError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell grid place-items-center">
      <form className="w-full max-w-md space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={submit}>
        <h1 className="text-3xl font-black">Login</h1>
        <input className="form-input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="form-input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        <p className="text-center text-sm text-slate-500">
          New here? <Link className="font-bold text-teal-700" to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
