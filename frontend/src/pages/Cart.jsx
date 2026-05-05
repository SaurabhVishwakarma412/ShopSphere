import { Link } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { useCart } from '../context/CartContext.jsx'
import { formatCurrency } from '../utils/formatters'

function Cart() {
  const { items, updateQuantity, removeFromCart, totals } = useCart()

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-[1fr_340px]">
      <section className="space-y-4">
        <h1 className="text-3xl font-black">Cart</h1>
        {!items.length && <p className="rounded-lg bg-white p-6 font-bold text-slate-500">Your cart is empty.</p>}
        {items.map((item) => (
          <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto]" key={item._id}>
            <img className="size-28 rounded-lg object-cover" src={item.imageUrl} alt={item.name} />
            <div>
              <Link className="text-lg font-black hover:text-teal-700" to={`/products/${item._id}`}>{item.name}</Link>
              <p className="font-bold text-slate-500">{formatCurrency(item.price)}</p>
              <input className="form-input mt-3 max-w-24" min="1" max={item.countInStock} type="number" value={item.quantity} onChange={(e) => updateQuantity(item._id, Number(e.target.value))} />
            </div>
            <button className="btn-secondary self-start text-rose-600" onClick={() => removeFromCart(item._id)}>
              <FaTrash />
            </button>
          </article>
        ))}
      </section>
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <p className="flex justify-between"><span>Subtotal</span><b>{formatCurrency(totals.subtotal)}</b></p>
          <p className="flex justify-between"><span>Shipping</span><b>{formatCurrency(totals.shipping)}</b></p>
          <p className="flex justify-between"><span>GST</span><b>{formatCurrency(totals.tax)}</b></p>
          <p className="flex justify-between border-t pt-3 text-lg"><span>Total</span><b>{formatCurrency(totals.total)}</b></p>
        </div>
        <Link className={`btn-primary mt-5 w-full ${!items.length ? 'pointer-events-none opacity-50' : ''}`} to="/checkout">
          Checkout
        </Link>
      </aside>
    </div>
  )
}

export default Cart
