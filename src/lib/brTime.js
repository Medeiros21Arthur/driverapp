const BR_TIMEZONE = 'America/Sao_Paulo'

export function getBrDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BR_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function getBrHour(date = new Date()) {
  const h = new Intl.DateTimeFormat('pt-BR', {
    timeZone: BR_TIMEZONE,
    hour: 'numeric',
    hour12: false,
  }).format(date)
  return Number(h) || 0
}

export function getBrWeekday(date = new Date()) {
  const d = new Intl.DateTimeFormat('pt-BR', { timeZone: BR_TIMEZONE, weekday: 'long' }).format(date)
  return d.charAt(0).toUpperCase() + d.slice(1)
}

export function toBrDate(isoDate) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BR_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(isoDate))
}

export function greetByTime(date = new Date()) {
  const h = getBrHour(date)
  if (h >= 5 && h < 12) return 'Bom dia'
  if (h >= 12 && h < 18) return 'Boa tarde'
  return 'Boa noite'
}
