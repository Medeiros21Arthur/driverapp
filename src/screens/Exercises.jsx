import { useState } from 'react'
import { Clock, Play } from 'lucide-react'
import { exercises, exerciseCategories } from '../data'
import ExerciseIcon from '../components/ExerciseIcon'

export default function Exercises({ onOpenPlayer }) {
  const [cat, setCat] = useState('Todos')
  const list = cat === 'Todos' ? exercises : exercises.filter((e) => e.category === cat)

  return (
    <div className="px-4 pb-6 pt-5">
      <h2 className="text-xl font-black text-gray-900 dark:text-white">Sessões de Recuperação</h2>
      <p className="mt-1 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        Exercícios curtos desenvolvidos por especialistas para alívio rápido durante suas pausas.
      </p>

      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {exerciseCategories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition ${
              cat === c
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-gray-500 ring-1 ring-black/10 dark:bg-navy-800 dark:text-gray-400 dark:ring-white/10'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {list.map((e, i) => (
          <article
            key={e.id}
            className="anim-fade-up overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br text-white ${e.gradient}`}>
              <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(circle at 30% 20%, white, transparent 50%)' }} />
              <ExerciseIcon name={e.icon} className="h-20 w-20 drop-shadow-lg" />
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-extrabold backdrop-blur">
                <Clock size={12} /> {e.tag}
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-extrabold backdrop-blur">
                {e.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">{e.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {e.description}
              </p>
              <button
                onClick={() => onOpenPlayer(e.id)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3 text-sm font-extrabold text-white shadow-md shadow-brand-500/25 transition active:scale-[0.98]"
              >
                <Play size={15} fill="currentColor" />
                Iniciar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
