import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import api from '../api/axios'

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-ok-light text-ok',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-ok-light text-ok',
  CANCELLED: 'bg-deal-light text-deal',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders', { params: { page: 0, size: 20 } })
      .then(({ data }) => setOrders(data.content))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-center text-ink-soft">Loading orders…</div>
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <Package size={48} className="mx-auto text-line mb-4" />
        <h1 className="font-display font-bold text-xl mb-2">No orders yet</h1>
        <p className="text-ink-soft text-sm mb-6">Your order history will show up here.</p>
        <Link to="/" className="inline-block bg-brand text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-dark transition-colors">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display font-bold text-2xl mb-6">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="flex items-center justify-between gap-4 bg-surface border border-line rounded-2xl p-4 hover:border-brand transition-colors"
          >
            <div>
              <p className="font-semibold text-sm font-mono-price">{order.orderNumber}</p>
              <p className="text-xs text-ink-soft mt-0.5">
                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {' · '}{order.items.length} item{order.items.length > 1 ? 's' : ''}
              </p>
              <span className={`inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[order.status] || 'bg-line'}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono-price font-bold">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
              <ChevronRight size={18} className="text-ink-soft" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
