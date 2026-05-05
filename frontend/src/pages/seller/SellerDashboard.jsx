import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBoxes, FaClipboardList, FaPlus, FaRupeeSign } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api, { getError } from '../../services/api'
import { formatCurrency } from '../../utils/formatters'

function SellerDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    Promise.all([api.get('/products/mine'), api.get('/orders/seller')])
      .then(([productRes, orderRes]) => {
        setProducts(productRes.data)
        setOrders(orderRes.data)
      })
      .catch((error) => toast.error(getError(error)))
  }, [])

  const revenue = useMemo(
    () =>
      orders.reduce(
        (sum, order) =>
          sum +
          order.items.reduce((itemSum, item) => {
            const ownProduct = products.some((product) => product._id === item.product)
            return ownProduct ? itemSum + item.price * item.quantity : itemSum
          }, 0),
        0,
      ),
    [orders, products],
  )

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Seller dashboard</h1>
          <p className="text-slate-500">Manage products, track orders, and keep stock fresh.</p>
        </div>
        <Link className="btn-primary" to="/seller/products">
          <FaPlus /> Add product
        </Link>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <FaBoxes className="text-2xl text-teal-700" />
          <p className="mt-3 text-sm font-bold text-slate-500">Products</p>
          <p className="text-3xl font-black">{products.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <FaClipboardList className="text-2xl text-teal-700" />
          <p className="mt-3 text-sm font-bold text-slate-500">Orders</p>
          <p className="text-3xl font-black">{orders.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <FaRupeeSign className="text-2xl text-teal-700" />
          <p className="mt-3 text-sm font-bold text-slate-500">Product revenue</p>
          <p className="text-3xl font-black">{formatCurrency(revenue)}</p>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Recent orders</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((order) => (
                <tr className="border-t" key={order._id}>
                  <td className="p-3 font-bold">#{order._id.slice(-8)}</td>
                  <td className="p-3">{order.customer?.name}</td>
                  <td className="p-3"><span className="status-pill bg-teal-50 text-teal-700">{order.orderStatus}</span></td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default SellerDashboard
