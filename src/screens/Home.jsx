import { useEffect, useState } from 'react'
import { Coffee, Droplets, Timer, BookOpen, ChevronRight, Play, Siren, ArrowRight, CalendarDays } from 'lucide-react'
import { exercises, articles } from '../data'
import ExerciseIcon from '../components/ExerciseIcon'
import { useAuth } from '../AuthContext'
import { getBrWeekday, greetByTime } from '../lib/brTime'
import { getDaySummary, DAILY_BREAK_GOAL, DAILY_WATER_GOAL_ML, WATER_GLASS_ML } from '../lib/db'

const chips = ['😊 Bem', '😐 Cansado', '😣 Com dor', '😫 Estressado']

export default function Home({ onOpenPlayer, onOpenArticles, onOpenArticle, onEmergency }) {
  const { user, displayName, profile } = useAuth()
  const [summary, setSummary] = useState({ painLevel: 3, waterGlasses: 0, breaks: 0 })
  const featured = exercises.find((e) => e.id === 'pausa-completa')
  const firstName = displayName.split(' ')[0]
  const greeting = greetByTime()
  const weekday = getBrWeekday()
  const formattedBirth = profile?.birth_date
    ? new Date(profile.birth_date + 'T00:00:00').toLocaleDateString('pt-BR')
    : ''
  const age = profile?.birth_date
    ? Math.floor((Date.now() - new Date(profile.birth_date + 'T00:00:00').getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null

  useEffect(() => {
    if (!user) return
    let active = true
    getDaySummary(user.id).then((s) => {
      if (active && s) setSummary(s)
    })
    return () => {
      active = false
    }
  }, [user])

  return (
    <div className="space-y-5 px-4 py-5">
      <section className="anim-fade-up rounded-3xl bg-gradient-to-br from-navy-700 to-navy-900 p-5 text-white shadow-lg shadow-navy-700/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-400">
              {weekday} · Turno 1
            </p>
            <h2 className="mt-1 text-2xl font-black">{greeting}, {firstName}!</h2>
            <p className="mt-1 text-sm text-white/70">Como você está se sentindo hoje?</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl ring-1 ring-white/10">
            🚛
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              className="rounded-full bg-white/10 px-3.5 py-2 text-xs font-bold text-white/90 ring-1 ring-white/10 transition active:scale-95"
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {formattedBirth ? (
        <div className="anim-fade-up flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            <CalendarDays size={20} />
          </span>
          <div>
            <p className="text-sm font-extrabold text-gray-900 dark:text-white">Data de nascimento</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {formattedBirth}{age !== null ? ` · ${age} anos` : ''}
            </p>
          </div>
        </div>
      ) : (
        <div className="anim-fade-up flex items-center gap-3 rounded-3xl bg-brand-50 p-4 ring-1 ring-brand-500/20 dark:bg-brand-500/10 dark:ring-brand-500/30">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            <CalendarDays size={20} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-extrabold text-gray-900 dark:text-white">Informe sua data de nascimento</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Acesse Configurações para preencher.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={onEmergency}
        className="anim-fade-up flex w-full items-center gap-3 rounded-3xl bg-danger-500 p-4 text-left text-white shadow-lg shadow-danger-500/25 transition active:scale-[0.99]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Siren size={22} />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-extrabold">Emergência na estrada?</span>
          <span className="block text-xs font-semibold text-white/80">
            Toque para acionar o SOS com um toque
          </span>
        </span>
        <ChevronRight size={20} className="text-white/70" />
      </button>

      <section className="anim-fade-up rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
            Sugestão da pausa
          </h3>
          <span className="flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-extrabold text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
            <Timer size={12} /> {featured.tag}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${featured.gradient}`}>
            <ExerciseIcon name={featured.icon} className="h-12 w-12" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-gray-900 dark:text-white">{featured.title}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {featured.description}
            </p>
          </div>
        </div>
        <button
          onClick={() => onOpenPlayer(featured.id)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-sm font-extrabold text-white shadow-md shadow-brand-500/25 transition active:scale-[0.98]"
        >
          <Play size={16} fill="currentColor" />
          Iniciar agora
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {[
          { icon: Coffee, label: 'Pausas hoje', value: `${summary.breaks}/${DAILY_BREAK_GOAL}`, tone: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400' },
          { icon: Droplets, label: 'Água hoje', value: `${summary.waterGlasses}/${DAILY_WATER_GOAL_ML / WATER_GLASS_ML}`, tone: 'text-sky-600 bg-sky-100 dark:bg-sky-500/15 dark:text-sky-400' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5"
          >
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${s.tone}`}>
              <s.icon size={16} />
            </span>
            <p className="mt-2 text-base font-black text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="anim-fade-up">
        <div className="flex items-center justify-between px-1">
          <h3 className="flex items-center gap-2 text-base font-extrabold text-gray-900 dark:text-white">
            <BookOpen size={18} className="text-brand-500" />
            Conteúdos Educativos
          </h3>
          <button
            onClick={onOpenArticles}
            className="flex items-center gap-0.5 text-xs font-extrabold text-brand-600 dark:text-brand-500"
          >
            Ver todos <ChevronRight size={14} />
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {articles.slice(0, 2).map((a) => (
            <button
              key={a.id}
              onClick={() => onOpenArticle(a.id)}
              className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-black/5 transition active:scale-[0.99] dark:bg-navy-800 dark:ring-white/5"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${a.color}`}>
                <ExerciseIcon name={a.icon} className="h-7 w-7" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-brand-600 dark:text-brand-500">{a.category}</span>
                <span className="block truncate text-sm font-extrabold text-gray-900 dark:text-white">
                  {a.title}
                </span>
                <span className="mt-0.5 block text-[11px] font-semibold text-gray-400">
                  {a.readTime}
                </span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-gray-300 dark:text-gray-600" />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
