import { useState } from 'react'
import { CalendarDays, X, Save } from 'lucide-react'
import { useAuth } from '../AuthContext'
import { updateProfile } from '../lib/db'

export default function BirthDateModal({ open, onClose }) {
  const { user, profile, refreshProfile } = useAuth()
  const [birthDate, setBirthDate] = useState(profile?.birth_date || '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')

  if (!open) return null

  const save = async () => {
    setErr('')
    setMsg('')
    if (!birthDate) {
      setErr('Informe sua data de nascimento.')
      return
    }
    setBusy(true)
    const res = await updateProfile(user.id, { birth_date: birthDate })
    console.log('updateProfile result:', res)
    setBusy(false)
    if (!res.ok) {
      setErr(`Erro: ${res.error?.message || res.error || 'desconhecido'}`)
      return
    }
    await refreshProfile()
    setMsg('Data de nascimento salva!')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl dark:bg-navy-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Data de nascimento</h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 transition hover:bg-black/5 dark:hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Informe sua data de nascimento para continuar.
        </p>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
            Data de nascimento
          </span>
          <div className="relative">
            <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={birthDate}
              required
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-cream/60 py-3.5 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-navy-900 dark:text-white"
            />
          </div>
        </label>

        {err && (
          <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-xs font-bold text-danger-600 ring-1 ring-danger-500/15 dark:bg-danger-500/10 dark:text-danger-400">
            {err}
          </p>
        )}
        {msg && (
          <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700 ring-1 ring-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-400">
            {msg}
          </p>
        )}

        <button
          onClick={save}
          disabled={busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-4 text-base font-extrabold text-white shadow-lg shadow-brand-500/30 transition active:scale-[0.98] disabled:opacity-60"
        >
          <Save size={18} strokeWidth={2.4} />
          {busy ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  )
}
