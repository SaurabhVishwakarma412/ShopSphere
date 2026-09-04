import { useEffect, useMemo, useState } from 'react'
import {
  FaArrowRight,
  FaFilter,
  FaFire,
  FaLock,
  FaRedoAlt,
  FaSearch,
  FaShippingFast,
  FaStar,
  FaTags,
  FaTimes,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import api, { getError } from '../services/api'

const QUICK_CATEGORIES = [
  'All',
  'Electronics',
  'Fashion & Apparel',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
]

function Home() {
  const [products, setProducts] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch distinct categories
  useEffect(() => {
    api
      .get('/products/categories')
      .then(({ data }) => setAllCategories(data))
      .catch(() => {})
  }, [])

  // Fetch products with debounce
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const params = {
          search,
          category,
          sort,
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
        }
        const { data } = await api.get('/products', { params })
        setProducts(data)
        setError('')
      } catch (err) {
        setError(getError(err))
      } finally {
        setLoading(false)
      }
    }
    const timer = setTimeout(loadProducts, 280)
    return () => clearTimeout(timer)
  }, [search, category, sort, minPrice, maxPrice])

  const categories = useMemo(() => {
    const combined = new Set([...QUICK_CATEGORIES.slice(1), ...allCategories])
    return Array.from(combined)
  }, [allCategories])

  const clearAllFilters = () => {
    setSearch('')
    setCategory('')
    setSort('newest')
    setMinPrice('')
    setMaxPrice('')
  }

  const hasActiveFilters = search || category || minPrice || maxPrice || sort !== 'newest'

  return (
    <div className="page-shell space-y-12 pb-16">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-teal-950 px-8 py-14 md:py-20 text-white shadow-2xl shadow-slate-950/20">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-bold text-teal-300 backdrop-blur-md">
              <FaFire className="text-amber-400" /> Curated Independent Marketplace
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Elevate Your Everyday <span className="bg-linear-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">Living</span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Explore authentic products from certified creators and independent sellers. Enjoy lightning fast delivery and secure buyer protection.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalog"
                className="btn-primary !px-7 !py-3 text-base shadow-lg shadow-teal-500/30 font-bold"
              >
                Shop Now <FaArrowRight />
              </a>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-base font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
              >
                Become a Seller
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="relative mx-auto aspect-4/3 w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/60 shadow-2xl">
              <img
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80"
                alt="Curated lifestyle showcase"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/10 p-3 backdrop-blur-md border border-white/20">
                <p className="text-xs font-bold text-teal-300 uppercase tracking-wider">Trending This Week</p>
                <p className="text-sm font-bold text-white">Modern Audio & Lifestyle Essentials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Perks / Value Props Banner */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <FaShippingFast className="text-xl" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Free Shipping</p>
            <p className="text-xs text-slate-500">On all orders over ₹999</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <FaLock className="text-xl" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Secure Checkout</p>
            <p className="text-xs text-slate-500">UPI, Cards & Cash on Delivery</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
            <FaStar className="text-xl" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Verified Sellers</p>
            <p className="text-xs text-slate-500">100% authentic merchandise</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
            <FaRedoAlt className="text-xl" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Easy Returns</p>
            <p className="text-xs text-slate-500">Hassle-free 7 day replacement</p>
          </div>
        </div>
      </section>

      {/* 3. Catalog Controls & Search */}
      <section id="catalog" className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setCategory('')}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              category === ''
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? '' : cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search and Filters bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
              <input
                className="form-input pl-10"
                placeholder="Search products by title, brand, tag, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Sort & Filter Toggle */}
            <div className="flex items-center gap-2">
              <select
                className="form-input md:w-48 text-sm"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-secondary text-sm ${showFilters ? '!border-teal-600 !text-teal-700' : ''}`}
              >
                <FaFilter /> Filters
              </button>
            </div>
          </div>

          {/* Collapsible Price Filter Tray */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FaTags className="text-teal-600" /> Price Range:
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  className="form-input w-24 !py-1.5 text-xs"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  className="form-input w-24 !py-1.5 text-xs"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-rose-600 hover:underline ml-auto"
                >
                  Reset all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. Products Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            {category ? `${category}` : 'Featured Products'}
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {products.length} {products.length === 1 ? 'item' : 'items'} available
          </span>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 text-center text-rose-700 font-bold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 space-y-4"
              >
                <div className="aspect-4/3 w-full rounded-xl bg-slate-200" />
                <div className="h-4 w-1/3 rounded bg-slate-200" />
                <div className="h-5 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-xs">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-teal-50 text-teal-600 mb-4">
              <FaSearch className="text-2xl" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-800">No matching products found</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
              We couldn't find any products matching your current filters. Try searching for something else or clearing your criteria.
            </p>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="btn-secondary mt-6">
                Clear Filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* 5. Newsletter / Community Box */}
      <section className="rounded-3xl bg-linear-to-r from-teal-800 to-teal-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-300">Stay Ahead</span>
          <h2 className="font-display text-3xl font-black">Get 15% Off Your Next Order</h2>
          <p className="text-sm text-teal-100 leading-relaxed">
            Subscribe to our weekly curated newsletter for secret drop alerts, seasonal discounts, and featured artisan spotlights.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              alert('Thank you for subscribing to ShopSphere updates!')
            }}
            className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder:text-teal-200/60 border border-white/20 outline-none focus:border-white focus:bg-white/20 transition flex-1"
            />
            <button type="submit" className="btn-primary !bg-white !text-slate-900 font-bold hover:!bg-teal-50">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home
