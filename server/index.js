import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import express from 'express'
import cors from 'cors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomBytes, createHash } from 'node:crypto'
import { sql, query, dayRange, monthRange, breaksPerDay, getBrDate } from './db.js'

const PORT = Number(process.env.PORT || 3001)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const JWT_EXPIRES = process.env.JWT_EXPIRES || '30d'
const RESET_TTL_MS = 60 * 60 * 1000 // 1h

const app = express()
app.use(cors())
app.use(express.json())

function ok(res, payload = {}) {
  return res.json({ ok: true, ...payload })
}

function fail(res, status, code, message) {
  return res.status(status).json({ ok: false, error: { code, message } })
}

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

function formatDate(d) {
  if (!d) return null
  const date = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}

function publicUser(row) {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    birth_date: formatDate(row.birth_date),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

// ---------------------- AUTH ----------------------

function authRequired(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return fail(res, 401, 'unauthorized', 'Não autenticado.')
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.userId = payload.sub
    return next()
  } catch {
    return fail(res, 401, 'unauthorized', 'Sessão expirada, entre novamente.')
  }
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, birthDate } = req.body || {}
    const name = String(fullName || '').trim()
    const mail = String(email || '').trim().toLowerCase()
    if (!name) return fail(res, 400, 'missing_name', 'Informe seu nome completo.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return fail(res, 400, 'invalid_email', 'Informe um e-mail válido.')
    if (!password || String(password).length < 6) return fail(res, 400, 'weak_password', 'A senha deve ter pelo menos 6 caracteres.')
    if (!birthDate) return fail(res, 400, 'missing_birth_date', 'Informe sua data de nascimento.')

    const existing = await query('SELECT id FROM usersmotorista WHERE email = @email', [
      { name: 'email', type: sql.NVarChar, value: mail },
    ])
    if (existing.recordset.length > 0) return fail(res, 409, 'user_already_exists', 'Este e-mail já está cadastrado. Tente entrar.')

    const hash = await bcrypt.hash(password, 10)
    const inserted = await query(
      `INSERT INTO usersmotorista (email, password_hash, full_name, birth_date)
       OUTPUT INSERTED.id, INSERTED.email, INSERTED.full_name, INSERTED.birth_date, INSERTED.created_at, INSERTED.updated_at
       VALUES (@email, @hash, @name, @birthDate)`,
      [
        { name: 'email', type: sql.NVarChar, value: mail },
        { name: 'hash', type: sql.NVarChar, value: hash },
        { name: 'name', type: sql.NVarChar, value: name },
        { name: 'birthDate', type: sql.Date, value: birthDate },
      ],
    )
    const row = inserted.recordset[0]
    const user = publicUser(row)
    return ok(res, { user, token: signToken(user) })
  } catch (e) {
    console.error('[register]', e)
    return fail(res, 500, 'server_error', 'Não foi possível criar a conta. Tente novamente.')
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const mail = String(req.body?.email || '').trim().toLowerCase()
    const password = String(req.body?.password || '')
    const result = await query(
      'SELECT id, email, password_hash, full_name, birth_date, created_at, updated_at FROM usersmotorista WHERE email = @email',
      [{ name: 'email', type: sql.NVarChar, value: mail }],
    )
    const row = result.recordset[0]
    if (!row) return fail(res, 401, 'invalid_credentials', 'E-mail ou senha incorretos.')
    const match = await bcrypt.compare(password, row.password_hash)
    if (!match) return fail(res, 401, 'invalid_credentials', 'E-mail ou senha incorretos.')
    const user = publicUser(row)
    return ok(res, { user, token: signToken(user) })
  } catch (e) {
    console.error('[login]', e)
    return fail(res, 500, 'server_error', 'Não foi possível entrar. Tente novamente.')
  }
})

