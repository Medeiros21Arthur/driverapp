import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as auth from './lib/api'
import { getProfile } from './lib/db'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const applyUser = useCallback((u) => {
    setUser(u)
    setProfile(u)
  }, [])

  useEffect(() => {
    let active = true

    auth
      .getSession()
      .then((session) => {
        if (!active) return
        const u = session?.user ?? null
        setUser(u)
        setProfile(u)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    const p = await getProfile()
    if (p) setProfile(p)
  }, [])

  const signIn = useCallback(async (email, password) => {
    const res = await auth.signIn(email, password)
    if (res.ok && res.data?.user) applyUser(res.data.user)
    return res
  }, [applyUser])

  const signUp = useCallback(async (name, email, password, birthDate) => {
    const res = await auth.signUp(name, email, password, birthDate)
    if (res.ok && res.data?.user) applyUser(res.data.user)
    return res
  }, [applyUser])

  const resetPassword = useCallback((email) => auth.resetPassword(email), [])
  const updatePassword = useCallback((newPassword) => auth.updatePassword(newPassword), [])

  const signOut = useCallback(async () => {
    await auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  const displayName =
    profile?.full_name?.trim() || user?.full_name?.trim() || user?.email?.split('@')[0] || 'Motorista'

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        displayName,
        refreshProfile,
        signIn,
        signUp,
        resetPassword,
        updatePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}