import { Store } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-ink text-white/70">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-white mb-2">
            <Store size={20} className="text-cta" /> Shopverse
          </div>
          <p className="text-white/50 text-xs leading-relaxed">A mini marketplace built to demo full-stack commerce — auth, cart, checkout and search.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Shop</h4>
          <ul className="space-y-1.5 text-white/60">
            <li>Electronics</li>
            <li>Fashion</li>
            <li>Home &amp; Kitchen</li>
            <li>Books</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Account</h4>
          <ul className="space-y-1.5 text-white/60">
            <li>Orders</li>
            <li>Cart</li>
            <li>Login</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Project</h4>
          <ul className="space-y-1.5 text-white/60">
            <li>Spring Boot + JWT</li>
            <li>MySQL</li>
            <li>React + Tailwind</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        Demo project — not a real store. Payments are simulated.
      </div>
    </footer>
  )
}
