-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email) VALUES
  ('Jan Kowalski', 'jan.kowalski@example.com'),
  ('Anna Nowak', 'anna.nowak@example.com'),
  ('Piotr Wiśniewski', 'piotr.wisniewski@example.com')
ON CONFLICT (email) DO NOTHING;

-- Display all users
SELECT * FROM users;
