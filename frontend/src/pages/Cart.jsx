import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, updateQuantity, removeItem, loading } = useCart()
  const navigate = useNavigate()

  if (loading) {
    return <div className="max-w-5xl mx-auto px-6 py-16 text-center text-ink-soft">Loading your cart…</div>
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <ShoppingBag size={52} className="mx-auto text-line mb-4" />
        <h1 className="font-display font-bold text-xl mb-2">Your cart is empty</h1>
        <p className="text-ink-soft text-sm mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/" className="inline-block bg-brand text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-dark transition-colors">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display font-bold text-2xl mb-6">Your Cart ({cart.totalItems} items)</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => (
            <div key={item.cartItemId} className="flex gap-4 bg-surface border border-line rounded-2xl p-3">
              <Link to={`/product/${item.productId}`} className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-[#F3F1E9]">
                <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.productId}`} className="font-semibold text-sm hover:text-brand line-clamp-2">
                  {item.productName}
                </Link>
                <p className="font-mono-price font-bold mt-1">₹{Number(item.price).toLocaleString('en-IN')}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-line rounded-full">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-1.5 hover:text-brand"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      disabled={item.quantity >= item.availableStock}
                      className="p-1.5 hover:text-brand disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="text-ink-soft hover:text-deal p-1.5"
                    aria-label={`Remove ${item.productName}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
              <div className="font-mono-price font-bold text-right shrink-0 self-center">
                ₹{Number(item.lineTotal).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface border border-line rounded-2xl p-5 sticky top-24">
            <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm text-ink-soft mb-2">
              <span>Subtotal ({cart.totalItems} items)</span>
              <span className="font-mono-price">₹{Number(cart.subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-ok mb-4">
              <span>Delivery</span>
              <span className="font-semibold">FREE</span>
            </div>
            <div className="border-t border-line pt-3 flex justify-between font-bold text-lg mb-5">
              <span>Total</span>
              <span className="font-mono-price">₹{Number(cart.subtotal).toLocaleString('en-IN')}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 bg-cta text-ink font-semibold py-3 rounded-full hover:bg-cta-dark transition-colors"
            >
              Proceed to Checkout <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
