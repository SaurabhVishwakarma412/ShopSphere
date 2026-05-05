import { useEffect, useState } from 'react'
import { FaSave } from 'react-icons/fa'

const emptyProduct = {
  name: '',
  brand: '',
  category: '',
  description: '',
  price: '',
  countInStock: '',
  imageUrl: '',
}

function ProductForm({ initialProduct, onSubmit, loading }) {
  const [form, setForm] = useState(emptyProduct)

  useEffect(() => {
    setForm(initialProduct ? { ...emptyProduct, ...initialProduct } : emptyProduct)
  }, [initialProduct])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      ...form,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
    })
  }

  return (
    <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2" onSubmit={handleSubmit}>
      {['name', 'brand', 'category', 'imageUrl'].map((field) => (
        <label className="grid gap-2 text-sm font-bold text-slate-700" key={field}>
          {field === 'imageUrl' ? 'Image URL' : field[0].toUpperCase() + field.slice(1)}
          <input className="form-input" name={field} value={form[field]} onChange={handleChange} required={field !== 'brand'} />
        </label>
      ))}
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Price
        <input className="form-input" min="0" name="price" type="number" value={form.price} onChange={handleChange} required />
      </label>
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Stock
        <input className="form-input" min="0" name="countInStock" type="number" value={form.countInStock} onChange={handleChange} required />
      </label>
      <label className="grid gap-2 text-sm font-bold text-slate-700 md:col-span-2">
        Description
        <textarea className="form-input min-h-28" name="description" value={form.description} onChange={handleChange} required />
      </label>
      <button className="btn-primary md:col-span-2" disabled={loading}>
        <FaSave /> {loading ? 'Saving...' : 'Save product'}
      </button>
    </form>
  )
}

export default ProductForm
