import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaCreditCard,
  FaLock,
  FaMoneyBillWave,
  FaMobileAlt,
  FaShieldAlt,
  FaCheckCircle,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api, { getError } from '../services/api'
import { formatCurrency } from '../utils/formatters'

function Checkout() {
  const { items, totals, couponCode, clearCart } = useCart()
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    if (!items.length) {
      toast.error('Your cart is empty!')
      return
    }

    try {
      setLoading(true)
      await api.post('/orders', {
        items: items.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod,
        couponCode,
      })
      clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate('/profile')
    } catch (error) {
      toast.error(getError(error))
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) {
    return (
      <div className="page-shell py-16 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-slate-800">Your Cart is Empty</h2>
          <p className="mt-2 text-sm text-slate-500">
            You cannot proceed to checkout without adding products first.
          </p>
          <div className="mt-6">
            <Link to="/" className="btn-primary">
              Return to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell space-y-8 pb-16">
      <div>
        <h1 className="font-display text-3xl font-black text-slate-950">Express Checkout</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter your delivery destination and choose your preferred payment method.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Form */}
        <form onSubmit={submit} className="lg:col-span-8 space-y-8">
          {/* Section 1: Shipping Address */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-teal-600 text-xs text-white font-bold">
                    1
                  </span>
                  Delivery Address
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Where should we deliver your order?</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold text-slate-700 sm:col-span-2">
                Street Address / Flat / Building *
                <input
                  className="form-input text-sm"
                  placeholder="e.g. 104, Sunrise Residency, Palm Beach Road"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                City *
                <input
                  className="form-input text-sm"
                  placeholder="e.g. Mumbai, Bengaluru"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                State / Province *
                <input
                  className="form-input text-sm"
                  placeholder="e.g. Maharashtra, Karnataka"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  required
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700 sm:col-span-2">
                Postal / Pincode *
                <input
                  className="form-input text-sm max-w-xs"
                  placeholder="e.g. 400001"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  required
                />
              </label>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-teal-600 text-xs text-white font-bold">
                  2
                </span>
                Payment Options
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Choose your preferred payment method</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {/* UPI option */}
              <label
                className={`flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition ${
                  paymentMethod === 'upi'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <FaMobileAlt className="text-xl text-teal-600" />
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="accent-teal-600"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-bold text-slate-900">UPI Instant</p>
                  <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm</p>
                </div>
              </label>

              {/* Card option */}
              <label
                className={`flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition ${
                  paymentMethod === 'card'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <FaCreditCard className="text-xl text-teal-600" />
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-teal-600"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-bold text-slate-900">Debit / Credit Card</p>
                  <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay</p>
                </div>
              </label>

              {/* Cash option */}
              <label
                className={`flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition ${
                  paymentMethod === 'cash'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <FaMoneyBillWave className="text-xl text-teal-600" />
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="accent-teal-600"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-bold text-slate-900">Cash on Delivery</p>
                  <p className="text-[11px] text-slate-500">Pay when delivered at doorstep</p>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full !py-3.5 !text-base shadow-xl"
            disabled={loading}
          >
            <FaLock className="text-sm" />
            {loading ? 'Confirming Order...' : `Pay ${formatCurrency(totals.total)} & Place Order`}
          </button>
        </form>

        {/* Aside: Cart Summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
            <h3 className="font-display text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Order Items ({items.length})
            </h3>

            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-3 text-xs">
                  <img
                    className="size-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    src={item.imageUrl || (item.images && item.images[0])}
                    alt={item.name}
                  />
                  <div className="flex-1 truncate">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="font-bold text-slate-900">
                  {totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Applicable GST (18%)</span>
                <span className="font-bold text-slate-900">{formatCurrency(totals.tax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 text-sm">
                <span className="font-black text-slate-900">Total Payable</span>
                <span className="font-display text-lg font-black text-slate-950">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-teal-600 shrink-0" />
                <span>Encrypted Bank-Grade 256-Bit SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-teal-600 shrink-0" />
                <span>Buyer Protection Guarantee</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
