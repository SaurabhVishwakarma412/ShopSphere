import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext.jsx'
import api, { getError } from '../services/api'
import { formatCurrency } from '../utils/formatters'

function Checkout() {
  const { items, totals, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      await api.post('/orders', {
        items: items.map((item) => ({ product: item._id, quantity: item.quantity })),
        shippingAddress: address,
        paymentMethod,
      })
      clearCart()
      toast.success('Order placed successfully')
      navigate('/profile')
    } catch (error) {
      toast.error(getError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-[1fr_340px]">
      <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={submit}>
        <h1 className="text-3xl font-black">Checkout</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.keys(address).map((key) => (
            <input className="form-input" key={key} placeholder={key[0].toUpperCase() + key.slice(1)} value={address[key]} onChange={(e) => setAddress({ ...address, [key]: e.target.value })} required />
          ))}
        </div>
        <select className="form-input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="card">Card payment</option>
          <option value="upi">UPI payment</option>
          <option value="cash">Cash on delivery</option>
        </select>
        <button className="btn-primary w-full" disabled={loading || !items.length}>{loading ? 'Placing order...' : 'Place order'}</button>
      </form>
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Payment total</h2>
        <p className="mt-4 flex justify-between"><span>Items</span><b>{formatCurrency(totals.subtotal)}</b></p>
        <p className="mt-2 flex justify-between"><span>Shipping</span><b>{formatCurrency(totals.shipping)}</b></p>
        <p className="mt-2 flex justify-between"><span>GST</span><b>{formatCurrency(totals.tax)}</b></p>
        <p className="mt-3 flex justify-between border-t pt-3 text-lg"><span>Total</span><b>{formatCurrency(totals.total)}</b></p>
      </aside>
    </div>
  )
}

export default Checkout
