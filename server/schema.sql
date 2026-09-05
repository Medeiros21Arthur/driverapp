-- ============================================================
-- DriverCare AI — Schema Azure SQL Server
-- Execução segura/idos: cria somente o que ainda não existe.
-- Execute no banco Azure (ex.: SSMS, Azure Data Studio ou
-- "Query editor" do portal do Azure).
-- ============================================================

-- ---------- USUÁRIOS / PERFIL ----------
-- A tabela de usuários usa o nome "usersmotorista" para não
-- colidir com uma eventual tabela antiga "Users".
IF OBJECT_ID('dbo.usersmotorista', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.usersmotorista (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_usersmotorista PRIMARY KEY DEFAULT NEWID(),
    email NVARCHAR(255) NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255) NOT NULL,
    birth_date DATE NULL,
    created_at DATETIMEOFFSET NOT NULL CONSTRAINT DF_usersmotorista_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIMEOFFSET NOT NULL CONSTRAINT DF_usersmotorista_updated_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_usersmotorista_email UNIQUE (email)
  );
END

-- ---------- LOGS DE SAÚDE ----------
IF OBJECT_ID('dbo.health_logs', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.health_logs (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_health_logs PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_health_logs_user REFERENCES dbo.usersmotorista(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    hours_driving DECIMAL(5,2) NULL,
    breaks_taken INT NULL,
    water_glasses INT NULL CONSTRAINT CK_health_logs_water CHECK (water_glasses BETWEEN 0 AND 30),
    pain_level INT NULL CONSTRAINT CK_health_logs_pain CHECK (pain_level BETWEEN 1 AND 10),
    created_at DATETIMEOFFSET NOT NULL CONSTRAINT DF_health_logs_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_health_logs_user_date UNIQUE (user_id, log_date)
  );
  CREATE INDEX IX_health_logs_user_date ON dbo.health_logs (user_id, log_date);
END

-- ---------- CONTROLE DE ÁGUA ----------
IF OBJECT_ID('dbo.water_logs', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.water_logs (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_water_logs PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_water_logs_user REFERENCES dbo.usersmotorista(id) ON DELETE CASCADE,
    amount_ml INT NOT NULL CONSTRAINT DF_water_logs_amount DEFAULT 250,
    created_at DATETIMEOFFSET NOT NULL CONSTRAINT DF_water_logs_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_water_logs_amount CHECK (amount_ml > 0)
  );
  CREATE INDEX IX_water_logs_user_date ON dbo.water_logs (user_id, created_at);
END

-- ---------- PAUSAS ATIVAS REALIZADAS ----------
IF OBJECT_ID('dbo.active_breaks', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.active_breaks (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_active_breaks PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_active_breaks_user REFERENCES dbo.usersmotorista(id) ON DELETE CASCADE,
    exercise_id NVARCHAR(64) NULL,
    exercise_title NVARCHAR(255) NULL,
    duration_seconds INT NULL CONSTRAINT CK_active_breaks_duration CHECK (duration_seconds >= 0),
    completed_at DATETIMEOFFSET NOT NULL CONSTRAINT DF_active_breaks_completed_at DEFAULT SYSUTCDATETIME()
  );
  CREATE INDEX IX_active_breaks_user_date ON dbo.active_breaks (user_id, completed_at);
END

-- ---------- REDEFINIÇÃO DE SENHA ----------
IF OBJECT_ID('dbo.password_resets', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.password_resets (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_password_resets PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_password_resets_user REFERENCES dbo.usersmotorista(id) ON DELETE CASCADE,
    token_hash NVARCHAR(64) NOT NULL,
    created_at DATETIMEOFFSET NOT NULL CONSTRAINT DF_password_resets_created_at DEFAULT SYSUTCDATETIME(),
    expires_at DATETIMEOFFSET NOT NULL
  );
  CREATE INDEX IX_password_resets_hash ON dbo.password_resets (token_hash);
END