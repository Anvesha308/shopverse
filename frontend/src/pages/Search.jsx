import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, PackageX } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import CategoryPills from '../components/CategoryPills'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('createdAt,desc')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const keyword = params.get('keyword') || ''
  const categoryId = params.get('categoryId') || ''

  useEffect(() => {
    setPage(0)
  }, [keyword, categoryId])

  useEffect(() => {
    setLoading(true)
    api.get('/products', {
      params: {
        keyword: keyword || undefined,
        categoryId: categoryId || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        page,
        size: 12,
        sort,
      },
    })
      .then(({ data }) => {
        setProducts(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [keyword, categoryId, minPrice, maxPrice, page, sort])

  const applyFilters = (e) => {
    e.preventDefault()
    setPage(0)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <CategoryPills />

      <div className="mt-6 flex items-center justify-between gap-3">
        <h1 className="font-display font-bold text-xl">
          {keyword ? <>Results for "{keyword}"</> : 'All products'}
        </h1>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm border border-line rounded-lg px-3 py-1.5 bg-surface"
        >
          <option value="createdAt,desc">Newest</option>
          <option value="price,asc">Price: Low to High</option>
          <option value="price,desc">Price: High to Low</option>
          <option value="rating,desc">Top Rated</option>
        </select>
      </div>

      <form onSubmit={applyFilters} className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="flex items-center gap-1.5 text-ink-soft font-medium"><SlidersHorizontal size={15} /> Price:</span>
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-24 border border-line rounded-lg px-2.5 py-1.5 bg-surface"
        />
        <span className="text-ink-soft">–</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-24 border border-line rounded-lg px-2.5 py-1.5 bg-surface"
        />
        <button type="submit" className="bg-brand text-white px-4 py-1.5 rounded-lg font-medium hover:bg-brand-dark transition-colors">
          Apply
        </button>
      </form>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface border border-line rounded-2xl aspect-[3/4]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-ink-soft">
          <PackageX size={48} className="mb-3 text-line" />
          <p className="font-semibold text-ink">No products found</p>
          <p className="text-sm mt-1">Try a different keyword or clear your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    i === page ? 'bg-brand text-white' : 'bg-surface border border-line text-ink hover:border-brand'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
