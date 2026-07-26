import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaCartPlus, FaChevronLeft, FaShieldAlt, FaTruck } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import api, { getError } from '../services/api'
import { formatCurrency } from '../utils/formatters'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch((err) => setError(getError(err)))
  }, [id])

  if (error) return <div className="page-shell rounded-lg bg-rose-50 p-5 font-bold text-rose-700">{error}</div>
  if (!product) return <div className="page-shell rounded-lg bg-white p-5 font-bold text-slate-500">Loading product...</div>

  const handleAdd = () => {
    addToCart(product, Math.min(product.countInStock, Math.max(1, quantity)))
    toast.success('Added to cart')
  }

  const images = product.images?.length ? product.images : [product.imageUrl]

  return (
    <div className="page-shell space-y-4">
      <Link className="inline-flex items-center gap-2 font-bold text-teal-700" to="/">
        <FaChevronLeft /> Back to shop
      </Link>
      <section className="grid gap-6 rounded-lg border border-slate-200 bg-white p-2 shadow-sm lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {images.map((image, index) => (
            <img className={`w-full rounded-lg object-cover ${images.length === 1 ? 'aspect-square sm:col-span-2' : 'aspect-square'}`} src={image} alt={`${product.name} ${index + 1}`} key={image} />
          ))}
        </div>
        <div className="space-y-6">
          <div>
            <p className="font-bold uppercase tracking-wide text-teal-700">{product.category}</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">{product.name}</h1>
            <p className="mt-2 text-slate-500">Sold by {product.seller?.name}</p>
          </div>
          <p className="text-3xl font-black">{formatCurrency(product.price)}</p>
          <p className="leading-7 text-slate-600">{product.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <FaTruck className="text-teal-700" />
              <p className="mt-2 font-black">Fast dispatch</p>
              <p className="text-sm text-slate-500">Free shipping over Rs. 999</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <FaShieldAlt className="text-teal-700" />
              <p className="mt-2 font-black">Protected checkout</p>
              <p className="text-sm text-slate-500">Demo payment status is marked paid</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="form-input sm:max-w-28"
              min="1"
              max={product.countInStock}
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value) || 1)}
            />
            <button className="btn-primary flex-1 disabled:bg-slate-300" disabled={product.countInStock === 0 || user?.role === 'seller'} onClick={handleAdd}>
              <FaCartPlus /> Add to cart
            </button>
          </div>
          <p className="font-bold text-slate-500">{product.countInStock} item(s) available</p>
        </div>
      </section>
    </div>
  )
}

export default ProductDetails
