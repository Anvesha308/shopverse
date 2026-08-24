import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store, Mail, Lock, User, Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Field } from './Login'
import toast from 'react-hot-toast'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(fullName, email, password, phone)
      toast.success('Account created! Welcome to Shopverse.')
      navigate('/', { replace: true })
    } catch (err) {
      const data = err.response?.data
      const message = data?.message || (typeof data === 'object' ? Object.values(data)[0] : null) || 'Could not create account'
      toast.error(message)
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
        <p className="text-center text-sm text-ink-soft mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-2xl p-6 space-y-4 shadow-sm">
          <Field icon={User} type="text" placeholder="Full name" value={fullName} onChange={setFullName} required />
          <Field icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} required />
          <Field icon={Phone} type="tel" placeholder="Phone (optional)" value={phone} onChange={setPhone} />
          <Field icon={Lock} type="password" placeholder="Password (min 6 characters)" value={password} onChange={setPassword} required />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white font-semibold py-3 rounded-full hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-soft mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
