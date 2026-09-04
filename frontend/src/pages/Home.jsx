import { useEffect, useMemo, useState } from 'react'
import { FaSearch, FaStore } from 'react-icons/fa'
import ProductCard from '../components/ProductCard.jsx'
import api, { getError } from '../services/api'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/products', { params: { search, category, sort } })
        setProducts(data)
        setError('')
      } catch (err) {
        setError(getError(err))
      } finally {
        setLoading(false)
      }
    }
    const timer = setTimeout(loadProducts, 250)
    return () => clearTimeout(timer)
  }, [search, category, sort])

  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products])

  return (
    <div className="page-shell space-y-8">
      <section className="grid gap-8 rounded-lg bg-slate-950 p-8 text-white md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-sm font-bold text-teal-100">
            <FaStore /> Seller and customer marketplace
          </span>
          <h1 className="max-w-2xl text-4xl font-black leading-tight md:text-6xl">ShopSphere</h1>
          <p className="max-w-xl text-lg text-slate-300">
            Discover products from independent sellers, add them to cart, and checkout with a clean role-based MERN flow.
          </p>
        </div>
        <img
          className="h-72 w-full rounded-lg object-cover"
          src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1100&q=80"
          alt="Online shopping"
        />
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
        <label className="relative flex-1">
          <FaSearch className="absolute right-3 top-3.5 text-slate-400" />
          <input
            className="form-input pl-10"
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <div className="grid gap-3 md:grid-cols-2 md:max-w-xl">
          <select className="form-input" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="form-input" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
            <option value="newest">Newest arrivals</option>
            <option value="rating">Top rated</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>
      </section>

      {error && <p className="rounded-lg bg-rose-50 p-4 font-bold text-rose-700">{error}</p>}
      {loading ? (
        <p className="rounded-lg bg-white p-6 text-center font-bold text-slate-500">Loading products...</p>
      ) : products.length ? (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      ) : (
        <p className="rounded-lg bg-white p-6 text-center font-bold text-slate-500">No products found.</p>
      )}
    </div>
  )
}

export default Home
