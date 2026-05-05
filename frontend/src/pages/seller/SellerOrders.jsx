import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api, { getError } from '../../services/api'
import { formatCurrency } from '../../utils/formatters'

const statuses = ['placed', 'packed', 'shipped', 'delivered', 'cancelled']

function SellerOrders() {
  const [orders, setOrders] = useState([])

  const loadOrders = async () => {
    const { data } = await api.get('/orders/seller')
    setOrders(data)
  }

  useEffect(() => {
    loadOrders().catch((error) => toast.error(getError(error)))
  }, [])

  const updateStatus = async (id, orderStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { orderStatus })
      toast.success('Order status updated')
      await loadOrders()
    } catch (error) {
      toast.error(getError(error))
    }
  }

  return (
    <div className="page-shell space-y-5">
      <h1 className="text-3xl font-black">Seller orders</h1>
      {!orders.length && <p className="rounded-lg bg-white p-5 font-bold text-slate-500">No orders yet.</p>}
      {orders.map((order) => (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={order._id}>
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-black">Order #{order._id.slice(-8)}</p>
              <p className="text-sm text-slate-500">{order.customer?.name} - {order.customer?.email}</p>
            </div>
            <select className="form-input max-w-44" value={order.orderStatus} onChange={(e) => updateStatus(order._id, e.target.value)}>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div className="mt-4 grid gap-3">
            {order.items.map((item) => (
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3" key={`${order._id}-${item.product}`}>
                <div className="flex items-center gap-3">
                  <img className="size-12 rounded object-cover" src={item.imageUrl} alt={item.name} />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                  </div>
                </div>
                <b>{formatCurrency(item.price * item.quantity)}</b>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

export default SellerOrders
