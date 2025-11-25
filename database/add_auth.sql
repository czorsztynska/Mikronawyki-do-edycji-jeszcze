-- Add password column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Update existing users with a default hashed password (you should change this)
-- This is just for testing - in production, users should set their own passwords
UPDATE users SET password = '$2b$10$XqKv.KZ5Z5Z5Z5Z5Z5Z5Z.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5' WHERE password IS NULL;

-- Display updated table structure
\d users;
