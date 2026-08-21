CREATE TABLE clicks (
    id BIGSERIAL PRIMARY KEY,          -- Clicks grow fast; BIGSERIAL handles up to 9 quintillion rows
    url_id INT NOT NULL,               -- Links directly to the specific row in the urls table
    clicked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    geo_location VARCHAR(100),         -- E.g., 'IN', 'US', 'Delhi'
    device_type VARCHAR(20),           -- E.g., 'mobile', 'desktop', 'tablet'
    os VARCHAR(50),                    -- E.g., 'iOS', 'Windows', 'Android'
    browser VARCHAR(50),               -- E.g., 'Chrome', 'Safari'
    
    -- Connects this table to the urls table
    FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE
);