app.get('/api/auth/me', authRequired, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, full_name, birth_date, created_at, updated_at FROM usersmotorista WHERE id = @id',
      [{ name: 'id', type: sql.UniqueIdentifier, value: req.userId }],
    )
    const row = result.recordset[0]
    if (!row) return fail(res, 401, 'unauthorized', 'Usuário não encontrado.')
    return ok(res, { user: publicUser(row) })
  } catch (e) {
    console.error('[me]', e)
    return fail(res, 500, 'server_error', 'Erro interno.')
  }
})

app.post('/api/auth/change-password', authRequired, async (req, res) => {
  try {
    const password = String(req.body?.newPassword || '')
    if (password.length < 6) return fail(res, 400, 'weak_password', 'A nova senha deve ter pelo menos 6 caracteres.')
    const hash = await bcrypt.hash(password, 10)
    await query('UPDATE usersmotorista SET password_hash = @hash, updated_at = SYSUTCDATETIME() WHERE id = @id', [
      { name: 'hash', type: sql.NVarChar, value: hash },
      { name: 'id', type: sql.UniqueIdentifier, value: req.userId },
    ])
    return ok(res)
  } catch (e) {
    console.error('[change-password]', e)
    return fail(res, 500, 'server_error', 'Não foi possível alterar a senha.')
  }
})

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const mail = String(req.body?.email || '').trim().toLowerCase()
    const result = await query('SELECT id FROM usersmotorista WHERE email = @email', [
      { name: 'email', type: sql.NVarChar, value: mail },
    ])
    const row = result.recordset[0]
    // Não vaza se o e-mail existe ou não.
    if (row) {
      const token = randomBytes(32).toString('hex')
      const hash = createHash('sha256').update(token).digest('hex')
      await query('DELETE FROM password_resets WHERE user_id = @id', [
        { name: 'id', type: sql.UniqueIdentifier, value: row.id },
      ])
      await query(
        'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (@id, @hash, @expires)',
        [
          { name: 'id', type: sql.UniqueIdentifier, value: row.id },
          { name: 'hash', type: sql.NVarChar, value: hash },
          { name: 'expires', type: sql.DateTimeOffset, value: new Date(Date.now() + RESET_TTL_MS).toISOString() },
        ],
      )
      console.log(`[reset] link de redefinição (envie por e-mail via SMTP em produção): /reset?token=${token}`)
    }
    return ok(res, { message: 'Se o e-mail existir, você receberá um link de redefinição.' })
  } catch (e) {
    console.error('[forgot-password]', e)
    return fail(res, 500, 'server_error', 'Tente novamente em alguns instantes.')
  }
})

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const token = String(req.body?.token || '')
    const password = String(req.body?.newPassword || '')
    if (password.length < 6) return fail(res, 400, 'weak_password', 'A nova senha deve ter pelo menos 6 caracteres.')
    const hash = createHash('sha256').update(token).digest('hex')
    const result = await query(
      `SELECT pr.user_id FROM password_resets pr
       WHERE pr.token_hash = @hash AND pr.expires_at > SYSUTCDATETIME()`,
      [{ name: 'hash', type: sql.NVarChar, value: hash }],
    )
    const row = result.recordset[0]
    if (!row) return fail(res, 400, 'invalid_token', 'Link inválido ou expirado.')
    const pwHash = await bcrypt.hash(password, 10)
    await query('UPDATE usersmotorista SET password_hash = @hash, updated_at = SYSUTCDATETIME() WHERE id = @id', [
      { name: 'hash', type: sql.NVarChar, value: pwHash },
      { name: 'id', type: sql.UniqueIdentifier, value: row.user_id },
    ])
    await query('DELETE FROM password_resets WHERE user_id = @id', [
      { name: 'id', type: sql.UniqueIdentifier, value: row.user_id },
    ])
    return ok(res)
  } catch (e) {
    console.error('[reset-password]', e)
    return fail(res, 500, 'server_error', 'Não foi possível redefinir a senha.')
  }
})

// ---------------------- PERFIL ----------------------

