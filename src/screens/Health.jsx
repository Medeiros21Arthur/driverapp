import { useEffect, useRef, useState } from 'react'
import { Coffee, Droplets, Activity, Plus, Minus, CalendarRange } from 'lucide-react'
import { useAuth } from '../AuthContext'
import {
  addWater,
  logActiveBreak,
  getDaySummary,
  getBreaksPerDay,
  getMonthSummary,
  getCurrentMonthName,
  saveHealthLog,
  WATER_GLASS_ML,
  DAILY_WATER_GOAL_ML,
  DAILY_BREAK_GOAL,
  WEEKLY_BREAK_GOAL,
} from '../lib/db'

export default function Health() {
  const { user } = useAuth()
  const [pain, setPain] = useState(3)
  const [waterGlasses, setWaterGlasses] = useState(0)
  const [todayBreaks, setTodayBreaks] = useState(0)
  const [week, setWeek] = useState([])
  const [month, setMonth] = useState({ waterMl: 0, breaks: 0 })
  const [monthName, setMonthName] = useState('')
  const hydrated = useRef(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      setMonthName(await getCurrentMonthName())
      if (user) {
        const summary = await getDaySummary(user.id)
        const weekData = await getBreaksPerDay(user.id)
        const monthData = await getMonthSummary(user.id, new Date().getFullYear(), new Date().getMonth() + 1)
        if (active) {
          setPain(summary.painLevel ?? 3)
          setWaterGlasses(summary.waterGlasses)
          setTodayBreaks(summary.breaks)
          setWeek(weekData)
          setMonth(monthData)
        }
      }
      hydrated.current = true
    })()
    return () => {
      active = false
    }
  }, [user])

  useEffect(() => {
    if (!hydrated.current || !user) return
    saveHealthLog(user.id, { pain_level: pain })
  }, [pain, user])

  const registerWater = async () => {
    setWaterGlasses((w) => w + 1)
    setMonth((m) => ({ ...m, waterMl: m.waterMl + WATER_GLASS_ML }))
    if (user) await addWater(user.id)
  }

  const registerBreak = async () => {
    setTodayBreaks((b) => b + 1)
    setMonth((m) => ({ ...m, breaks: m.breaks + 1 }))
    if (user) await logActiveBreak(user.id, 'manual', 'Pausa manual', 0)
  }

  const monthWaterL = (month.waterMl / 1000).toFixed(1).replace('.', ',')
  const waterPct = Math.min(100, Math.round((month.waterMl / 60000) * 100))
  const breakPct = Math.min(100, Math.round((month.breaks / 150) * 100))
  const maxWeek = Math.max(...week.map((d) => d.count), 1)
  const weekTotal = week.reduce((s, d) => s + d.count, 0)

  return (
    <div className="space-y-5 px-4 pb-6 pt-5">
      <div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white">Sua saúde em números</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Acompanhe seus hábitos e cuide do que mais importa: você.
        </p>
      </div>

      <section className="anim-fade-up grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <Coffee size={17} />
          </span>
          <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
            {todayBreaks}/{DAILY_BREAK_GOAL}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Pausas ativas hoje</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(100, (todayBreaks / DAILY_BREAK_GOAL) * 100)}%` }}
            />
          </div>
          <button
            onClick={registerBreak}
            className="mt-2 flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700 transition active:scale-95 dark:bg-emerald-500/15 dark:text-emerald-400"
          >
            <Plus size={12} /> Registrar pausa
          </button>
        </div>
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
            <Droplets size={17} />
          </span>
          <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
            {waterGlasses}/{DAILY_WATER_GOAL_ML / WATER_GLASS_ML}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Copos de água hoje</p>
          <button
            onClick={registerWater}
            className="mt-2 flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-extrabold text-sky-700 transition active:scale-95 dark:bg-sky-500/15 dark:text-sky-400"
          >
            <Plus size={12} /> Registrar copo
          </button>
        </div>
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger-100 text-danger-600 dark:bg-danger-500/15 dark:text-danger-400">
            <Activity size={17} />
          </span>
          <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{pain}/10</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Nível de dor hoje</p>
          <button
            onClick={() => setPain((p) => Math.max(1, p - 1))}
            className="mt-2 flex items-center gap-1 rounded-full bg-danger-100 px-2.5 py-1 text-[11px] font-extrabold text-danger-700 transition active:scale-95 dark:bg-danger-500/15 dark:text-danger-400"
          >
            <Minus size={12} /> Diminuir
          </button>
        </div>
      </section>

      <section className="anim-fade-up rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-gray-900 dark:text-white">
            <CalendarRange size={16} className="text-brand-500" />
            Resumo do mês · {monthName}
          </h3>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-sky-50 p-4 dark:bg-sky-500/10">
            <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-sky-600 dark:text-sky-400">
              <Droplets size={13} /> Água no mês
            </span>
            <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
              {monthWaterL} <span className="text-sm font-bold text-gray-400">L</span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              <div className="h-full rounded-full bg-sky-500" style={{ width: `${waterPct}%` }} />
            </div>
            <p className="mt-1.5 text-[11px] font-bold text-gray-400">Meta: 60 L no mês</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
            <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              <Coffee size={13} /> Pausas no mês
            </span>
            <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{month.breaks}</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${breakPct}%` }} />
            </div>
            <p className="mt-1.5 text-[11px] font-bold text-gray-400">Meta: 150 no mês</p>
          </div>
        </div>
      </section>

      <section className="anim-fade-up rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Pausas ativas da semana</h3>
          <span className="text-[11px] font-bold text-gray-400">Meta: {WEEKLY_BREAK_GOAL}</span>
        </div>
        <div className="mt-4 flex h-32 items-end justify-between gap-2">
          {week.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[10px] font-black text-gray-400">{d.count || ''}</span>
              <div
                className={`w-full rounded-lg transition-all ${
                  i === week.length - 1 ? 'bg-brand-500' : 'bg-brand-200 dark:bg-brand-500/25'
                }`}
                style={{ height: `${(d.count / maxWeek) * 100}%` }}
              />
              <span className="text-[10px] font-bold text-gray-400">{d.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 dark:bg-emerald-500/10">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {weekTotal >= WEEKLY_BREAK_GOAL
              ? 'Meta da semana atingida. Parabéns, continue assim!'
              : `Você está a ${WEEKLY_BREAK_GOAL - weekTotal} pausas da meta da semana!`}
          </span>
        </div>
      </section>

      <section className="anim-fade-up rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5">
        <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Como você se sente agora?</h3>
        <input
          type="range"
          min="1"
          max="10"
          value={pain}
          onChange={(e) => setPain(Number(e.target.value))}
          className="mt-4 w-full accent-brand-500"
        />
        <div className="mt-1 flex justify-between text-[11px] font-bold text-gray-400">
          <span>Sem dor</span>
          <span className="text-brand-600 dark:text-brand-400">Agora: {pain}/10</span>
          <span>Dor intensa</span>
        </div>
        <p className="mt-3 rounded-2xl bg-cream px-4 py-3 text-xs leading-relaxed text-gray-500 dark:bg-navy-900 dark:text-gray-400">
          {pain <= 3
            ? 'Ótimo! Mantenha as pausas ativas e a hidratação em dia para continuar assim.'
            : pain <= 6
              ? 'Seu corpo pede atenção. Faça uma pausa ativa e reavalie após o alongamento.'
              : 'Dor alta é sinal de alerta. Pare em um local seguro e considere avaliação profissional antes de seguir.'}
        </p>
      </section>
    </div>
  )
}
