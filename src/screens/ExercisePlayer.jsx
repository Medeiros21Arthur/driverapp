import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle2, Lightbulb, PartyPopper } from 'lucide-react'
import { exercises } from '../data'
import { useAuth } from '../AuthContext'
import { logActiveBreak } from '../lib/db'

function useTimer(seconds, done) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    if (running && remaining > 0) {
      ref.current = setInterval(() => setRemaining((r) => r - 1), 1000)
    }
    return () => clearInterval(ref.current)
  }, [running, remaining])

  useEffect(() => {
    if (remaining === 0 && running) {
      setRunning(false)
      done()
    }
  }, [remaining, running, done])

  const reset = () => {
    setRunning(false)
    setRemaining(seconds)
  }

  return { remaining, running, toggle: () => setRunning((r) => !r), reset }
}

export default function ExercisePlayer({ exerciseId, onClose }) {
  const ex = exercises.find((e) => e.id === exerciseId)
  const { user, displayName } = useAuth()
  const [finished, setFinished] = useState(false)
  const { remaining, running, toggle, reset } = useTimer(ex.duration, () => setFinished(true))
  const logged = useRef(false)

  useEffect(() => {
    if (finished && user && !logged.current) {
      logged.current = true
      logActiveBreak(user.id, ex.id, ex.title, ex.duration)
    }
  }, [finished, user, ex])

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const pct = useMemo(() => ((ex.duration - remaining) / ex.duration) * 100, [ex.duration, remaining])

  if (finished) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-navy-700 px-8 text-center">
        <div className="anim-fade-up">
          <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-500/20 ring-1 ring-brand-500/40">
            <PartyPopper size={40} className="text-brand-400" />
          </span>
          <h2 className="mt-6 text-2xl font-black text-white">Pausa concluída!</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm text-white/70">
            Excelente, {displayName.split(' ')[0]}! Cada pausa conta para a sua saúde na estrada. Beba um copo d&apos;água antes de retomar.
          </p>
          <button
            onClick={onClose}
            className="mt-8 w-full rounded-full bg-brand-500 py-4 font-extrabold text-white shadow-lg shadow-brand-500/30"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-cream dark:bg-navy-950">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/5 bg-cream/90 px-4 py-3 backdrop-blur dark:border-white/5 dark:bg-navy-900/90">
        <button onClick={onClose} className="flex items-center gap-1 text-sm font-extrabold text-gray-600 dark:text-gray-300">
          <ArrowLeft size={18} /> Sair
        </button>
        <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Sessão de recuperação</span>
        <span className="w-10" />
      </header>

      <div className="flex-1 px-6 pb-8 pt-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-brand-600 ring-1 ring-black/5 dark:bg-navy-800 dark:text-brand-400 dark:ring-white/5">
            {ex.category} · {ex.tag}
          </span>
          <h1 className="mt-3 text-2xl font-black text-gray-900 dark:text-white">{ex.title}</h1>
        </div>

        <div className="mx-auto mt-6 flex max-w-[260px] flex-col items-center">
          <div className="relative h-52 w-52">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" strokeWidth="9" className="stroke-black/5 dark:stroke-white/10" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={(2 * Math.PI * 54) * (1 - pct / 100)}
                className="stroke-brand-500 transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-5xl font-black tabular-nums text-gray-900 dark:text-white">
                {mm}:{ss}
              </span>
              <span className="mt-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {running ? 'Em andamento' : 'Pausado'}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={toggle}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 transition active:scale-95"
              aria-label={running ? 'Pausar' : 'Iniciar'}
            >
              {running ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button
              onClick={reset}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-500 ring-1 ring-black/10 transition active:scale-95 dark:bg-navy-800 dark:text-gray-400 dark:ring-white/10"
              aria-label="Reiniciar"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-white">
            <CheckCircle2 size={17} className="text-brand-500" />
            Como fazer
          </h3>
          <ol className="mt-3 space-y-3">
            {ex.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-black text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 rounded-3xl bg-brand-50 p-5 ring-1 ring-brand-500/10 dark:bg-brand-500/10">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-choco-600 dark:text-brand-400">
            <Lightbulb size={17} />
            Dica do especialista
          </h3>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-gray-600 dark:text-gray-300">
            {ex.tips.map((t, i) => (
              <li key={i}>• {t}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
