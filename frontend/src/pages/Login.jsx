import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Store, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 font-display font-bold text-2xl mb-2">
          <Store size={26} className="text-brand" /> Shopverse
        </div>
        <p className="text-center text-sm text-ink-soft mb-8">Log in to continue shopping</p>

        <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-2xl p-6 space-y-4 shadow-sm">
          <Field icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} required />
          <Field icon={Lock} type="password" placeholder="Password" value={password} onChange={setPassword} required />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white font-semibold py-3 rounded-full hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-soft mt-5">
          New to Shopverse?{' '}
          <Link to="/register" className="text-brand font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export function Field({ icon: Icon, type, placeholder, value, onChange, required }) {
  return (
    <div className="flex items-center gap-2 border border-line rounded-lg px-3 py-2.5 focus-within:border-brand transition-colors">
      <Icon size={17} className="text-ink-soft shrink-0" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="flex-1 outline-none text-sm bg-transparent"
      />
    </div>
  )
}
