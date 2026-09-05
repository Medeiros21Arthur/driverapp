import { useState } from 'react'
import { ChevronRight, Heart, Crosshair, ShieldCheck, BellRing, Droplets } from 'lucide-react'

const slides = [
  {
    icon: Crosshair,
    title: 'Saúde e segurança antes da viagem',
    text: 'O DriverCare AI acompanha você do embarque ao destino, cuidando do que importa.',
  },
  {
    icon: BellRing,
    title: 'Pausas ativas na hora certa',
    text: 'Exercícios curtos e lembretes inteligentes para você chegar inteiro ao fim da jornada.',
  },
  {
    icon: Droplets,
    title: 'Hidratação e bem-estar',
    text: 'Hábitos diários de ergonomia, alimentação e descanso para uma vida mais longa na estrada.',
  },
]

export default function Splash({ onDone }) {
  const [slide, setSlide] = useState(0)
  const current = slides[slide]

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-navy-700">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 28%, rgba(245,130,31,0.28), transparent 55%), radial-gradient(circle at 50% 110%, rgba(211,47,47,0.22), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 12% 8%, rgba(255,255,255,0.12), transparent 40%), radial-gradient(circle at 88% 90%, rgba(255,255,255,0.08), transparent 40%)',
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center px-8 pb-6 pt-16 text-center">
        <div className="relative mb-8">
          <span className="absolute -inset-6 rounded-full border border-brand-500/40" />
          <span className="absolute -inset-11 rounded-full border border-brand-500/20" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-navy-600 to-navy-900 shadow-2xl ring-1 ring-white/10">
            <Crosshair size={46} className="absolute text-brand-500" strokeWidth={1.6} />
            <Heart size={26} className="absolute text-danger-500" fill="currentColor" />
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white">
          DriverCare <span className="text-brand-500">AI</span>
        </h1>
        <p className="mt-2 text-sm font-semibold text-white/70">
          Sua saúde e segurança começam antes da viagem.
        </p>

        <div key={slide} className="anim-fade-up mt-10 flex flex-1 flex-col justify-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-brand-400 ring-1 ring-white/10">
            <current.icon size={32} strokeWidth={1.8} />
          </div>
          <h2 className="mx-auto max-w-xs text-xl font-extrabold leading-snug text-white">
            {current.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/65">{current.text}</p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === slide ? 'w-7 bg-brand-500' : 'w-2 bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 px-6 pb-[max(env(safe-area-inset-bottom),24px)] pt-4">
        <button
          onClick={onDone}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-4 text-base font-extrabold text-white shadow-xl shadow-brand-500/30 transition active:scale-[0.98]"
        >
          {slide === slides.length - 1 ? 'Iniciar' : 'Continuar'}
          <ChevronRight size={20} strokeWidth={2.6} />
        </button>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white/50">
          <ShieldCheck size={13} />
          Programa Transportar Saúde · Dellmar Transportes
        </p>
      </div>
    </div>
  )
}