app.get('/api/profile', authRequired, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, full_name, birth_date, created_at, updated_at FROM usersmotorista WHERE id = @id',
      [{ name: 'id', type: sql.UniqueIdentifier, value: req.userId }],
    )
    const row = result.recordset[0]
    if (!row) return fail(res, 404, 'not_found', 'Perfil não encontrado.')
    return ok(res, { profile: publicUser(row) })
  } catch (e) {
    console.error('[profile]', e)
    return fail(res, 500, 'server_error', 'Erro interno.')
  }
})

app.put('/api/profile', authRequired, async (req, res) => {
  try {
    const { full_name, birth_date } = req.body || {}
    const result = await query(
      `UPDATE usersmotorista SET
         full_name = COALESCE(@fullName, usersmotorista.full_name),
         birth_date = COALESCE(@birthDate, usersmotorista.birth_date),
         updated_at = SYSUTCDATETIME()
       OUTPUT INSERTED.id, INSERTED.email, INSERTED.full_name, INSERTED.birth_date, INSERTED.created_at, INSERTED.updated_at
       WHERE id = @id`,
      [
        { name: 'fullName', type: sql.NVarChar, value: full_name || null },
        { name: 'birthDate', type: sql.Date, value: birth_date || null },
        { name: 'id', type: sql.UniqueIdentifier, value: req.userId },
      ],
    )
    const row = result.recordset[0]
    if (!row) return fail(res, 404, 'not_found', 'Perfil não encontrado.')
    return ok(res, { profile: publicUser(row) })
  } catch (e) {
    console.error('[profile update]', e)
    return fail(res, 500, 'server_error', 'Não foi possível salvar.')
  }
})

// ---------------------- SAÚDE ----------------------

app.get('/api/health', authRequired, async (req, res) => {
  try {
    const date = req.query.date || getBrDate()
    const result = await query(
      `SELECT hours_driving, breaks_taken, water_glasses, pain_level
       FROM health_logs WHERE user_id = @id AND log_date = @date`,
      [
        { name: 'id', type: sql.UniqueIdentifier, value: req.userId },
        { name: 'date', type: sql.Date, value: date },
      ],
    )
    return ok(res, { log: result.recordset[0] || null })
  } catch (e) {
    console.error('[health]', e)
    return fail(res, 500, 'server_error', 'Erro interno.')
  }
})

app.put('/api/health', authRequired, async (req, res) => {
  try {
    const date = req.body?.log_date || getBrDate()
    const { hours_driving, breaks_taken, water_glasses, pain_level } = req.body || {}
    await query(
      `MERGE health_logs AS t
       USING (SELECT @id AS user_id, @date AS log_date) AS s ON t.user_id = s.user_id AND t.log_date = s.log_date
       WHEN MATCHED THEN UPDATE SET
         hours_driving = COALESCE(@hoursDriving, t.hours_driving),
         breaks_taken = COALESCE(@breaksTaken, t.breaks_taken),
         water_glasses = COALESCE(@waterGlasses, t.water_glasses),
         pain_level = COALESCE(@painLevel, t.pain_level)
       WHEN NOT MATCHED THEN INSERT (user_id, log_date, hours_driving, breaks_taken, water_glasses, pain_level)
         VALUES (@id, @date, @hoursDriving, @breaksTaken, @waterGlasses, @painLevel);`,
      [
        { name: 'id', type: sql.UniqueIdentifier, value: req.userId },
        { name: 'date', type: sql.Date, value: date },
        { name: 'hoursDriving', type: sql.Decimal, value: hours_driving ?? null },
        { name: 'breaksTaken', type: sql.Int, value: breaks_taken ?? null },
        { name: 'waterGlasses', type: sql.Int, value: water_glasses ?? null },
        { name: 'painLevel', type: sql.Int, value: pain_level ?? null },
      ],
    )
    return ok(res)
  } catch (e) {
    console.error('[health update]', e)
    return fail(res, 500, 'server_error', 'Não foi possível salvar.')
  }
})

