import { useState } from 'react'
import { ArrowLeft, Phone, MapPin, Ambulance, Flame, ShieldAlert, Share2, Siren } from 'lucide-react'

const contacts = [
  { icon: Ambulance, name: 'SAMU', number: '192', desc: 'Emergência médica', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { icon: Flame, name: 'Bombeiros', number: '193', desc: 'Incêndio e resgate', color: 'from-danger-500 to-danger-600', bg: 'bg-red-50 dark:bg-danger-500/10' },
  { icon: ShieldAlert, name: 'Polícia', number: '190', desc: 'Segurança pública', color: 'from-navy-500 to-navy-700', bg: 'bg-navy-50 dark:bg-navy-500/10' },
]

export default function Emergency({ onClose }) {
  const [loc, setLoc] = useState('')
  const [sharing, setSharing] = useState(false)

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setLoc('Geolocalização indisponível neste dispositivo.')
      return
    }
    setSharing(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
        setLoc(mapUrl)
        setSharing(false)
      },
      () => {
        setLoc('Não foi possível obter sua localização. Verifique as permissões.')
        setSharing(false)
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-danger-500/5 dark:bg-navy-950">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-danger-500/20 bg-danger-500 px-4 py-3 text-white">
        <button onClick={onClose} className="flex items-center gap-1 text-sm font-extrabold">
          <ArrowLeft size={18} /> Voltar
        </button>
        <span className="text-sm font-black uppercase tracking-widest">Emergência</span>
        <span className="w-12" />
      </header>

      <div className="flex-1 px-6 pb-10 pt-8 text-center">
        <div className="anim-fade-up">
          <h1 className="text-2xl font-black uppercase tracking-wide text-danger-500">Emergência</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Toque para chamar ajuda imediata
          </p>
        </div>

        <button className="anim-sos relative mx-auto mt-10 flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-danger-500 to-danger-600 ring-8 ring-danger-500/20 transition active:scale-95">
          <span className="flex flex-col items-center">
            <Siren size={40} />
            <span className="mt-1 text-2xl font-black tracking-widest">SOS</span>
            <span className="text-xs font-bold uppercase tracking-widest">Ajuda</span>
          </span>
        </button>
        <p className="mx-auto mt-6 max-w-xs text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          O botão liga diretamente para o número de emergência mais adequado à sua região.
        </p>

        <button
          onClick={shareLocation}
          className="mx-auto mt-5 flex items-center gap-2 rounded-full border-2 border-danger-500 px-6 py-3 text-sm font-extrabold text-danger-500 transition active:scale-95"
        >
          <Share2 size={16} />
          {sharing ? 'Obtendo localização...' : 'Compartilhar Localização'}
        </button>
        {loc && (
          <div className="mx-auto mt-3 max-w-xs rounded-2xl bg-white p-3 text-[11px] font-semibold break-all text-gray-600 ring-1 ring-black/5 dark:bg-navy-800 dark:text-gray-300 dark:ring-white/5">
            {loc.startsWith('http') ? (
              <a href={loc} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 text-brand-600 dark:text-brand-400">
                <MapPin size={13} /> Abrir minha localização no mapa
              </a>
            ) : (
              loc
            )}
          </div>
        )}

        <div className="mt-8 space-y-3 text-left">
          {contacts.map((c) => (
            <a
              key={c.number}
              href={`tel:${c.number}`}
              className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition active:scale-[0.99] dark:bg-navy-800 dark:ring-white/5"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${c.color}`}>
                <c.icon size={22} />
              </span>
              <span className="flex-1">
                <span className="block text-xs font-bold text-gray-400">{c.desc}</span>
                <span className="block text-2xl font-black tracking-wide text-gray-900 dark:text-white">
                  {c.name} <span className="text-brand-600 dark:text-brand-400">{c.number}</span>
                </span>
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <Phone size={18} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
