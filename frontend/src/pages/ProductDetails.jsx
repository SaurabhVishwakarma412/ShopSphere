import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  FaCartPlus,
  FaCheck,
  FaChevronLeft,
  FaHeart,
  FaRegHeart,
  FaShieldAlt,
  FaStar,
  FaTruck,
  FaUndo,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import api, { getError } from '../services/api'
import { formatCurrency } from '../utils/formatters'

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const inWishlist = product ? isInWishlist(product._id) : false

  const loadProductAndReviews = useCallback(async () => {
    try {
      setLoading(true)
      const [prodRes, revRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/products/${id}/reviews`).catch(() => ({ data: [] })),
      ])
      setProduct(prodRes.data)
      setReviews(revRes.data || [])
      if (prodRes.data.colors?.length) setSelectedColor(prodRes.data.colors[0])
      if (prodRes.data.sizes?.length) setSelectedSize(prodRes.data.sizes[0])
      setError('')
    } catch (err) {
      setError(getError(err))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadProductAndReviews()
  }, [id, loadProductAndReviews])

  if (loading) {
    return (
      <div className="page-shell py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent" />
        <p className="mt-3 font-semibold text-slate-500">Loading product details...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="page-shell py-8">
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-8 text-center text-rose-700 font-bold">
          {error || 'Product not found'}
          <div className="mt-4">
            <Link to="/" className="btn-secondary">
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const images = product.images?.length
    ? product.images
    : product.imageUrl
    ? [product.imageUrl]
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80']

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        selectedColor,
        selectedSize,
      },
      Math.min(product.countInStock, Math.max(1, quantity))
    )
    toast.success(`${product.name} added to cart!`)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please log in as a customer to leave a review')
      return
    }
    try {
      setSubmittingReview(true)
      const { data } = await api.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      })
      toast.success(data.message || 'Review submitted successfully!')
      setReviewComment('')
      setReviewTitle('')
      loadProductAndReviews()
    } catch (err) {
      toast.error(getError(err))
    } finally {
      setSubmittingReview(false)
    }
  }

  return (
    <div className="page-shell space-y-10 pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-teal-700 inline-flex items-center gap-1 font-semibold">
          <FaChevronLeft className="text-xs" /> Store
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{product.category}</span>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <section className="grid gap-10 lg:grid-cols-12 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
            <img
              className="h-full w-full object-contain p-4 transition duration-300"
              src={images[selectedImage] || images[0]}
              alt={product.name}
            />
            {discountPercent > 0 && (
              <span className="absolute left-4 top-4 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-black tracking-wider text-white shadow-md">
                SAVE {discountPercent}%
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-teal-600 ring-2 ring-teal-600/30'
                      : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img className="h-full w-full object-cover" src={img} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Information & Purchase Controls */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-700">
                  {product.category}
                </span>
                {product.sku && (
                  <span className="text-xs font-mono text-slate-600">SKU: {product.sku}</span>
                )}
              </div>

              <h1 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 leading-snug">
                {product.name}
              </h1>

              <p className="mt-1 text-sm text-slate-500 font-medium">
                Brand: <span className="font-bold text-slate-800">{product.brand || 'Unbranded'}</span> •
                Sold by: <span className="font-bold text-teal-700">{product.seller?.name || 'Authorized Seller'}</span>
              </p>
            </div>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-500 font-black">
                <FaStar />
                <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
              </div>
              <span className="text-sm font-semibold text-slate-600">
                ({reviews.length} customer {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
              <span className="h-3 w-px bg-slate-300" />
              <span
                className={`text-xs font-bold ${
                  product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {product.countInStock > 0
                  ? `In Stock (${product.countInStock} available)`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Pricing Section */}
            <div className="pt-2 border-t border-slate-100 flex items-baseline gap-3">
              <span className="font-display text-3xl sm:text-4xl font-black text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg font-semibold text-slate-600 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-line">
              {product.description}
            </p>

            {/* Variants: Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Color: <span className="text-teal-700">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedColor === color
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-600/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variants: Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Size / Option: <span className="text-teal-700">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedSize === size
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-600/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Features Checklist */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Key Highlights:
                </label>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-teal-100 text-teal-800 text-[10px] mt-0.5">
                        <FaCheck />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="size-9 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                  className="size-9 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                  disabled={quantity >= product.countInStock}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                className="btn-primary flex-1 !py-3 !text-base shadow-md disabled:opacity-40"
                disabled={product.countInStock === 0 || user?.role === 'seller'}
                onClick={handleAddToCart}
              >
                <FaCartPlus />
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* Wishlist Button */}
              {user?.role !== 'seller' && (
                <button
                  className={`grid size-12 place-items-center rounded-xl border transition ${
                    inWishlist
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => toggleWishlist(product)}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  {inWishlist ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                </button>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-slate-700">
                <FaTruck className="text-teal-600 text-sm shrink-0" />
                <span className="text-[11px] font-semibold">Free shipping &gt; ₹999</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-slate-700">
                <FaShieldAlt className="text-teal-600 text-sm shrink-0" />
                <span className="text-[11px] font-semibold">Authentic & Verified</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-slate-700">
                <FaUndo className="text-teal-600 text-sm shrink-0" />
                <span className="text-[11px] font-semibold">7 Days Replacement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Feedback Section */}
      <section className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-display text-2xl font-bold text-slate-900">Ratings & Customer Reviews</h2>
          <p className="text-xs text-slate-500">Real feedback from verified purchasers and customers.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Write a review form */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-50 p-6 border border-slate-200/80">
            <h3 className="font-display text-base font-bold text-slate-900 mb-3">Write a Customer Review</h3>
            {user?.role === 'customer' ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl transition ${
                          star <= reviewRating ? 'text-amber-400' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2">{reviewRating} out of 5 stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Incredible sound quality and battery life!"
                    className="form-input text-xs"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Review *</label>
                  <textarea
                    required
                    placeholder="What did you like or dislike about this product? How is the fit and build?"
                    className="form-input text-xs min-h-24"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-primary w-full text-xs !py-2.5"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : user?.role === 'seller' ? (
              <p className="text-xs text-slate-500 italic">Seller accounts cannot write customer reviews.</p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">Please sign in as a customer to share your thoughts.</p>
                <Link to="/login" className="btn-secondary w-full text-xs">
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>

          {/* List of reviews */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev._id} className="rounded-2xl border border-slate-100 p-5 space-y-2 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="grid size-8 place-items-center rounded-full bg-teal-100 font-bold text-teal-800 text-xs">
                        {rev.userName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{rev.userName}</p>
                        <p className="text-[10px] text-slate-600">
                          {new Date(rev.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex text-amber-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>

                  {rev.title && <h4 className="font-bold text-sm text-slate-900">{rev.title}</h4>}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-600">
                <p className="font-medium text-sm">No reviews yet for this product.</p>
                <p className="text-xs text-slate-600 mt-1">Be the first to order and review!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductDetails
