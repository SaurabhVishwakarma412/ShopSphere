import { useEffect, useRef, useState } from 'react'
import { FaSave, FaTimes } from 'react-icons/fa'

const emptyProduct = {
  name: '',
  brand: '',
  category: '',
  description: '',
  price: '',
  countInStock: '',
}

function ProductForm({ initialProduct, onSubmit, loading }) {
  const [form, setForm] = useState(emptyProduct)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const previewUrlsRef = useRef([])
  const currentImages = initialProduct?.images?.length ? initialProduct.images : initialProduct?.imageUrl ? [initialProduct.imageUrl] : []

  useEffect(() => {
    setForm(initialProduct ? { ...emptyProduct, ...initialProduct } : emptyProduct)
    setImageFiles([])
    setImagePreviews([])
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrlsRef.current = []
  }, [initialProduct])

  useEffect(() => () => previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url)), [])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleImagesChange = (event) => {
    const remainingSlots = 5 - imageFiles.length
    const files = Array.from(event.target.files).slice(0, Math.max(0, remainingSlots))
    const previews = files.map((file) => URL.createObjectURL(file))
    setImageFiles((previousFiles) => [...previousFiles, ...files])
    setImagePreviews((previousPreviews) => [...previousPreviews, ...previews])
    previewUrlsRef.current.push(...previews)
    event.target.value = ''
  }

  const removeImage = (index) => {
    const preview = imagePreviews[index]
    URL.revokeObjectURL(preview)
    previewUrlsRef.current = previewUrlsRef.current.filter((url) => url !== preview)
    setImageFiles((previousFiles) => previousFiles.filter((_, fileIndex) => fileIndex !== index))
    setImagePreviews((previousPreviews) => previousPreviews.filter((_, previewIndex) => previewIndex !== index))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = new FormData()
    const productFields = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
    }
    Object.entries(productFields).forEach(([key, value]) => payload.append(key, value))
    imageFiles.forEach((file) => payload.append('images', file))
    onSubmit(payload)
  }

  return (
    <form className="grid gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2" onSubmit={handleSubmit}>
      {['name', 'brand', 'category'].map((field) => (
        <label className="grid gap-2 text-sm font-bold text-slate-700" key={field}>
          {field[0].toUpperCase() + field.slice(1)}
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
      <label className="grid gap-2 rounded-lg border border-dashed border-teal-300 bg-teal-50/50 p-4 text-sm font-bold text-slate-700 md:col-span-2">
        Product images {initialProduct ? '(optional - replaces current images)' : ''}
        <input accept="image/*" className="block w-full cursor-pointer rounded-md border border-slate-300 bg-white p-2 text-sm font-normal text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:font-bold file:text-white hover:file:bg-teal-800" disabled={imageFiles.length === 5} multiple onChange={handleImagesChange} required={!initialProduct && imageFiles.length === 0} type="file" />
        <span className="text-xs font-normal text-slate-500">Choose up to 5 images, 5 MB each. You can select images more than once.</span>
        {imageFiles.length > 0 && <span className="text-xs font-normal text-teal-700">{imageFiles.length} image(s) selected</span>}
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-1">
            {imagePreviews.map((preview, index) => (
              <div className="relative" key={preview}>
                <img className="size-20 rounded-lg border border-teal-200 object-cover shadow-sm" src={preview} alt={`Selected product image ${index + 1}`} />
                <button aria-label={`Remove selected image ${index + 1}`} className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-rose-600 text-xs text-white shadow" onClick={() => removeImage(index)} type="button"><FaTimes /></button>
              </div>
            ))}
          </div>
        )}
        {!imagePreviews.length && currentImages.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-1">
            {currentImages.map((image, index) => (
              <img className="size-20 rounded-lg border border-slate-200 object-cover shadow-sm" src={image} alt={`Current product image ${index + 1}`} key={image} />
            ))}
          </div>
        )}
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