// ---------------------- ÁGUA ----------------------

app.post('/api/water', authRequired, async (req, res) => {
  try {
    const amountMl = Number(req.body?.amountMl) || 250
    await query('INSERT INTO water_logs (user_id, amount_ml) VALUES (@id, @amountMl)', [
      { name: 'id', type: sql.UniqueIdentifier, value: req.userId },
      { name: 'amountMl', type: sql.Int, value: amountMl },
    ])
    return ok(res)
  } catch (e) {
    console.error('[water]', e)
    return fail(res, 500, 'server_error', 'Não foi possível registrar.')
  }
})

app.get('/api/water/day', authRequired, async (req, res) => {
  try {
    const date = req.query.date || getBrDate()
    const { start, end } = dayRange(date)
    const result = await query(
      `SELECT ISNULL(SUM(amount_ml), 0) AS total FROM water_logs
       WHERE user_id = @id AND created_at >= @start AND created_at < @end`,
      [
        { name: 'id', type: sql.UniqueIdentifier, value: req.userId },
        { name: 'start', type: sql.DateTimeOffset, value: start },
        { name: 'end', type: sql.DateTimeOffset, value: end },
      ],
    )
    return ok(res, { totalMl: result.recordset[0]?.total || 0 })
  } catch (e) {
    console.error('[water/day]', e)
    return fail(res, 500, 'server_error', 'Erro interno.')
  }
})

// ---------------------- PAUSAS ATIVAS ----------------------

app.post('/api/breaks', authRequired, async (req, res) => {
  try {
    const exerciseId = String(req.body?.exerciseId || '')
    const title = String(req.body?.title || '')
    const durationSeconds = Number(req.body?.durationSeconds) || 0
    await query(
      'INSERT INTO active_breaks (user_id, exercise_id, exercise_title, duration_seconds) VALUES (@id, @exerciseId, @title, @durationSeconds)',
      [
        { name: 'id', type: sql.UniqueIdentifier, value: req.userId },
        { name: 'exerciseId', type: sql.NVarChar, value: exerciseId || null },
        { name: 'title', type: sql.NVarChar, value: title || null },
        { name: 'durationSeconds', type: sql.Int, value: durationSeconds },
      ],
    )
    return ok(res)
  } catch (e) {
    console.error('[breaks]', e)
    return fail(res, 500, 'server_error', 'Não foi possível registrar.')
  }
})

app.get('/api/breaks/day', authRequired, async (req, res) => {
  try {
    const date = req.query.date || getBrDate()
    const { start, end } = dayRange(date)
    const result = await query(
      `SELECT COUNT(*) AS count FROM active_breaks
       WHERE user_id = @id AND completed_at >= @start AND completed_at < @end`,
      [
        { name: 'id', type: sql.UniqueIdentifier, value: req.userId },
        { name: 'start', type: sql.DateTimeOffset, value: start },
        { name: 'end', type: sql.DateTimeOffset, value: end },
      ],
    )
    return ok(res, { count: result.recordset[0]?.count || 0 })
  } catch (e) {
    console.error('[breaks/day]', e)
    return fail(res, 500, 'server_error', 'Erro interno.')
  }
})

app.get('/api/breaks/weekly', authRequired, async (req, res) => {
  try {
    const date = req.query.date || getBrDate()
    const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 31)
    const end = new Date(dayRange(date).end)
    const from = new Date(end.getTime() - days * 86400000).toISOString()
    const result = await query(
      `SELECT CONVERT(varchar(33), completed_at, 127) AS completed_at_iso FROM active_breaks
       WHERE user_id = @id AND completed_at >= @start AND completed_at < @end`,
      [
        { name: 'id', type: sql.UniqueIdentifier, value: req.userId },
        { name: 'start', type: sql.DateTimeOffset, value: from },
        { name: 'end', type: sql.DateTimeOffset, value: end.toISOString() },
      ],
    )
    const list = breaksPerDay(result.recordset || [], date, days)
    return ok(res, { list })
  } catch (e) {
    console.error('[breaks/weekly]', e)
    return fail(res, 500, 'server_error', 'Erro interno.')
  }
})

