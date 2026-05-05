import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { getError } from '../services/api'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const user = await register(form)
      toast.success('Account created')
      navigate(user.role === 'seller' ? '/seller' : '/')
    } catch (error) {
      toast.error(getError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell grid place-items-center">
      <form className="w-full max-w-lg space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={submit}>
        <h1 className="text-3xl font-black">Create account</h1>
        <input className="form-input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="form-input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="form-input" minLength="6" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <div className="grid grid-cols-2 gap-3">
          {['customer', 'seller'].map((role) => (
            <label className={`cursor-pointer rounded-lg border p-4 font-bold ${form.role === role ? 'border-teal-700 bg-teal-50 text-teal-800' : 'border-slate-200'}`} key={role}>
              <input className="sr-only" type="radio" name="role" value={role} checked={form.role === role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              {role[0].toUpperCase() + role.slice(1)}
            </label>
          ))}
        </div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
      </form>
    </div>
  )
}

export default Register
