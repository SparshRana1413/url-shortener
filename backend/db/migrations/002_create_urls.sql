CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,             -- Unique ID for this specific short-url generation row
    user_id INT NOT NULL,              -- References the user who created it
    short_code VARCHAR(50) UNIQUE NOT NULL, -- E.g., 'my-custom-link' or 'aB89xQ'
    long_url TEXT NOT NULL,            -- The destination URL
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Connects this table to the users table
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);