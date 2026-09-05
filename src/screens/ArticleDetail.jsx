import { ArrowLeft, Clock } from 'lucide-react'
import { articles } from '../data'
import ExerciseIcon from '../components/ExerciseIcon'

export default function ArticleDetail({ articleId, onBack }) {
  const a = articles.find((x) => x.id === articleId)

  if (!a) return null

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
        <h1 className="text-base font-black text-gray-900 dark:text-white">Artigo</h1>
      </header>

      <div className="anim-fade-up px-5 pb-12 pt-5">
        <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-navy-600 to-navy-900">
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(circle at 75% 20%, rgba(245,130,31,0.5), transparent 55%)' }}
          />
          <ExerciseIcon name={a.icon} className="h-28 w-28 text-brand-400" />
          <span className="absolute left-4 top-4 rounded-full bg-brand-500 px-3 py-1.5 text-[11px] font-extrabold text-white">
            {a.category}
          </span>
        </div>

        <h1 className="mt-5 text-2xl font-black leading-tight text-gray-900 dark:text-white">{a.title}</h1>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-gray-400">
          <Clock size={13} /> {a.readTime} · Programa Transportar Saúde
        </p>

        <div className="mt-5 space-y-5">
          {a.body.map((b, i) => (
            <section key={i}>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-brand-600 dark:text-brand-500">
                {b.heading}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{b.text}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-brand-50 p-5 ring-1 ring-brand-500/15 dark:bg-brand-500/10">
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
            <span className="font-extrabold text-choco-600 dark:text-brand-400">Lembre-se:</span> este
            conteúdo é educativo e não substitui avaliação médica. Em caso de sintomas persistentes,
            procure um profissional de saúde.
          </p>
        </div>
      </div>
    </div>
  )
}
