import { useEffect, useState } from 'react'
import {
  FaBox,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaShoppingBag,
  FaTimesCircle,
  FaUser,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import api, { getError } from '../services/api'
import { formatCurrency } from '../utils/formatters'

function Profile() {
  const { user, updateProfile } = useAuth()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || { street: '', city: '', state: '', pincode: '' },
  })

  useEffect(() => {
    if (user?.role === 'customer') {
      setLoadingOrders(true)
      api
        .get('/orders/mine')
        .then(({ data }) => setOrders(data))
        .catch((error) => toast.error(getError(error)))
        .finally(() => setLoadingOrders(false))
    }
  }, [user?.role])

  const cancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    try {
      const { data } = await api.put(`/orders/${orderId}/cancel`)
      setOrders((currentOrders) =>
        currentOrders.map((order) => (order._id === data._id ? data : order))
      )
      toast.success('Order cancelled successfully')
    } catch (error) {
      toast.error(getError(error))
    }
  }

  const save = async (event) => {
    event.preventDefault()
    try {
      setSavingProfile(true)
      await updateProfile(form)
      toast.success('Profile details saved!')
    } catch (error) {
      toast.error(getError(error))
    } finally {
      setSavingProfile(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'shipped':
        return 'bg-teal-50 text-teal-700 border-teal-200'
      case 'packed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }

  return (
    <div className="page-shell space-y-8 pb-16">
      <div>
        <h1 className="font-display text-3xl font-black text-slate-950">Account Center</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal details, default shipping address, and view order history.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Profile Settings */}
        <div className="lg:col-span-4">
          <form
            className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5"
            onSubmit={save}
          >
            <div className="border-b border-slate-100 pb-3 flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-teal-100 text-teal-800 font-black text-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">{user?.name}</h2>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  {user?.role} Account
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 mb-1"><FaUser className="text-teal-600" /> Full Name</span>
                <input
                  className="form-input text-sm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>

              <label className="block text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 mb-1"><FaPhone className="text-teal-600" /> Contact Phone</span>
                <input
                  className="form-input text-sm"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
            </div>

            {/* Default Shipping Address */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-teal-600" /> Default Shipping Address
              </h3>

              <input
                className="form-input text-xs"
                placeholder="Street Address"
                value={form.address?.street || ''}
                onChange={(e) =>
                  setForm({ ...form, address: { ...form.address, street: e.target.value } })
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="form-input text-xs"
                  placeholder="City"
                  value={form.address?.city || ''}
                  onChange={(e) =>
                    setForm({ ...form, address: { ...form.address, city: e.target.value } })
                  }
                />
                <input
                  className="form-input text-xs"
                  placeholder="State"
                  value={form.address?.state || ''}
                  onChange={(e) =>
                    setForm({ ...form, address: { ...form.address, state: e.target.value } })
                  }
                />
              </div>
              <input
                className="form-input text-xs"
                placeholder="Pincode"
                value={form.address?.pincode || ''}
                onChange={(e) =>
                  setForm({ ...form, address: { ...form.address, pincode: e.target.value } })
                }
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="btn-primary w-full !py-2.5 text-xs shadow-md"
            >
              <FaSave /> {savingProfile ? 'Saving...' : 'Update Details'}
            </button>
          </form>
        </div>

        {/* Right Column: Customer Orders */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
              <FaBox className="text-teal-600" /> Order History ({orders.length})
            </h2>
            <Link to="/" className="text-xs font-bold text-teal-700 hover:underline">
              Browse More Products &gt;
            </Link>
          </div>

          {loadingOrders ? (
            <p className="text-slate-500 font-semibold text-center py-8">Loading your orders...</p>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <p className="font-display font-black text-slate-900 text-sm">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Placed on{' '}
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`status-pill border text-xs font-bold ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                          alt={item.name}
                          className="size-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.name}</p>
                          <p className="text-slate-500">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <span className="font-bold text-slate-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-slate-500">Total Amount: </span>
                      <span className="font-display text-base font-black text-slate-900">
                        {formatCurrency(order.totalPrice)}
                      </span>
                      <span className="text-[10px] text-slate-600 ml-2 uppercase font-semibold">
                        ({order.paymentMethod})
                      </span>
                    </div>

                    {['placed', 'packed'].includes(order.orderStatus) && (
                      <button
                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition"
                        onClick={() => cancelOrder(order._id)}
                      >
                        <FaTimesCircle /> Cancel Order
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-teal-50 text-teal-600 mb-3">
                <FaShoppingBag className="text-2xl" />
              </div>
              <h3 className="font-display text-base font-bold text-slate-800">No Orders Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You haven't placed any orders with us yet. Start exploring our catalogue today!
              </p>
              <Link to="/" className="btn-primary mt-4 text-xs">
                Explore Store
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
