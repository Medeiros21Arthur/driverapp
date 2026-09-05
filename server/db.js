import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sql from 'mssql'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()

const BR_TIMEZONE = 'America/Sao_Paulo'

function buildConfig() {
  if (process.env.AZURE_SQL_CONNECTION_STRING) {
    return {
      connectionString: process.env.AZURE_SQL_CONNECTION_STRING,
      pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
    }
  }
  return {
    server: process.env.AZURE_SQL_SERVER || process.env.DB_SERVER || process.env.DB_HOST,
    database: process.env.AZURE_SQL_DATABASE || process.env.DB_DATABASE || process.env.DB_NAME,
    user: process.env.AZURE_SQL_USER || process.env.DB_USER,
    password: process.env.AZURE_SQL_PASSWORD || process.env.DB_PASSWORD || process.env.DB_PASS,
    port: Number(process.env.AZURE_SQL_PORT || process.env.DB_PORT || 1433),
    options: {
      encrypt: process.env.AZURE_SQL_ENCRYPT !== 'false' && process.env.DB_ENCRYPT !== 'false',
      trustServerCertificate: process.env.AZURE_SQL_TRUST_CERT === 'true' || process.env.DB_TRUST_CERT === 'true',
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  }
}

let pool = null

async function getPool() {
  if (pool && pool.connected) return pool
  const config = buildConfig()
  const p = new sql.ConnectionPool(config)
  p.on('error', (e) => {
    console.error('[mssql] pool error:', e.message)
    pool = null
  })
  try {
    pool = await p.connect()
    return pool
  } catch (e) {
    pool = null
    console.error(`[mssql] Falha ao conectar ao banco de dados (${config.server || 'servidor não definido'}):`, e.message)
    throw e
  }
}

// inputs: [{ name, type, value }]
async function query(text, inputs = []) {
  const pool = await getPool()
  const req = pool.request()
  for (const { name, type, value } of inputs) {
    req.input(name, type, value === undefined ? null : value)
  }
  const result = await req.query(text)
  return result
}

function getBrDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BR_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function dayRange(date) {
  const start = new Date(`${date}T00:00:00-03:00`)
  return { start: start.toISOString(), end: new Date(start.getTime() + 86400000).toISOString() }
}

function monthRange(year, month) {
  const first = new Date(`${year}-${String(month).padStart(2, '0')}-01T00:00:00-03:00`)
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return { start: first.toISOString(), end: new Date(first.getTime() + days * 86400000).toISOString() }
}

const WEEKDAY_LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] // dom..sab

export function breaksPerDay(rows, date, days) {
  const end = new Date(dayRange(date).end)
  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - 86400000 - i * 86400000)
    const key = getBrDate(d)
    const count = rows.filter((r) => r.completed_at_iso && getBrDate(new Date(r.completed_at_iso)) === key).length
    const label = WEEKDAY_LETTERS[new Date(`${key}T00:00:00Z`).getUTCDay()]
    result.push({ date: key, label, count })
  }
  return result
}

export { sql, query, getPool, getBrDate, dayRange, monthRange }