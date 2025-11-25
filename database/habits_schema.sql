-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 10,
  icon VARCHAR(50) DEFAULT '📱',
  color VARCHAR(7) DEFAULT '#d60036',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create habit logs table (for tracking streaks)
CREATE TABLE IF NOT EXISTS habit_logs (
  id SERIAL PRIMARY KEY,
  habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_at DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(habit_id, completed_at)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_completed_at ON habit_logs(completed_at);

-- Insert sample habits
INSERT INTO habits (user_id, name, description, duration_minutes, icon, color) VALUES
  (1, 'Odkładanie telefonu', 'Bez telefonu przez 10 minut', 10, '📱', '#d60036'),
  (1, 'Medytacja', '5 minut świadomości', 5, '🧘', '#f2ad78'),
  (1, 'Czytanie', '15 minut książki', 15, '📚', '#000831')
ON CONFLICT DO NOTHING;

-- Display tables
SELECT * FROM habits;
SELECT * FROM habit_logs;
