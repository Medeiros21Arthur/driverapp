import { useState } from 'react'
import {
  CalendarDays,
  KeyRound,
  Bell,
  Moon,
  Sun,
  ContactRound,
  Info,
  FileText,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../AuthContext'

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        on ? 'bg-brand-500' : 'bg-black/10 dark:bg-white/15'
      }`}
      aria-label="Alternar"
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
          on ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  )
}

function Row({ icon: Icon, label, value, right, onClick }) {
  const Component = onClick ? 'button' : 'div'
  return (
    <Component
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-4 text-left transition ${
        onClick ? 'cursor-pointer active:bg-black/5 dark:active:bg-white/5' : ''
      }`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream text-gray-500 dark:bg-navy-900 dark:text-gray-300">
        <Icon size={18} />
      </span>
      <span className="flex-1 text-sm font-bold text-gray-800 dark:text-gray-100">{label}</span>
      {value && <span className="text-xs font-bold text-gray-400">{value}</span>}
      {right ?? <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />}
    </Component>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="px-4 pb-1 pt-4 text-[11px] font-black uppercase tracking-widest text-gray-400">
        {title}
      </h3>
      <div className="divide-y divide-black/5 rounded-3xl bg-white shadow-sm ring-1 ring-black/5 dark:divide-white/5 dark:bg-navy-800 dark:ring-white/5">
        {children}
      </div>
    </section>
  )
}

export default function Settings({ theme, onToggleTheme, onLogout, onOpenBirthDate, onOpenPassword }) {
  const { displayName, user, profile } = useAuth()
  const [notif, setNotif] = useState(true)
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')

  const formattedBirth = profile?.birth_date
    ? new Date(profile.birth_date + 'T00:00:00').toLocaleDateString('pt-BR')
    : ''
  const age = profile?.birth_date
    ? Math.floor((Date.now() - new Date(profile.birth_date + 'T00:00:00').getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null

  return (
    <div className="px-0 pb-8 pt-5">
      <div className="px-4">
        <h2 className="text-xl font-black text-gray-900 dark:text-white">Configurações</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Personalize sua experiência no DriverCare AI.
        </p>
      </div>

      <div className="mt-4 px-4">
        <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-choco-400 to-choco-600 text-lg font-black text-white">
            {initials || 'JD'}
          </span>
          <div className="flex-1">
            <p className="text-base font-extrabold text-gray-900 dark:text-white">{displayName}</p>
            <p className="text-xs font-semibold text-gray-400">
              {formattedBirth ? `${formattedBirth} · ` : ''}{user?.email || 'Motorista · Dellmar Transportes'}
            </p>
          </div>
        </div>
      </div>

      <Section title="Conta">
        <Row icon={CalendarDays} label="Data de nascimento" value={age !== null ? `${formattedBirth} · ${age} anos` : formattedBirth} onClick={onOpenBirthDate} />
        <Row icon={KeyRound} label="Alterar senha" onClick={onOpenPassword} />
      </Section>

      <Section title="Preferências">
        <Row icon={Bell} label="Notificações" right={<Toggle on={notif} onChange={() => setNotif((n) => !n)} />} />
        <Row
          icon={theme === 'dark' ? Moon : Sun}
          label="Tema escuro"
          right={<Toggle on={theme === 'dark'} onChange={onToggleTheme} />}
        />
      </Section>

      <Section title="Segurança e Apoio">
        <Row icon={ContactRound} label="Contato de emergência" value="+55 11 99999-9999" />
        <Row icon={Info} label="Sobre o DriverCare AI" />
        <Row icon={FileText} label="Política de Privacidade" />
      </Section>

      <div className="mt-6 px-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-red-50 py-4 text-sm font-extrabold text-danger-500 ring-1 ring-danger-500/20 transition active:scale-[0.98] dark:bg-danger-500/10 dark:ring-danger-500/30"
        >
          <LogOut size={17} />
          Sair
        </button>
        <p className="mt-4 text-center text-[10px] font-semibold text-gray-400">

        </p>
      </div>
    </div>
  )
}
