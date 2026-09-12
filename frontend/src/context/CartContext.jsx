/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { calculatePromotion, normalizeCouponCode } from '../utils/promotions'

const CartContext = createContext(null)

const getStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(getStoredCart)
  const [couponCode, setCouponCode] = useState(() => localStorage.getItem('couponCode') || '')

  const clampQuantity = (quantity, stock) => {
    const parsedQuantity = Number(quantity)
    const parsedStock = Number(stock)
    if (!Number.isFinite(parsedQuantity)) return 1
    if (!Number.isFinite(parsedStock) || parsedStock < 1) return 1
    return Math.max(1, Math.min(parsedStock, Math.floor(parsedQuantity)))
  }

  const persist = (nextItems) => {
    setItems(nextItems)
    localStorage.setItem('cart', JSON.stringify(nextItems))
  }

  const addToCart = (product, quantity = 1) => {
    const safeQuantity = clampQuantity(quantity, product.countInStock)
    const existing = items.find((item) => item._id === product._id)
    const nextItems = existing
      ? items.map((item) =>
          item._id === product._id
            ? { ...item, quantity: clampQuantity(item.quantity + safeQuantity, item.countInStock) }
            : item,
        )
      : [...items, { ...product, quantity: safeQuantity }]
    persist(nextItems)
  }

  const updateQuantity = (id, quantity) => {
    persist(
      items.map((item) =>
        item._id === id ? { ...item, quantity: clampQuantity(quantity, item.countInStock) } : item,
      ),
    )
  }

  const removeFromCart = (id) => persist(items.filter((item) => item._id !== id))
  const applyCoupon = (code) => {
    const nextCode = normalizeCouponCode(code)
    setCouponCode(nextCode)
    localStorage.setItem('couponCode', nextCode)
  }
  const removeCoupon = () => {
    setCouponCode('')
    localStorage.removeItem('couponCode')
  }
  const clearCart = () => {
    removeCoupon()
    persist([])
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal > 999 || subtotal === 0 ? 0 : 79
    const coupon = calculatePromotion({ code: couponCode, subtotal, shipping })
    const discount = subtotal === 0 ? 0 : coupon.discount
    const taxableSubtotal = Math.max(0, subtotal - discount)
    const tax = Number((taxableSubtotal * 0.18).toFixed(2))
    return {
      subtotal,
      shipping,
      discount,
      coupon,
      tax,
      total: Number((subtotal + shipping - discount + tax).toFixed(2)),
    }
  }, [couponCode, items])

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        couponCode,
        totals,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
