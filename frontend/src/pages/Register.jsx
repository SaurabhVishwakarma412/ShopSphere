import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaStore, FaUser, FaUserPlus } from 'react-icons/fa'
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
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      })
      toast.success('Account created successfully! Welcome 🎉')
      navigate(user.role === 'seller' ? '/seller' : '/')
    } catch (error) {
      toast.error(getError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell min-h-[70vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-lg shadow-slate-900/5">
        <div className="text-center space-y-2">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white shadow-md">
            <FaUserPlus className="text-lg" />
          </div>
          <h1 className="font-display text-2xl font-black text-slate-900">Create Account</h1>
          <p className="text-xs text-slate-500">Join ShopSphere as a customer or an independent merchant.</p>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-center gap-2 cursor-pointer rounded-2xl border p-3 font-bold text-xs transition ${
                form.role === 'customer'
                  ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-600/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name="role"
                value="customer"
                checked={form.role === 'customer'}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              <FaUser /> Customer
            </label>

            <label
              className={`flex items-center justify-center gap-2 cursor-pointer rounded-2xl border p-3 font-bold text-xs transition ${
                form.role === 'seller'
                  ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-600/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name="role"
                value="seller"
                checked={form.role === 'seller'}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              <FaStore /> Seller
            </label>
          </div>

          <label className="block text-xs font-bold text-slate-700">
            Full Name or Store Name *
            <input
              className="form-input mt-1.5"
              placeholder={form.role === 'seller' ? 'e.g. Acme Tech Store' : 'e.g. Alex Johnson'}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>

          <label className="block text-xs font-bold text-slate-700">
            Email Address *
            <input
              className="form-input mt-1.5"
              placeholder="name@example.com"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>

          <label className="block text-xs font-bold text-slate-700">
            Password (min 6 characters) *
            <input
              className="form-input mt-1.5"
              minLength="6"
              placeholder="••••••••"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>

          <button
            className="btn-primary w-full !py-3 !text-sm shadow-md"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Setting Up Account...' : 'Join ShopSphere'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link className="font-bold text-teal-700 hover:underline" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
