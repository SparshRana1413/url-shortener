CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    short_code VARCHAR(50) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    click_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);