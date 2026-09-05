import { useState } from 'react'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'
import { articles, articleCategories } from '../data'
import ExerciseIcon from '../components/ExerciseIcon'

export default function Articles({ onBack, onOpenArticle }) {
  const [cat, setCat] = useState('Todos')
  const list = cat === 'Todos' ? articles : articles.filter((a) => a.category === cat)

  return (
    <div className="min-h-svh bg-cream dark:bg-navy-950">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-black/5 bg-cream/90 px-4 py-3 backdrop-blur dark:border-white/5 dark:bg-navy-900/90">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 ring-1 ring-black/5 dark:bg-navy-800 dark:text-gray-200 dark:ring-white/5"
          aria-label="Voltar"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-black text-gray-900 dark:text-white">Conteúdos Educativos</h1>
      </header>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pt-4">
        {articleCategories.map((c) => (
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

      <div className="space-y-4 px-4 pb-10 pt-4">
        {list.map((a, i) => (
          <article
            key={a.id}
            className="anim-fade-up overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <button onClick={() => onOpenArticle(a.id)} className="block w-full text-left">
              <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-navy-600 to-navy-900">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: 'radial-gradient(circle at 75% 20%, rgba(245,130,31,0.5), transparent 55%)' }}
                />
                <ExerciseIcon name={a.icon} className="h-20 w-20 text-brand-400" />
                <span className="absolute left-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-extrabold text-white">
                  {a.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-base font-extrabold leading-snug text-gray-900 dark:text-white">
                  {a.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  {a.summary}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                    <Clock size={12} /> {a.readTime}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-extrabold text-brand-600 dark:text-brand-500">
                    Ler artigo <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
