import {
  Home as HomeIcon,
  Dumbbell,
  HeartPulse,
  Settings as SettingsIcon,
  AlertTriangle,
} from 'lucide-react'
import { useAuth } from '../AuthContext'

export function Header({ onEmergency }) {
  const { displayName } = useAuth()
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')
  const firstName = displayName.split(' ')[0]

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-cream/90 px-4 py-3 backdrop-blur dark:border-white/5 dark:bg-navy-900/90">
      <button
        className="flex items-center gap-2"
        aria-label="Perfil"
        onClick={() => {}}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-choco-400 to-choco-600 text-sm font-extrabold text-white ring-2 ring-white dark:ring-navy-800">
          {initials || 'JD'}
        </span>
        <span className="hidden text-left text-xs font-semibold leading-tight text-gray-500 dark:text-gray-400 sm:block">
          Olá,
          <br />
          <span className="text-gray-900 dark:text-gray-100">{firstName}</span>
        </span>
      </button>

      <h1 className="text-lg font-black tracking-tight text-brand-600 dark:text-brand-500">
        DriverCare <span className="text-choco-500 dark:text-choco-400">AI</span>
      </h1>

      <button
        onClick={onEmergency}
        aria-label="Emergência"
        className="flex h-9 w-9 items-center justify-center rounded-full text-danger-500 transition active:scale-95"
      >
        <AlertTriangle size={22} strokeWidth={2.2} />
      </button>
    </header>
  )
}

const tabs = [
  { id: 'home', label: 'Início', icon: HomeIcon },
  { id: 'exercises', label: 'Exercícios', icon: Dumbbell },
  { id: 'health', label: 'Saúde', icon: HeartPulse },
  { id: 'settings', label: 'Configurações', icon: SettingsIcon },
]

export function BottomTabs({ active, onChange }) {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-black/5 bg-white/95 px-1 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur dark:border-white/5 dark:bg-navy-900/95">
      <div className="mx-auto flex max-w-md items-stretch justify-between">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="relative flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-0.5"
              aria-label={label}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              </span>
              <span
                className={`text-[10px] font-bold tracking-wide ${
                  isActive ? 'text-brand-600 dark:text-brand-500' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