// ---------------------- RESUMOS ----------------------

app.get('/api/summary/day', authRequired, async (req, res) => {
  try {
    const date = req.query.date || getBrDate()
    const userId = req.userId
    const { start, end } = dayRange(date)
    const [water, breaks, health] = await Promise.all([
      query(
        `SELECT ISNULL(SUM(amount_ml), 0) AS total FROM water_logs
         WHERE user_id = @id AND created_at >= @wStart AND created_at < @wEnd`,
        [
          { name: 'id', type: sql.UniqueIdentifier, value: userId },
          { name: 'wStart', type: sql.DateTimeOffset, value: start },
          { name: 'wEnd', type: sql.DateTimeOffset, value: end },
        ],
      ),
      query(
        `SELECT COUNT(*) AS count FROM active_breaks
         WHERE user_id = @id AND completed_at >= @bStart AND completed_at < @bEnd`,
        [
          { name: 'id', type: sql.UniqueIdentifier, value: userId },
          { name: 'bStart', type: sql.DateTimeOffset, value: start },
          { name: 'bEnd', type: sql.DateTimeOffset, value: end },
        ],
      ),
      query(
        `SELECT pain_level FROM health_logs WHERE user_id = @id AND log_date = @date`,
        [
          { name: 'id', type: sql.UniqueIdentifier, value: userId },
          { name: 'date', type: sql.Date, value: date },
        ],
      ),
    ])
    const waterMl = water.recordset[0]?.total || 0
    const breaksCount = breaks.recordset[0]?.count || 0
    return ok(res, {
      waterMl,
      waterGlasses: Math.floor(waterMl / 250),
      breaks: breaksCount,
      painLevel: typeof health.recordset[0]?.pain_level === 'number' ? health.recordset[0].pain_level : null,
    })
  } catch (e) {
    console.error('[summary/day]', e)
    return fail(res, 500, 'server_error', 'Erro interno.')
  }
})

app.get('/api/summary/month', authRequired, async (req, res) => {
  try {
    const year = Number(req.query.year)
    const month = Number(req.query.month)
    const { start, end } = monthRange(year, month)
    const [w, b] = await Promise.all([
      query(
        `SELECT ISNULL(SUM(amount_ml), 0) AS total FROM water_logs
         WHERE user_id = @id AND created_at >= @wStart AND created_at < @wEnd`,
        [
          { name: 'id', type: sql.UniqueIdentifier, value: req.userId },
          { name: 'wStart', type: sql.DateTimeOffset, value: start },
          { name: 'wEnd', type: sql.DateTimeOffset, value: end },
        ],
      ),
      query(
        `SELECT COUNT(*) AS count FROM active_breaks
         WHERE user_id = @id AND completed_at >= @bStart AND completed_at < @bEnd`,
        [
          { name: 'id', type: sql.UniqueIdentifier, value: req.userId },
          { name: 'bStart', type: sql.DateTimeOffset, value: start },
          { name: 'bEnd', type: sql.DateTimeOffset, value: end },
        ],
      ),
    ])
    return ok(res, { waterMl: w.recordset[0]?.total || 0, breaks: b.recordset[0]?.count || 0 })
  } catch (e) {
    console.error('[summary/month]', e)
    return fail(res, 500, 'server_error', 'Erro interno.')
  }
})

app.get('/api/healthcheck', (_req, res) => ok(res, { status: 'ok' }))

// Servir frontend compilado (Vite dist) em produção
const distPath = path.resolve(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return fail(res, 404, 'not_found', 'Rota da API não encontrada.')
    }
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`DriverCare API rodando em http://localhost:${PORT}`)
})