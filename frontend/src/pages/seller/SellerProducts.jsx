import { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import ProductForm from '../../components/ProductForm.jsx'
import api, { getError } from '../../services/api'
import { formatCurrency } from '../../utils/formatters'

function SellerProducts() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadProducts = async () => {
    const { data } = await api.get('/products/mine')
    setProducts(data)
  }

  useEffect(() => {
    loadProducts().catch((error) => toast.error(getError(error)))
  }, [])

  const saveProduct = async (payload) => {
    try {
      setLoading(true)
      const requestOptions = { headers: { 'Content-Type': 'multipart/form-data' } }
      if (editing) {
        await api.put(`/products/${editing._id}`, payload, requestOptions)
        toast.success('Product updated')
      } else {
        await api.post('/products', payload, requestOptions)
        toast.success('Product created')
      }
      setEditing(null)
      await loadProducts()
    } catch (error) {
      toast.error(getError(error))
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      await loadProducts()
    } catch (error) {
      toast.error(getError(error))
    }
  }

  return (
    <div className="page-shell grid gap-6 xl:grid-cols-[420px_1fr]">
      <section>
        <h1 className="mb-4 text-3xl font-black">{editing ? 'Edit product' : 'Add product'}</h1>
        <ProductForm initialProduct={editing} loading={loading} onSubmit={saveProduct} />
        {editing && <button className="btn-secondary mt-3 w-full" onClick={() => setEditing(null)}>Cancel edit</button>}
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">My products</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr className="border-t" key={product._id}>
                  <td className="flex items-center gap-3 p-3 font-bold">
                    <img className="size-12 rounded object-cover" src={product.imageUrl} alt={product.name} />
                    {product.name}
                  </td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{formatCurrency(product.price)}</td>
                  <td className="p-3">{product.countInStock}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="btn-secondary px-3" onClick={() => setEditing(product)} title="Edit product"><FaEdit /></button>
                      <button className="btn-secondary px-3 text-rose-600" onClick={() => deleteProduct(product._id)} title="Delete product"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default SellerProducts
