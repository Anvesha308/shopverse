import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, Minus, Plus, ShoppingCart, Zap, ChevronLeft } from 'lucide-react'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
    setQty(1)
  }, [id])

  const requireAuth = () => {
    if (!isAuthenticated) {
      toast('Please log in first')
      navigate('/login')
      return false
    }
    return true
  }

  const handleAddToCart = async () => {
    if (!requireAuth()) return
    await addToCart(product.id, qty)
  }

  const handleBuyNow = async () => {
    if (!requireAuth()) return
    await addToCart(product.id, qty)
    navigate('/cart')
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto px-6 py-16 text-center text-ink-soft">Loading product…</div>
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-ink-soft">We couldn't find that product.</p>
        <Link to="/" className="text-brand font-semibold hover:underline">Back to home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-ink-soft hover:text-brand mb-5">
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative bg-[#F3F1E9] rounded-2xl overflow-hidden aspect-square">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          {product.discountPercent > 0 && (
            <div className="tag-notch absolute top-0 left-0 bg-deal text-white text-sm font-bold px-4 py-2">
              {product.discountPercent}% OFF
            </div>
          )}
        </div>

        <div>
          <span className="text-xs uppercase tracking-wide font-semibold text-brand">{product.categoryName}</span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mt-1">{product.name}</h1>
          <p className="text-ink-soft text-sm mt-1">by {product.brand}</p>

          {product.ratingCount > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <span className="flex items-center gap-1 bg-ok-light text-ok font-semibold px-2 py-0.5 rounded text-sm">
                {product.rating} <Star size={13} fill="currentColor" />
              </span>
              <span className="text-sm text-ink-soft">{product.ratingCount} ratings</span>
            </div>
          )}

          <div className="mt-5 flex items-baseline gap-3 font-mono-price">
            <span className="text-3xl font-bold">₹{Number(product.price).toLocaleString('en-IN')}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-base text-ink-soft line-through">₹{Number(product.mrp).toLocaleString('en-IN')}</span>
                <span className="text-sm font-semibold text-deal">{product.discountPercent}% off</span>
              </>
            )}
          </div>

          <p className="text-sm mt-1">
            {product.stock > 0
              ? <span className="text-ok font-medium">In stock ({product.stock} available)</span>
              : <span className="text-deal font-medium">Out of stock</span>}
          </p>

          <p className="mt-5 text-sm text-ink-soft leading-relaxed">{product.description}</p>

          {product.stock > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center border border-line rounded-full">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 hover:text-brand" aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-2.5 hover:text-brand" aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-brand text-white font-semibold py-3 rounded-full hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button
              disabled={product.stock === 0}
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 bg-cta text-ink font-semibold py-3 rounded-full hover:bg-cta-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap size={18} /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
