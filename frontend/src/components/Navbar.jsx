import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, ShoppingCart, User, LogOut, Package, Menu, X, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { cart, bump } = useCart()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('keyword') || '')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(query ? `/search?keyword=${encodeURIComponent(query)}` : '/search')
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-brand text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0 font-display font-bold text-xl tracking-tight">
            <Store size={26} strokeWidth={2.4} className="text-cta" />
            Shopverse
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="flex w-full rounded-full overflow-hidden bg-white shadow-inner">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search for products, brands and more"
                className="flex-1 px-4 py-2.5 text-ink text-sm outline-none"
              />
              <button type="submit" aria-label="Search" className="px-4 bg-cta text-ink hover:bg-cta-dark transition-colors">
                <Search size={19} />
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center gap-5 ml-auto">
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="flex items-center gap-1.5 text-sm font-medium hover:text-cta transition-colors">
                  <Package size={18} /> Orders
                </Link>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <User size={18} />
                  <span className="max-w-[120px] truncate">{user.fullName?.split(' ')[0]}</span>
                </div>
                <button onClick={logout} className="flex items-center gap-1.5 text-sm font-medium hover:text-cta transition-colors" aria-label="Log out">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-semibold bg-white text-brand px-4 py-1.5 rounded-full hover:bg-cta hover:text-ink transition-colors">
                Login
              </Link>
            )}

            <Link to="/cart" className="relative flex items-center gap-1.5 text-sm font-medium hover:text-cta transition-colors">
              <ShoppingCart size={20} className={bump ? 'animate-bump' : ''} />
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-deal text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>
          </div>

          <button className="md:hidden ml-auto" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <form onSubmit={handleSearch} className="flex rounded-full overflow-hidden bg-white shadow-inner">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="flex-1 px-4 py-2 text-ink text-sm outline-none"
              />
              <button type="submit" className="px-4 bg-cta text-ink"><Search size={18} /></button>
            </form>
            <div className="flex flex-col gap-1 text-sm font-medium">
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="py-2 flex items-center gap-2">
                <ShoppingCart size={18} /> Cart ({cart.totalItems || 0})
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="py-2 flex items-center gap-2"><Package size={18} /> My Orders</Link>
                  <button onClick={() => { logout(); setMenuOpen(false) }} className="py-2 flex items-center gap-2 text-left"><LogOut size={18} /> Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2 flex items-center gap-2"><User size={18} /> Login / Register</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
