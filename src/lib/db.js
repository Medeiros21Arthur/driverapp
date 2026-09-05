import { apiGet, apiPost, apiPut } from './api'
import { getBrDate } from './brTime'

export const WATER_GLASS_ML = 250
export const DAILY_WATER_GOAL_ML = 2000
export const DAILY_BREAK_GOAL = 5
export const WEEKLY_BREAK_GOAL = 20

// ---------- PERFIL ----------
export async function getProfile() {
  const res = await apiGet('/profile')
  return res.ok ? res.data.profile : null
}

export async function updateProfile(_userId, fields) {
  const res = await apiPut('/profile', fields)
  return { ok: res.ok, data: res.data, error: res.error }
}

// ---------- DOR ----------
export async function getHealthLog(_userId, date = getBrDate()) {
  const res = await apiGet(`/health?date=${date}`)
  return res.ok ? res.data.log : null
}

export async function saveHealthLog(_userId, fields, date = getBrDate()) {
  await apiPut('/health', { ...fields, log_date: date })
}

// ---------- ÁGUA ----------
export async function addWater(_userId, amountMl = WATER_GLASS_ML) {
  const res = await apiPost('/water', { amountMl })
  return { ok: res.ok, error: res.error }
}

export async function getWaterForDay(_userId, date = getBrDate()) {
  const res = await apiGet(`/water/day?date=${date}`)
  return res.ok ? (res.data.totalMl || 0) : 0
}

// ---------- PAUSAS ATIVAS ----------
export async function logActiveBreak(_userId, exerciseId, title, durationSeconds) {
  const res = await apiPost('/breaks', { exerciseId, title, durationSeconds })
  return { ok: res.ok, error: res.error }
}

export async function getBreaksForDay(_userId, date = getBrDate()) {
  const res = await apiGet(`/breaks/day?date=${date}`)
  return res.ok ? (res.data.count || 0) : 0
}

export async function getBreaksPerDay(_userId, date = getBrDate(), days = 7) {
  const res = await apiGet(`/breaks/weekly?date=${date}&days=${days}`)
  return res.ok ? res.data.list : []
}

// ---------- RESUMO DO DIA ----------
export async function getDaySummary(_userId, date = getBrDate()) {
  const res = await apiGet(`/summary/day?date=${date}`)
  if (!res.ok) {
    return { waterMl: 0, waterGlasses: 0, breaks: 0, painLevel: null }
  }
  return res.data
}

// ---------- RESUMO DO MÊS ----------
export async function getMonthSummary(_userId, year, month) {
  const res = await apiGet(`/summary/month?year=${year}&month=${month}`)
  if (!res.ok) return { waterMl: 0, breaks: 0 }
  return res.data
}

export async function getCurrentMonthName() {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', month: 'long' }).format(
    new Date(),
  )
}