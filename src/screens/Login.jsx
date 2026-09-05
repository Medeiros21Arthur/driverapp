import { useState } from 'react'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, ArrowLeft, KeyRound, CalendarDays } from 'lucide-react'
import { useAuth } from '../AuthContext'

function friendlyError(error) {
  if (!error) return ''
  const code = error.code || error.message || ''
  if (code.includes('invalid_credentials') || code.includes('Invalid login credentials'))
    return 'E-mail ou senha incorretos.'
  if (code.includes('email_not_confirmed')) return 'Confirme seu e-mail antes de entrar.'
  if (code.includes('already registered') || code.includes('user_already_exists'))
    return 'Este e-mail já está cadastrado. Tente entrar.'
  if (code.includes('password')) return 'A senha deve ter pelo menos 6 caracteres.'
  if (code.includes('not allowed') || code.includes('over_email_send_rate'))
    return 'Tente novamente em alguns instantes.'
  if (code.includes('network_error')) return error.message
  return 'Não foi possível concluir. Tente novamente.'
}

export default function Login() {
  const { signIn, signUp, resetPassword } = useAuth()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const submit = async () => {
    setError('')
    setInfo('')

    setBusy(true)
    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setError('Informe seu nome completo.')
          return
        }
        if (!birthDate) {
          setError('Informe sua data de nascimento.')
          return
        }
        const res = await signUp(name, email, password, birthDate)
        if (!res.ok) setError(friendlyError(res.error))
      } else if (mode === 'forgot') {
        const res = await resetPassword(email)
        if (!res.ok) setError(friendlyError(res.error))
        else setInfo('Enviamos um link de redefinição para o seu e-mail.')
      } else {
        const res = await signIn(email, password)
        if (!res.ok) setError(friendlyError(res.error))
      }
    } finally {
      setBusy(false)
    }
  }

  const title =
    mode === 'register' ? 'Criar sua conta' : mode === 'forgot' ? 'Recuperar senha' : 'Bem-vindo de volta'
  const subtitle =
    mode === 'register'
      ? 'e comece a cuidar da sua saúde na estrada.'
      : mode === 'forgot'
        ? 'Informe seu e-mail para redefinir a senha.'
        : 'ao seu copiloto de saúde.'

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-cream to-brand-50 px-6 py-10 dark:from-navy-950 dark:to-navy-900">
      <div className="w-full max-w-sm anim-fade-up rounded-3xl bg-white p-7 shadow-xl shadow-black/5 ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5">
        {mode !== 'login' && (
          <button
            onClick={() => {
              setMode('login')
              setError('')
              setInfo('')
            }}
            className="mb-3 flex items-center gap-1 text-xs font-extrabold text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft size={14} /> Voltar
          </button>
        )}

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
          <ShieldCheck size={32} strokeWidth={1.8} />
        </div>

        <h1 className="text-center text-2xl font-black text-choco-600 dark:text-brand-500">{title}</h1>
        <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>

        <div className="mt-7 space-y-4">
          {mode === 'register' && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                Nome completo
              </span>
              <div className="relative">
                <UserPlus size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João da Silva"
                  className="w-full rounded-2xl border border-black/10 bg-cream/60 py-3.5 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-navy-900 dark:text-white"
                />
              </div>
            </label>
          )}

          {mode === 'register' && (
            <label className="block">
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
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
              Email
            </span>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                className="w-full rounded-2xl border border-black/10 bg-cream/60 py-3.5 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-navy-900 dark:text-white"
              />
            </div>
          </label>

          {mode !== 'forgot' && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400">
                Senha
              </span>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-black/10 bg-cream/60 py-3.5 pl-11 pr-12 text-sm font-semibold text-gray-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-navy-900 dark:text-white"
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
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button
                onClick={() => {
                  setMode('forgot')
                  setError('')
                }}
                className="text-xs font-bold text-brand-600 dark:text-brand-500"
              >
                Esqueci minha senha
              </button>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-xs font-bold text-danger-600 ring-1 ring-danger-500/15 dark:bg-danger-500/10 dark:text-danger-400">
            {error}
          </p>
        )}
        {info && (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700 ring-1 ring-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-400">
            {info}
          </p>
        )}

        <button
          onClick={submit}
          disabled={busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-choco-500 py-4 text-base font-extrabold text-white shadow-lg shadow-choco-500/25 transition active:scale-[0.98] disabled:opacity-60 dark:bg-brand-500 dark:shadow-brand-500/25"
        >
          {mode === 'register' ? (
            <>
              <UserPlus size={18} strokeWidth={2.6} />
              {busy ? 'Criando...' : 'Criar Conta'}
            </>
          ) : mode === 'forgot' ? (
            <>
              <KeyRound size={18} strokeWidth={2.6} />
              {busy ? 'Enviando...' : 'Enviar link'}
            </>
          ) : (
            <>
              <LogIn size={18} strokeWidth={2.6} />
              {busy ? 'Entrando...' : 'Entrar'}
            </>
          )}
        </button>

        {mode === 'login' && (
          <>
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
              <span className="text-xs font-bold uppercase tracking-wide text-gray-400">ou</span>
              <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            </div>

            <button
              onClick={() => {
                setMode('register')
                setError('')
              }}
              className="mt-3 flex w-full items-center justify-center rounded-full border-2 border-brand-500 py-3.5 text-sm font-extrabold text-brand-600 transition active:scale-[0.98] dark:border-brand-500 dark:text-brand-400"
            >
              Criar Conta
            </button>
          </>
        )}
      </div>

      <p className="mt-6 max-w-[240px] text-center text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
        Ao entrar você concorda com nossa Política de Privacidade e Termos de Uso.
      </p>
    </div>
  )
}
