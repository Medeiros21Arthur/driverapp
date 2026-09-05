import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './AuthContext'
import Splash from './screens/Splash'
import Login from './screens/Login'
import MainApp from './MainApp'

function AppShell() {
  const { user, loading, signOut } = useAuth()
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('dc_theme') || 'light'
    } catch {
      return 'light'
    }
  })
  const [stage, setStage] = useState('splash')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('dc_theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    if (!loading) setStage(user ? 'main' : 'login')
  }, [user, loading])

  if (stage === 'splash') return <Splash onDone={() => setStage('login')} />

  if (stage === 'login' && !user) {
    return <Login />
  }

  return (
    <MainApp
      theme={theme}
      onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      onLogout={async () => {
        await signOut()
        setStage('login')
      }}
    />
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
