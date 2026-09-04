import { useEffect, useState } from 'react'
import {
  FaArrowLeft,
  FaEdit,
  FaExternalLinkAlt,
  FaPlus,
  FaSearch,
  FaTrashAlt,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ProductForm from '../../components/ProductForm.jsx'
import api, { getError } from '../../services/api'
import { formatCurrency } from '../../utils/formatters'

function SellerProducts() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const loadProducts = async () => {
    const { data } = await api.get('/products/mine')
    setProducts(data)
  }

  useEffect(() => {
    loadProducts().catch((error) => toast.error(getError(error)))
  }, [])

  const handleCreateNew = () => {
    setEditing(null)
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEdit = (product) => {
    setEditing(product)
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCloseForm = () => {
    setEditing(null)
    setIsFormOpen(false)
  }

  const saveProduct = async (payload) => {
    try {
      setLoading(true)
      const requestOptions = { headers: { 'Content-Type': 'multipart/form-data' } }
      if (editing) {
        await api.put(`/products/${editing._id}`, payload, requestOptions)
        toast.success('Product updated successfully! 🚀')
      } else {
        await api.post('/products', payload, requestOptions)
        toast.success('Product published to catalog! 🎉')
      }
      handleCloseForm()
      await loadProducts()
    } catch (error) {
      toast.error(getError(error))
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id, name) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product removed')
      await loadProducts()
    } catch (error) {
      toast.error(getError(error))
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="page-shell space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-950">
            {isFormOpen ? (editing ? 'Edit Listing' : 'Create New Product') : 'Products Inventory'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isFormOpen
              ? 'Fill in all product specifications, pricing, tags, and imagery.'
              : 'Track active products, prices, stock levels, and store visibility.'}
          </p>
        </div>

        <div>
          {isFormOpen ? (
            <button onClick={handleCloseForm} className="btn-secondary">
              <FaArrowLeft /> Back to Inventory
            </button>
          ) : (
            <button onClick={handleCreateNew} className="btn-primary">
              <FaPlus /> Add New Product
            </button>
          )}
        </div>
      </div>

      {/* Form View */}
      {isFormOpen ? (
        <div className="max-w-4xl mx-auto">
          <ProductForm initialProduct={editing} loading={loading} onSubmit={saveProduct} />
        </div>
      ) : (
        /* Table View */
        <div className="space-y-4">
          {/* Search bar & metrics */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search products by title, category, SKU..."
                className="form-input pl-10 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category / SKU</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-slate-50/60 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              className="size-14 rounded-xl object-cover border border-slate-200 shrink-0"
                              src={
                                product.imageUrl ||
                                (product.images && product.images[0]) ||
                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
                              }
                              alt={product.name}
                            />
                            <div>
                              <p className="font-display font-bold text-slate-900 line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-xs text-slate-500 font-medium">
                                Brand: {product.brand || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-800">
                            {product.category}
                          </span>
                          {product.sku && (
                            <p className="mt-1 font-mono text-[11px] text-slate-500">
                              SKU: {product.sku}
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          <p className="font-display font-black text-slate-900">
                            {formatCurrency(product.price)}
                          </p>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <p className="text-xs text-slate-400 line-through">
                              {formatCurrency(product.originalPrice)}
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          {product.countInStock > 5 ? (
                            <span className="status-pill bg-emerald-50 text-emerald-700">
                              {product.countInStock} In Stock
                            </span>
                          ) : product.countInStock > 0 ? (
                            <span className="status-pill bg-amber-50 text-amber-700">
                              Low Stock ({product.countInStock})
                            </span>
                          ) : (
                            <span className="status-pill bg-rose-50 text-rose-700">
                              Out of Stock
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/products/${product._id}`}
                              target="_blank"
                              className="p-2 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition"
                              title="View in Store"
                            >
                              <FaExternalLinkAlt className="text-xs" />
                            </Link>
                            <button
                              className="p-2 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition"
                              onClick={() => handleEdit(product)}
                              title="Edit product"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              onClick={() => deleteProduct(product._id, product.name)}
                              title="Delete product"
                            >
                              <FaTrashAlt className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-500">
                        {products.length === 0 ? (
                          <div>
                            <p className="font-bold text-base text-slate-700">
                              No products published yet.
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Get started by adding your first product to the marketplace!
                            </p>
                            <button onClick={handleCreateNew} className="btn-primary mt-4">
                              <FaPlus /> Add First Product
                            </button>
                          </div>
                        ) : (
                          <p>No products matched your search criteria.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellerProducts
