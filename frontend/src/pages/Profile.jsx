import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import api, { getError } from '../services/api'
import { formatCurrency } from '../utils/formatters'

function Profile() {
  const { user, updateProfile } = useAuth()
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', address: user.address || {} })

  useEffect(() => {
    if (user.role === 'customer') {
      api.get('/orders/mine').then(({ data }) => setOrders(data)).catch((error) => toast.error(getError(error)))
    }
  }, [user.role])

  const cancelOrder = async (orderId) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/cancel`)
      setOrders((currentOrders) => currentOrders.map((order) => (order._id === data._id ? data : order)))
      toast.success('Order cancelled')
    } catch (error) {
      toast.error(getError(error))
    }
  }

  const save = async (event) => {
    event.preventDefault()
    try {
      await updateProfile(form)
      toast.success('Profile updated')
    } catch (error) {
      toast.error(getError(error))
    }
  }

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-[360px_1fr]">
      <form className="h-fit space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" onSubmit={save}>
        <h1 className="text-2xl font-black">Profile</h1>
        <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="form-input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        {['street', 'city', 'state', 'pincode'].map((key) => (
          <input className="form-input" key={key} placeholder={key} value={form.address?.[key] || ''} onChange={(e) => setForm({ ...form, address: { ...form.address, [key]: e.target.value } })} />
        ))}
        <button className="btn-primary w-full">Save profile</button>
      </form>
      <section className="space-y-4">
        <h2 className="text-2xl font-black">My orders</h2>
        {!orders.length && <p className="rounded-lg bg-white p-5 font-bold text-slate-500">No orders yet.</p>}
        {orders.map((order) => (
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={order._id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <b>Order #{order._id.slice(-8)}</b>
              <span className="status-pill bg-teal-50 text-teal-700">{order.orderStatus}</span>
            </div>
            <div className="mt-4 space-y-2">
              {order.items.map((item) => (
                <p className="flex justify-between text-sm" key={item.product}>
                  <span>{item.name} x {item.quantity}</span>
                  <b>{formatCurrency(item.price * item.quantity)}</b>
                </p>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-lg font-black">{formatCurrency(order.totalPrice)}</p>
              {['placed', 'packed'].includes(order.orderStatus) && (
                <button className="btn-secondary text-rose-700" onClick={() => cancelOrder(order._id)}>Cancel order</button>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

export default Profile
