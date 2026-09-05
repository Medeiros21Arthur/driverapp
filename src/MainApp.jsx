import { useState } from 'react'
import { Header, BottomTabs } from './components/AppShell'
import Home from './screens/Home'
import Exercises from './screens/Exercises'
import Health from './screens/Health'
import Settings from './screens/Settings'
import Emergency from './screens/Emergency'
import Articles from './screens/Articles'
import ArticleDetail from './screens/ArticleDetail'
import ExercisePlayer from './screens/ExercisePlayer'
import ChangePassword from './screens/ChangePassword'
import BirthDateModal from './components/BirthDateModal'

export default function MainApp({ theme, onToggleTheme, onLogout }) {
  const [stack, setStack] = useState([{ name: 'tab', tab: 'home' }])
  const [birthModal, setBirthModal] = useState(false)
  const current = stack[stack.length - 1]
  const push = (view) => setStack((s) => [...s, view])
  const pop = () => setStack((s) => s.slice(0, -1))

  if (current.name === 'emergency') return <Emergency onClose={pop} />
  if (current.name === 'articles') return <Articles onBack={pop} onOpenArticle={(id) => push({ name: 'article', id })} />
  if (current.name === 'article') return <ArticleDetail articleId={current.id} onBack={pop} />
  if (current.name === 'player') return <ExercisePlayer exerciseId={current.id} onClose={pop} />
  if (current.name === 'password') return <ChangePassword onBack={pop} />

  const tab = current.tab
  const openPlayer = (id) => push({ name: 'player', id })
  const openEmergency = () => push({ name: 'emergency' })

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col">
      <Header onEmergency={openEmergency} />

      <main className="flex-1">
        {tab === 'home' && (
          <Home
            onOpenPlayer={openPlayer}
            onOpenArticles={() => push({ name: 'articles' })}
            onOpenArticle={(id) => push({ name: 'article', id })}
            onEmergency={openEmergency}
          />
        )}
        {tab === 'exercises' && <Exercises onOpenPlayer={openPlayer} />}
        {tab === 'health' && <Health />}
        {tab === 'settings' && (
          <Settings
            theme={theme}
            onToggleTheme={onToggleTheme}
            onLogout={onLogout}
            onOpenBirthDate={() => setBirthModal(true)}
            onOpenPassword={() => push({ name: 'password' })}
          />
        )}
      </main>

      <BottomTabs active={tab} onChange={(t) => setStack([{ name: 'tab', tab: t }])} />
      <BirthDateModal open={birthModal} onClose={() => setBirthModal(false)} />
    </div>
  )
}
