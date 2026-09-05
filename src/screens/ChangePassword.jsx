import { useState } from 'react'
import { ArrowLeft, KeyRound, Eye, EyeOff, Save } from 'lucide-react'
import { useAuth } from '../AuthContext'

export default function ChangePassword({ onBack }) {
  const { updatePassword } = useAuth()
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const submit = async () => {
    setMsg('')
    setErr('')
    if (pw.length < 6) {
      setErr('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (pw !== confirm) {
      setErr('As senhas não coincidem.')
      return
    }
    setBusy(true)
    const res = await updatePassword(pw)
    setBusy(false)
    if (!res.ok) {
      setErr(res.error?.message || 'Não foi possível alterar. Verifique sua conexão e tente novamente.')
      return
    }
    setPw('')
    setConfirm('')
    setMsg('Senha alterada com sucesso!')
  }

  const inputCls =
    'w-full rounded-2xl border border-black/10 bg-cream/60 py-3.5 pl-11 pr-12 text-sm font-semibold text-gray-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-navy-900 dark:text-white'

  return (
    <div className="flex min-h-svh flex-col bg-cream dark:bg-navy-950">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/5 bg-cream/90 px-4 py-3 backdrop-blur dark:border-white/5 dark:bg-navy-900/90">
        <button onClick={onBack} className="flex items-center gap-1 text-sm font-extrabold text-gray-600 dark:text-gray-300">
          <ArrowLeft size={18} /> Voltar
        </button>
        <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Segurança</span>
        <span className="w-10" />
      </header>

      <div className="flex-1 px-6 pb-10 pt-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
          <KeyRound size={30} strokeWidth={1.8} />
        </div>
        <h1 className="mt-4 text-center text-xl font-black text-gray-900 dark:text-white">Alterar senha</h1>
        <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
          Escolha uma nova senha para a sua conta.
        </p>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
              Nova senha
            </span>
            <div className="relative">
              <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
              <button
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label="Mostrar senha"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
              Confirmar nova senha
            </span>
            <div className="relative">
              <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={show ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>
          </label>
        </div>

        {err && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-xs font-bold text-danger-600 ring-1 ring-danger-500/15 dark:bg-danger-500/10 dark:text-danger-400">
            {err}
          </p>
        )}
        {msg && (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700 ring-1 ring-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-400">
            {msg}
          </p>
        )}

        <button
          onClick={submit}
          disabled={busy}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-4 text-base font-extrabold text-white shadow-lg shadow-brand-500/30 transition active:scale-[0.98] disabled:opacity-60"
        >
          <Save size={18} strokeWidth={2.4} />
          {busy ? 'Salvando...' : 'Salvar nova senha'}
        </button>
      </div>
    </div>
  )
}
