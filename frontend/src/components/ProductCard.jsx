import { Link } from 'react-router-dom'
import { FaCartPlus, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { formatCurrency } from '../utils/formatters'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const inWishlist = isInWishlist(product._id)

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast.success(`${product.name} added to cart!`)
  }

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-950/5">
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <Link to={`/products/${product._id}`} className="block h-full w-full">
          <img
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={product.imageUrl || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            loading="lazy"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
          {discountPercent > 0 && (
            <span className="rounded-lg bg-rose-600/90 px-2.5 py-1 text-xs font-black tracking-wider text-white shadow-sm backdrop-blur-xs">
              -{discountPercent}%
            </span>
          )}
          {product.countInStock <= 5 && product.countInStock > 0 && (
            <span className="rounded-lg bg-amber-500/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-xs">
              Only {product.countInStock} left
            </span>
          )}
        </div>

        {/* Wishlist Button Overlay */}
        {user?.role !== 'seller' && (
          <button
            onClick={handleWishlistToggle}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-xs transition hover:scale-110 hover:bg-white hover:text-rose-500"
            title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label="Toggle wishlist"
          >
            {inWishlist ? <FaHeart className="text-rose-500 text-base" /> : <FaRegHeart className="text-base" />}
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-xs font-medium text-slate-600 truncate max-w-[120px]">
                {product.brand}
              </span>
            )}
          </div>

          <Link
            to={`/products/${product._id}`}
            className="mt-1.5 block font-display text-base font-bold text-slate-900 transition hover:text-teal-600 line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-bold text-amber-500">
              <FaStar className="text-xs" /> {product.rating ? product.rating.toFixed(1) : 'New'}
            </span>
            {product.numReviews > 0 && (
              <span className="text-slate-600">({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})</span>
            )}
          </div>
        </div>

        {/* Bottom Pricing and Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-lg font-black text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs font-semibold text-slate-600 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              {product.countInStock > 0 ? (
                <span className="text-emerald-600">In Stock</span>
              ) : (
                <span className="text-rose-500">Out of Stock</span>
              )}
            </p>
          </div>

          <button
            className="btn-primary !p-2.5 !rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={product.countInStock === 0 || user?.role === 'seller'}
            onClick={handleAdd}
            title={
              user?.role === 'seller'
                ? 'Sellers cannot purchase items'
                : product.countInStock === 0
                ? 'Out of stock'
                : 'Add to Cart'
            }
            aria-label="Add to cart"
          >
            <FaCartPlus className="text-base" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
