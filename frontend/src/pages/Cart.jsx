import { Link } from 'react-router-dom'
import {
  FaArrowRight,
  FaCheckCircle,
  FaShieldAlt,
  FaShoppingBag,
  FaTrashAlt,
  FaTruck,
} from 'react-icons/fa'
import { useCart } from '../context/CartContext.jsx'
import { formatCurrency } from '../utils/formatters'

function Cart() {
  const { items, updateQuantity, removeFromCart, totals } = useCart()

  const freeShippingThreshold = 999
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - totals.subtotal)
  const shippingProgress = Math.min(100, (totals.subtotal / freeShippingThreshold) * 100)

  return (
    <div className="page-shell space-y-8 pb-16">
      <div>
        <h1 className="font-display text-3xl font-black text-slate-950">Shopping Cart</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review your chosen items, adjust quantities, and proceed to secure checkout.
        </p>
      </div>

      {!items.length ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 sm:p-16 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-teal-50 text-teal-600 mb-4">
            <FaShoppingBag className="text-2xl" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-800">Your shopping cart is empty</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added any products to your cart yet. Discover trending products today!
          </p>
          <div className="mt-6">
            <Link to="/" className="btn-primary">
              Start Shopping <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Progress Indicator */}
            <div className="rounded-2xl border border-teal-200/70 bg-teal-50/50 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-teal-900">
                <span className="flex items-center gap-1.5">
                  <FaTruck className="text-teal-600" />
                  {amountNeededForFreeShipping === 0
                    ? 'Congratulations! You unlocked FREE shipping 🎉'
                    : `Add ${formatCurrency(amountNeededForFreeShipping)} more to get FREE Delivery`}
                </span>
                <span>{Math.round(shippingProgress)}%</span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-teal-200/50">
                <div
                  className="h-full bg-teal-600 transition-all duration-500 rounded-full"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            {items.map((item) => (
              <article
                key={item._id}
                className="group flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:shadow-sm"
              >
                <Link
                  to={`/products/${item._id}`}
                  className="size-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200"
                >
                  <img
                    className="h-full w-full object-cover transition group-hover:scale-105"
                    src={
                      item.imageUrl ||
                      (item.images && item.images[0]) ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={item.name}
                  />
                </Link>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                    {item.category}
                  </span>
                  <Link
                    to={`/products/${item._id}`}
                    className="block font-display text-base font-bold text-slate-900 hover:text-teal-700 transition"
                  >
                    {item.name}
                  </Link>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500">
                    {item.selectedColor && (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium">
                        Color: {item.selectedColor}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>

                  <p className="font-display text-base font-black text-slate-900 pt-1">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="size-7 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="size-7 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                      disabled={item.quantity >= item.countInStock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                    onClick={() => removeFromCart(item._id)}
                    title="Remove item"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Order Summary Aside */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
              <h2 className="font-display text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    Shipping
                    {totals.shipping === 0 && (
                      <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                        FREE
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-slate-900">
                    {totals.shipping === 0 ? '₹0.00' : formatCurrency(totals.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span className="font-bold text-slate-900">{formatCurrency(totals.tax)}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-base">Grand Total</span>
                  <span className="font-display text-2xl font-black text-slate-950">
                    {formatCurrency(totals.total)}
                  </span>
                </div>
              </div>

              <Link
                className={`btn-primary w-full !py-3 !text-base shadow-md ${
                  !items.length ? 'pointer-events-none opacity-50' : ''
                }`}
                to="/checkout"
              >
                Proceed to Checkout <FaArrowRight className="text-xs" />
              </Link>

              <div className="space-y-2 pt-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-teal-600" />
                  <span>30-Day Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-teal-600" />
                  <span>Encrypted 256-Bit SSL Payments</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

export default Cart
