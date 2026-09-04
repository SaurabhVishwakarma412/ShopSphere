import { useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt, FaSave, FaTimes, FaTag, FaPalette, FaRuler, FaListUl } from 'react-icons/fa'

const emptyProduct = {
  name: '',
  brand: '',
  category: 'Electronics',
  description: '',
  price: '',
  originalPrice: '',
  countInStock: '',
  sku: '',
  colors: '',
  sizes: '',
  tags: '',
  features: '',
}

const COMMON_CATEGORIES = [
  'Electronics',
  'Fashion & Apparel',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Books & Stationery',
  'Toys & Games',
  'Jewelry & Accessories',
]

function ProductForm({ initialProduct, onSubmit, loading }) {
  const [form, setForm] = useState(emptyProduct)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const previewUrlsRef = useRef([])

  const currentImages = initialProduct?.images?.length
    ? initialProduct.images
    : initialProduct?.imageUrl
    ? [initialProduct.imageUrl]
    : []

  useEffect(() => {
    if (initialProduct) {
      setForm({
        ...emptyProduct,
        ...initialProduct,
        originalPrice: initialProduct.originalPrice || '',
        sku: initialProduct.sku || '',
        colors: Array.isArray(initialProduct.colors)
          ? initialProduct.colors.join(', ')
          : initialProduct.colors || '',
        sizes: Array.isArray(initialProduct.sizes)
          ? initialProduct.sizes.join(', ')
          : initialProduct.sizes || '',
        tags: Array.isArray(initialProduct.tags)
          ? initialProduct.tags.join(', ')
          : initialProduct.tags || '',
        features: Array.isArray(initialProduct.features)
          ? initialProduct.features.join('\n')
          : initialProduct.features || '',
      })
    } else {
      setForm(emptyProduct)
    }

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
    setImageFiles((prev) => [...prev, ...files])
    setImagePreviews((prev) => [...prev, ...previews])
    previewUrlsRef.current.push(...previews)
    event.target.value = ''
  }

  const removeImage = (index) => {
    const preview = imagePreviews[index]
    URL.revokeObjectURL(preview)
    previewUrlsRef.current = previewUrlsRef.current.filter((url) => url !== preview)
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = new FormData()

    payload.append('name', form.name.trim())
    payload.append('brand', form.brand.trim())
    payload.append('category', form.category.trim())
    payload.append('description', form.description.trim())
    payload.append('price', Number(form.price))
    if (form.originalPrice) payload.append('originalPrice', Number(form.originalPrice))
    payload.append('countInStock', Number(form.countInStock))
    if (form.sku) payload.append('sku', form.sku.trim())

    // Convert comma-separated or line-separated fields to arrays
    const colors = form.colors
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const sizes = form.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const tags = form.tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const features = form.features
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    payload.append('colors', JSON.stringify(colors))
    payload.append('sizes', JSON.stringify(sizes))
    payload.append('tags', JSON.stringify(tags))
    payload.append('features', JSON.stringify(features))

    imageFiles.forEach((file) => payload.append('images', file))

    onSubmit(payload)
  }

  return (
    <form
      className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-md space-y-8"
      onSubmit={handleSubmit}
    >
      {/* Section 1: Basic Information */}
      <div>
        <div className="border-b border-slate-100 pb-3 mb-5">
          <h3 className="font-display text-lg font-bold text-slate-900">Basic Information</h3>
          <p className="text-xs text-slate-500">Provide the title, brand, and category for your item.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold text-slate-700 md:col-span-2">
            Product Title <span className="text-rose-500">*</span>
            <input
              className="form-input text-base"
              name="name"
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Brand / Manufacturer
            <input
              className="form-input"
              name="brand"
              placeholder="e.g. Sony, Apple, Nike"
              value={form.brand}
              onChange={handleChange}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Category <span className="text-rose-500">*</span>
            <div className="relative">
              <input
                className="form-input list-none"
                name="category"
                list="category-options"
                placeholder="Select or type a category"
                value={form.category}
                onChange={handleChange}
                required
              />
              <datalist id="category-options">
                {COMMON_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </label>
        </div>
      </div>

      {/* Section 2: Pricing & Stock Inventory */}
      <div>
        <div className="border-b border-slate-100 pb-3 mb-5">
          <h3 className="font-display text-lg font-bold text-slate-900">Pricing & Inventory</h3>
          <p className="text-xs text-slate-500">Manage your product pricing, discounts, and inventory counts.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Selling Price (₹) <span className="text-rose-500">*</span>
            <input
              className="form-input"
              min="0"
              step="0.01"
              name="price"
              type="number"
              placeholder="e.g. 2999"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Original / MRP Price (₹)
            <input
              className="form-input"
              min="0"
              step="0.01"
              name="originalPrice"
              type="number"
              placeholder="e.g. 3999 (for discount %)"
              value={form.originalPrice}
              onChange={handleChange}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Inventory Units in Stock <span className="text-rose-500">*</span>
            <input
              className="form-input"
              min="0"
              name="countInStock"
              type="number"
              placeholder="e.g. 25"
              value={form.countInStock}
              onChange={handleChange}
              required
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700 sm:col-span-3">
            SKU (Stock Keeping Unit / Barcode)
            <input
              className="form-input"
              name="sku"
              placeholder="e.g. PROD-SNY-001"
              value={form.sku}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      {/* Section 3: Variants & Attributes (Colors, Sizes, Tags) */}
      <div>
        <div className="border-b border-slate-100 pb-3 mb-5">
          <h3 className="font-display text-lg font-bold text-slate-900">Variants & Tags</h3>
          <p className="text-xs text-slate-500">Add available options for customers to choose.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            <span className="flex items-center gap-2">
              <FaPalette className="text-teal-600" /> Available Colors (comma-separated)
            </span>
            <input
              className="form-input"
              name="colors"
              placeholder="e.g. Midnight Black, Silver, Navy Blue"
              value={form.colors}
              onChange={handleChange}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            <span className="flex items-center gap-2">
              <FaRuler className="text-teal-600" /> Available Sizes (comma-separated)
            </span>
            <input
              className="form-input"
              name="sizes"
              placeholder="e.g. S, M, L, XL or 8, 9, 10 or 128GB, 256GB"
              value={form.sizes}
              onChange={handleChange}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700 sm:col-span-2">
            <span className="flex items-center gap-2">
              <FaTag className="text-teal-600" /> Search Tags & Keywords (comma-separated)
            </span>
            <input
              className="form-input"
              name="tags"
              placeholder="e.g. Wireless, Noise-Cancelling, Best Seller, Travel"
              value={form.tags}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      {/* Section 4: Visuals & Images Upload */}
      <div>
        <div className="border-b border-slate-100 pb-3 mb-5">
          <h3 className="font-display text-lg font-bold text-slate-900">Product Images</h3>
          <p className="text-xs text-slate-500">Upload high quality photos from multiple angles (up to 5 images).</p>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-teal-300/80 bg-teal-50/40 p-6 transition hover:bg-teal-50/70">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="grid size-12 place-items-center rounded-2xl bg-teal-600 text-white shadow-md">
              <FaCloudUploadAlt className="text-2xl" />
            </div>
            <p className="mt-3 text-sm font-bold text-slate-800">
              {initialProduct ? 'Select replacement product images' : 'Upload product images'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PNG, JPG, WebP up to 5MB each. (Max 5 photos total)
            </p>

            <input
              accept="image/*"
              className="mt-4 block text-sm font-medium text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-teal-700 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-teal-800 cursor-pointer"
              disabled={imageFiles.length === 5}
              multiple
              onChange={handleImagesChange}
              required={!initialProduct && imageFiles.length === 0}
              type="file"
            />
          </div>

          {/* Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-6 pt-4 border-t border-teal-200/50">
              <p className="text-xs font-bold text-teal-800 mb-3">
                Selected Images ({imagePreviews.length}/5):
              </p>
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((preview, index) => (
                  <div className="relative group" key={preview}>
                    <img
                      className="size-24 rounded-xl border border-teal-300 object-cover shadow-sm"
                      src={preview}
                      alt={`Selected preview ${index + 1}`}
                    />
                    <button
                      aria-label="Remove image"
                      className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-rose-600 text-xs text-white shadow-md transition hover:scale-110"
                      onClick={() => removeImage(index)}
                      type="button"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!imagePreviews.length && currentImages.length > 0 && (
            <div className="mt-6 pt-4 border-t border-teal-200/50">
              <p className="text-xs font-bold text-slate-700 mb-3">Current Active Photos:</p>
              <div className="flex flex-wrap gap-3">
                {currentImages.map((image, index) => (
                  <img
                    className="size-20 rounded-xl border border-slate-200 object-cover shadow-sm"
                    src={image}
                    alt={`Current product ${index + 1}`}
                    key={image}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 5: Descriptions & Key Features */}
      <div>
        <div className="border-b border-slate-100 pb-3 mb-5">
          <h3 className="font-display text-lg font-bold text-slate-900">Description & Highlights</h3>
          <p className="text-xs text-slate-500">Provide detailed storytelling and bulleted key highlights.</p>
        </div>

        <div className="grid gap-5">
          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            Full Description <span className="text-rose-500">*</span>
            <textarea
              className="form-input min-h-32"
              name="description"
              placeholder="Describe the product details, materials, compatibility, warranty, and why customers will love it..."
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
            <span className="flex items-center gap-2">
              <FaListUl className="text-teal-600" /> Key Features (one per line)
            </span>
            <textarea
              className="form-input min-h-24 font-mono text-xs"
              name="features"
              placeholder={'Up to 30-hour battery life with quick charging\nIndustry-leading noise cancellation\nTouch sensor controls to pause/play\nMultipoint connection'}
              value={form.features}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      {/* Form Submission */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          className="btn-primary w-full sm:w-auto px-8 py-3 text-base shadow-lg"
          disabled={loading}
          type="submit"
        >
          <FaSave /> {loading ? 'Saving Changes...' : initialProduct ? 'Update Product' : 'Publish Product to Store'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
