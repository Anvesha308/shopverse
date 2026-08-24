import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Smartphone, Wallet, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const STEPS = { SHIPPING: 'shipping', PAYMENT: 'payment', PROCESSING: 'processing' }

export default function Checkout() {
  const { cart, refreshCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(STEPS.SHIPPING)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [method, setMethod] = useState('UPI')
  const [order, setOrder] = useState(null)
  const [placing, setPlacing] = useState(false)

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setPlacing(true)
    try {
      const { data } = await api.post('/orders/checkout', {
        shippingAddress: address,
        shippingCity: city,
        shippingPincode: pincode,
        paymentMethod: method,
      })
      setOrder(data)
      await refreshCart()
      setStep(STEPS.PAYMENT)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order')
    } finally {
      setPlacing(false)
    }
  }

  const handlePayment = async (simulateSuccess) => {
    setStep(STEPS.PROCESSING)
    try {
      const { data } = await api.post('/payments/verify', {
        orderId: order.id,
        simulateSuccess,
      })
      await new Promise((r) => setTimeout(r, 900)) // brief pause for the processing animation
      if (data.status === 'SUCCESS') {
        toast.success('Payment successful!')
        navigate(`/orders/${order.id}`, { state: { justPaid: true } })
      } else {
        toast.error('Payment failed — order was cancelled and stock restored')
        navigate(`/orders/${order.id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment verification failed')
      setStep(STEPS.PAYMENT)
    }
  }

  if (!cart.items || cart.items.length === 0) {
    if (step === STEPS.SHIPPING) {
      navigate('/cart')
      return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display font-bold text-2xl mb-1">Checkout</h1>
      <StepIndicator step={step} />

      {step === STEPS.SHIPPING && (
        <form onSubmit={handlePlaceOrder} className="bg-surface border border-line rounded-2xl p-6 mt-6 space-y-4">
          <h2 className="font-semibold text-lg mb-2">Shipping details</h2>
          <div>
            <label className="text-sm font-medium text-ink-soft block mb-1">Full address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              placeholder="House no., street, area"
              className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-ink-soft block mb-1">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-soft block mb-1">Pincode</label>
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
                className="w-full border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="border-t border-line pt-4 flex justify-between font-bold text-lg">
            <span>Order total</span>
            <span className="font-mono-price">₹{Number(cart.subtotal || 0).toLocaleString('en-IN')}</span>
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full bg-brand text-white font-semibold py-3 rounded-full hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {placing ? 'Placing order…' : 'Continue to Payment'}
          </button>
        </form>
      )}

      {step === STEPS.PAYMENT && order && (
        <div className="bg-surface border border-line rounded-2xl p-6 mt-6">
          <h2 className="font-semibold text-lg mb-1">Simulated payment gateway</h2>
          <p className="text-xs text-ink-soft mb-5">
            Order <span className="font-mono-price font-semibold">{order.orderNumber}</span> · Amount due{' '}
            <span className="font-mono-price font-semibold">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
          </p>

          <div className="grid grid-cols-3 gap-2 mb-6">
            <MethodPill icon={Smartphone} label="UPI" active={method === 'UPI'} onClick={() => setMethod('UPI')} />
            <MethodPill icon={CreditCard} label="Card" active={method === 'CARD'} onClick={() => setMethod('CARD')} />
            <MethodPill icon={Wallet} label="Wallet" active={method === 'WALLET'} onClick={() => setMethod('WALLET')} />
          </div>

          <p className="text-xs text-ink-soft mb-4">
            This demo simulates a payment gateway response — no real payment is processed. Pick an outcome below.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handlePayment(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-ok text-white font-semibold py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              <CheckCircle2 size={18} /> Simulate Success
            </button>
            <button
              onClick={() => handlePayment(false)}
              className="flex-1 flex items-center justify-center gap-2 bg-deal text-white font-semibold py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              <XCircle size={18} /> Simulate Failure
            </button>
          </div>
        </div>
      )}

      {step === STEPS.PROCESSING && (
        <div className="bg-surface border border-line rounded-2xl p-12 mt-6 flex flex-col items-center gap-3 text-center">
          <Loader2 size={36} className="animate-spin text-brand" />
          <p className="font-medium text-ink-soft">Processing your payment…</p>
        </div>
      )}
    </div>
  )
}

function StepIndicator({ step }) {
  const steps = [
    { key: STEPS.SHIPPING, label: 'Shipping' },
    { key: STEPS.PAYMENT, label: 'Payment' },
  ]
  const activeIndex = step === STEPS.PROCESSING ? 1 : steps.findIndex((s) => s.key === step)

  return (
    <div className="flex items-center gap-2 text-xs font-medium text-ink-soft mt-3">
      {steps.map((s, i) => (
        <span key={s.key} className={`flex items-center gap-1 ${i <= activeIndex ? 'text-brand font-semibold' : ''}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${i <= activeIndex ? 'bg-brand text-white' : 'bg-line'}`}>
            {i + 1}
          </span>
          {s.label}
          {i < steps.length - 1 && <span className="mx-1 text-line">—</span>}
        </span>
      ))}
    </div>
  )
}

function MethodPill({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-sm font-medium transition-colors ${
        active ? 'border-brand bg-brand-light text-brand' : 'border-line text-ink-soft hover:border-brand'
      }`}
    >
      <Icon size={19} /> {label}
    </button>
  )
}
