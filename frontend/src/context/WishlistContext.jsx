/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api, { getError } from '../services/api'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchWishlist = useCallback(async () => {
    if (!user || user.role !== 'customer') {
      setWishlist([])
      return
    }
    try {
      setLoading(true)
      const { data } = await api.get('/wishlist')
      setWishlist(Array.isArray(data) ? data : [])
    } catch {
      // silently handle or ignore on load
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false
      return wishlist.some((item) => {
        const id = typeof item === 'string' ? item : item._id
        return id === productId
      })
    },
    [wishlist]
  )

  const toggleWishlist = useCallback(
    async (product) => {
      if (!user) {
        toast.error('Please login to save items to your wishlist')
        return false
      }
      if (user.role !== 'customer') {
        toast.error('Only customer accounts have a wishlist')
        return false
      }

      const productId = typeof product === 'object' ? product._id : product
      const alreadyIn = isInWishlist(productId)

      // Optimistic update
      if (alreadyIn) {
        setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId))
      } else if (typeof product === 'object') {
        setWishlist((prev) => [product, ...prev])
      }

      try {
        const { data } = await api.post('/wishlist/toggle', { productId })
        if (data.isAdded) {
          toast.success('Added to wishlist ❤️')
        } else {
          toast.success('Removed from wishlist')
        }
        fetchWishlist()
        return data.isAdded
      } catch (error) {
        // Rollback
        fetchWishlist()
        toast.error(getError(error))
        return false
      }
    },
    [fetchWishlist, isInWishlist, user]
  )

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        refreshWishlist: fetchWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
