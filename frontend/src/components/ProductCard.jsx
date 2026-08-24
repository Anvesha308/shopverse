import { Link } from 'react-router-dom'
import { Star, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast('Please log in to add items to your cart')
      navigate('/login')
      return
    }
    addToCart(product.id, 1)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-surface rounded-2xl border border-line overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className="relative aspect-square bg-[#F3F1E9] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discountPercent > 0 && (
          <div className="tag-notch absolute top-0 left-0 bg-deal text-white text-xs font-bold px-3 py-1.5">
            {product.discountPercent}% OFF
          </div>
        )}
        <button
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-2 right-2 bg-cta text-ink rounded-full p-2 shadow-md hover:bg-cta-dark hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <span className="text-[11px] uppercase tracking-wide text-ink-soft font-medium">{product.brand}</span>
        <h3 className="text-sm font-semibold text-ink line-clamp-2 leading-snug">{product.name}</h3>

        {product.ratingCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-ink-soft">
            <span className="flex items-center gap-0.5 bg-ok-light text-ok font-semibold px-1.5 py-0.5 rounded">
              {product.rating} <Star size={11} fill="currentColor" />
            </span>
            <span>({product.ratingCount})</span>
          </div>
        )}

        <div className="mt-auto pt-1.5 flex items-baseline gap-2 font-mono-price">
          <span className="text-lg font-bold text-ink">₹{Number(product.price).toLocaleString('en-IN')}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-xs text-ink-soft line-through">₹{Number(product.mrp).toLocaleString('en-IN')}</span>
          )}
        </div>

        {product.stock === 0 && (
          <span className="text-xs font-semibold text-deal mt-0.5">Out of stock</span>
        )}
      </div>
    </Link>
  )
}
