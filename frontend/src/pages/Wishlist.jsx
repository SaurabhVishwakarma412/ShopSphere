import { Link } from 'react-router-dom'
import { FaCartPlus, FaHeart, FaShoppingBag, FaTrashAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { formatCurrency } from '../utils/formatters'

function Wishlist() {
  const { wishlist, toggleWishlist, loading } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (product) => {
    addToCart(product, 1)
    toggleWishlist(product)
    toast.success(`${product.name} moved to cart!`)
  }

  return (
    <div className="page-shell space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-950 flex items-center gap-2.5">
            <FaHeart className="text-rose-500" /> My Saved Wishlist
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Keep track of items you want to purchase later.
          </p>
        </div>
        <Link to="/" className="btn-secondary self-start">
          <FaShoppingBag /> Continue Shopping
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500">
          <p className="font-bold">Loading your wishlist...</p>
        </div>
      ) : wishlist.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((item) => {
            const product = typeof item === 'object' ? item : null
            if (!product) return null

            return (
              <div
                key={product._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={
                        product.imageUrl ||
                        (product.images && product.images[0]) ||
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 text-rose-600 shadow transition hover:scale-110"
                    title="Remove item"
                  >
                    <FaTrashAlt className="text-xs" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      {product.category}
                    </span>
                    <Link
                      to={`/products/${product._id}`}
                      className="block font-display text-base font-bold text-slate-900 line-clamp-1 hover:text-teal-700 mt-1"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display text-lg font-black text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs font-semibold text-slate-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className="btn-primary w-full text-xs !py-2.5 disabled:opacity-50"
                    disabled={product.countInStock === 0}
                    onClick={() => handleMoveToCart(product)}
                  >
                    <FaCartPlus /> {product.countInStock === 0 ? 'Out of Stock' : 'Move to Cart'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 sm:p-16 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-50 text-rose-500 mb-4">
            <FaHeart className="text-3xl" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-800">Your wishlist is currently empty</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            Browse our curated collections and click the heart icon on any product to save it here for later.
          </p>
          <div className="mt-6">
            <Link to="/" className="btn-primary">
              Discover Products
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wishlist
