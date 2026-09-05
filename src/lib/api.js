const BASE = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'dc_token'

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

let token = readToken()

export function getToken() {
  return token
}

function storeToken(value) {
  token = value
  try {
    if (value) localStorage.setItem(TOKEN_KEY, value)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

async function request(path, opts = {}) {
  const headers = { ...(opts.headers || {}) }
  if (opts.body !== undefined && !(opts.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res
  try {
    res = await fetch(BASE + path, { ...opts, headers })
  } catch {
    return {
      ok: false,
      data: null,
      error: { code: 'network_error', message: 'Não foi possível conectar ao servidor. Verifique se a API está rodando.' },
    }
  }

  let body = null
  try {
    body = await res.json()
  } catch {
    body = null
  }

  if (!res.ok) {
    return { ok: false, data: null, error: body?.error || { code: `http_${res.status}`, message: `Erro no servidor (${res.status})` } }
  }
  return { ok: true, data: body, error: null }
}

export function apiGet(path) {
  return request(path)
}

export function apiPost(path, body) {
  return request(path, { method: 'POST', body: JSON.stringify(body) })
}

export function apiPut(path, body) {
  return request(path, { method: 'PUT', body: JSON.stringify(body) })
}

export function apiDelete(path) {
  return request(path, { method: 'DELETE' })
}

// ---------- Sessão / autenticação ----------
export async function getSession() {
  if (!token) return null
  const res = await request('/auth/me')
  if (!res.ok) {
    storeToken(null)
    return null
  }
  return { user: res.data.user }
}

export async function signIn(email, password) {
  const res = await apiPost('/auth/login', { email, password })
  if (res.ok) storeToken(res.data.token)
  return { ok: res.ok, data: res.data, error: res.error }
}

export async function signUp(fullName, email, password, birthDate) {
  const res = await apiPost('/auth/register', { fullName, email, password, birthDate })
  if (res.ok) storeToken(res.data.token)
  return { ok: res.ok, data: res.data, error: res.error }
}

export async function updatePassword(newPassword) {
  const res = await apiPost('/auth/change-password', { newPassword })
  return { ok: res.ok, data: res.data, error: res.error }
}

export async function resetPassword(email) {
  const res = await apiPost('/auth/forgot-password', { email })
  return { ok: res.ok, data: res.data, error: res.error }
}

export async function signOut() {
  storeToken(null)
  return { ok: true }
}