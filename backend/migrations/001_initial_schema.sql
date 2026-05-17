-- =========================================================================
-- Migration: 001_initial_schema
-- Description: Initializes users, urls, and clicks tables with performance indexes.
-- =========================================================================

BEGIN;

-- 1. ENABLE EXTENSIONS
-- Required for generating UUIDv4 keys upstream via gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. CREATE TABLES

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Urls Table
CREATE TABLE IF NOT EXISTS urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_code VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    click_count INTEGER DEFAULT 0 NOT NULL
);

-- Clicks Table
CREATE TABLE IF NOT EXISTS clicks (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) NOT NULL REFERENCES urls(short_code) ON DELETE CASCADE,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address INET,
    country_code VARCHAR(2),
    device_type VARCHAR(10),
    referer TEXT
);

-- 3. CREATE INDEXES

-- Users Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Urls Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_user_id ON urls(user_id);

-- Partial index optimizing queries searching for active/inactive temporal windows (ignores NULL lifetimes)
CREATE INDEX IF NOT EXISTS idx_urls_expires_at ON urls(expires_at) WHERE expires_at IS NOT NULL;

-- Clicks Indexes
CREATE INDEX IF NOT EXISTS idx_clicks_short_code ON clicks(short_code);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at);

-- Compound index optimizing analytics queries filtering on a code and filtering/sorting by execution time
CREATE INDEX IF NOT EXISTS idx_clicks_code_time ON clicks(short_code, clicked_at);

COMMIT;