import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState({ items: [], subtotal: 0, totalItems: 0 })
  const [loading, setLoading] = useState(false)
  const [bump, setBump] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], subtotal: 0, totalItems: 0 })
      return
    }
    setLoading(true)
    try {
      const { data } = await api.get('/cart')
      setCart(data)
    } catch (err) {
      // silent fail on refresh
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const triggerBump = () => {
    setBump(true)
    setTimeout(() => setBump(false), 350)
  }

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      const { data } = await api.post('/cart/items', { productId, quantity })
      setCart(data)
      triggerBump()
      toast.success('Added to cart')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart')
      throw err
    }
  }, [])

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/items/${cartItemId}?quantity=${quantity}`)
      setCart(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update quantity')
    }
  }, [])

  const removeItem = useCallback(async (cartItemId) => {
    try {
      const { data } = await api.delete(`/cart/items/${cartItemId}`)
      setCart(data)
      toast.success('Removed from cart')
    } catch (err) {
      toast.error('Could not remove item')
    }
  }, [])

  return (
    <CartContext.Provider value={{ cart, loading, bump, addToCart, updateQuantity, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
