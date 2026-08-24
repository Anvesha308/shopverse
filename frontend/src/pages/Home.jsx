import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Truck, ShieldCheck, RotateCcw, Search } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import CategoryPills from '../components/CategoryPills'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroQuery, setHeroQuery] = useState('')
  const navigate = useNavigate()

  const handleHeroSearch = (e) => {
    e.preventDefault()
    navigate(heroQuery ? `/search?keyword=${encodeURIComponent(heroQuery)}` : '/search')
  }

  useEffect(() => {
    api.get('/products', { params: { page: 0, size: 12, sort: 'createdAt,desc' } })
      .then(({ data }) => setProducts(data.content))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero: the search bar is the thesis of this page */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 sm:py-20 text-center">
          <h1 className="font-display font-bold text-3xl sm:text-5xl leading-tight max-w-3xl mx-auto">
            Everything you need, <span className="text-cta">one search away</span>
          </h1>
          <p className="mt-4 text-white/80 max-w-xl mx-auto text-sm sm:text-base">
            Browse thousands of products across electronics, fashion, home &amp; more — with fast, simulated checkout built for demos.
          </p>

          <form onSubmit={handleHeroSearch} className="mt-8 max-w-xl mx-auto flex rounded-full overflow-hidden shadow-lg">
            <input
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              type="text"
              placeholder="Try 'headphones', 'kurta', or 'yoga mat'"
              className="flex-1 px-5 py-3.5 text-ink text-sm outline-none"
            />
            <button type="submit" className="px-6 bg-cta text-ink font-semibold hover:bg-cta-dark transition-colors flex items-center gap-2">
              <Search size={18} /> <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="bg-surface rounded-2xl shadow-md border border-line grid grid-cols-3 divide-x divide-line text-center py-4">
          <Perk icon={Truck} label="Fast delivery" />
          <Perk icon={ShieldCheck} label="Secure checkout" />
          <Perk icon={RotateCcw} label="Easy returns" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <CategoryPills />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pb-16">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display font-bold text-xl sm:text-2xl">Fresh arrivals</h2>
          <Link to="/search" className="text-sm font-semibold text-brand hover:underline">View all</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface border border-line rounded-2xl aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Perk({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-2">
      <Icon size={20} className="text-brand" />
      <span className="text-xs font-medium text-ink-soft">{label}</span>
    </div>
  )
}
