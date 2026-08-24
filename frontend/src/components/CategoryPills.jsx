import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Cpu, Shirt, Sofa, BookOpen, Sparkles, Dumbbell, Grid3x3 } from 'lucide-react'
import api from '../api/axios'

const ICONS = {
  cpu: Cpu,
  shirt: Shirt,
  sofa: Sofa,
  book: BookOpen,
  sparkles: Sparkles,
  dumbbell: Dumbbell,
}

export default function CategoryPills() {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const activeId = params.get('categoryId')

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {})
  }, [])

  const goTo = (categoryId) => {
    if (categoryId) navigate(`/search?categoryId=${categoryId}`)
    else navigate('/search')
  }

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
      <Pill label="All" active={!activeId} onClick={() => goTo(null)} Icon={Grid3x3} />
      {categories.map((c) => {
        const Icon = ICONS[c.icon] || Grid3x3
        return (
          <Pill key={c.id} label={c.name} active={String(activeId) === String(c.id)} onClick={() => goTo(c.id)} Icon={Icon} />
        )
      })}
    </div>
  )
}

function Pill({ label, active, onClick, Icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
        active
          ? 'bg-brand text-white border-brand'
          : 'bg-surface text-ink border-line hover:border-brand hover:text-brand'
      }`}
    >
      <Icon size={15} /> {label}
    </button>
  )
}
