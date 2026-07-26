import { Link } from 'react-router-dom'
import { FaCartPlus, FaStar } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatCurrency } from '../utils/formatters'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAdd = () => {
    addToCart(product, 1)
    toast.success('Added to cart')
  }

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <Link to={`/products/${product._id}`}>
        <img className="aspect-[4/3] w-full border border-slate-200 object-cover" src={product.imageUrl} alt={product.name} />
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{product.category}</p>
          <Link to={`/products/${product._id}`} className="mt-1 block text-lg font-black text-slate-950 hover:text-teal-700">
            {product.name}
          </Link>
          <p className="text-sm text-slate-500">by {product.seller?.name || product.brand || 'Seller'}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-black">{formatCurrency(product.price)}</span>
          <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
            <FaStar /> {product.rating || 'New'}
          </span>
        </div>
        <button
          className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={product.countInStock === 0 || user?.role === 'seller'}
          onClick={handleAdd}
        >
          <FaCartPlus />
          {product.countInStock === 0 ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
