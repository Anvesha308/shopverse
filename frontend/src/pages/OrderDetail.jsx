import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { CheckCircle2, Package, MapPin, ChevronLeft } from 'lucide-react'
import api from '../api/axios'

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-ok-light text-ok',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-ok-light text-ok',
  CANCELLED: 'bg-deal-light text-deal',
}

export default function OrderDetail() {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const justPaid = location.state?.justPaid

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-center text-ink-soft">Loading order…</div>
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-ink-soft">We couldn't find that order.</p>
        <Link to="/orders" className="text-brand font-semibold hover:underline">Back to orders</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/orders" className="flex items-center gap-1 text-sm text-ink-soft hover:text-brand mb-5 w-fit">
        <ChevronLeft size={16} /> All orders
      </Link>

      {justPaid && order.status === 'PAID' && (
        <div className="flex items-center gap-3 bg-ok-light text-ok rounded-2xl p-4 mb-6">
          <CheckCircle2 size={24} className="shrink-0" />
          <div>
            <p className="font-semibold text-sm">Payment successful!</p>
            <p className="text-xs opacity-80">Your order has been confirmed and is being processed.</p>
          </div>
        </div>
      )}

      <div className="bg-surface border border-line rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <p className="text-xs text-ink-soft">Order number</p>
            <p className="font-mono-price font-bold text-lg">{order.orderNumber}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[order.status] || 'bg-line'}`}>
            {order.status}
          </span>
        </div>

        <p className="text-xs text-ink-soft mt-2">
          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>

        <div className="border-t border-line mt-5 pt-5">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-1.5"><Package size={16} /> Items</h2>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-ink-soft">{item.productName} × {item.quantity}</span>
                <span className="font-mono-price font-medium">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-line mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span className="font-mono-price">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="border-t border-line mt-5 pt-5">
          <h2 className="font-semibold text-sm mb-2 flex items-center gap-1.5"><MapPin size={16} /> Shipping address</h2>
          <p className="text-sm text-ink-soft">
            {order.shippingAddress}, {order.shippingCity} – {order.shippingPincode}
          </p>
        </div>
      </div>
    </div>
  )
}
