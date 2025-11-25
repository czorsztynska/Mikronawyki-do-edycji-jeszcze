import pool from '../config/database.js';

// Get all habits for user
export const getUserHabits = async (req, res) => {
  try {
    const habits = await pool.query(
      'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    const today = new Date().toISOString().split('T')[0];
    console.log('Checking completions for date:', today);
    
    // Check which habits are completed today
    const habitsWithStatus = await Promise.all(
      habits.rows.map(async (habit) => {
        const completed = await pool.query(
          'SELECT * FROM habit_logs WHERE habit_id = $1 AND user_id = $2 AND completed_at = $3',
          [habit.id, req.userId, today]
        );
        
        console.log(`Habit ${habit.name} - logs found:`, completed.rows.length);
        
        return {
          ...habit,
          completed_today: completed.rows.length > 0
        };
      })
    );

    console.log('Returning habits with status:', habitsWithStatus.map(h => ({ name: h.name, completed_today: h.completed_today })));
    res.json(habitsWithStatus);
  } catch (error) {
    console.error('Error getting habits:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single habit
export const getHabit = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nawyk nie znaleziony' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting habit:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create habit
export const createHabit = async (req, res) => {
  const { name, description, duration_minutes, icon, color } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO habits (user_id, name, description, duration_minutes, icon, color) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.userId, name, description, duration_minutes, icon || '📱', color || '#d60036']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update habit
export const updateHabit = async (req, res) => {
  const { id } = req.params;
  const { name, description, duration_minutes, icon, color } = req.body;
  try {
    const result = await pool.query(
      `UPDATE habits 
       SET name = $1, description = $2, duration_minutes = $3, icon = $4, color = $5
       WHERE id = $6 AND user_id = $7 RETURNING *`,
      [name, description, duration_minutes, icon, color, id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nawyk nie znaleziony' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete habit
export const deleteHabit = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nawyk nie znaleziony' });
    }
    res.json({ message: 'Nawyk usunięty', habit: result.rows[0] });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ error: error.message });
  }
};

// Log habit completion
export const logHabitCompletion = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  try {
    // Check if already completed today
    const today = new Date().toISOString().split('T')[0];
    const existing = await pool.query(
      'SELECT * FROM habit_logs WHERE habit_id = $1 AND user_id = $2 AND completed_at = $3',
      [id, req.userId, today]
    );

    if (existing.rows.length > 0) {
      return res.status(200).json({ 
        message: 'Nawyk już wykonany dzisiaj',
        log: existing.rows[0] 
      });
    }

    const result = await pool.query(
      `INSERT INTO habit_logs (habit_id, user_id, completed_at, notes) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [id, req.userId, today, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error logging habit:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get habit completion data for calendar
export const getHabitCalendar = async (req, res) => {
  const { id } = req.params;
  const { year, month } = req.query; // month is 0-indexed (0-11)
  
  try {
    // Get all completions for this habit in the specified month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, parseInt(month) + 1, 0);
    
    const logs = await pool.query(
      `SELECT completed_at 
       FROM habit_logs 
       WHERE habit_id = $1 AND user_id = $2
       AND completed_at >= $3 AND completed_at <= $4
       ORDER BY completed_at ASC`,
      [id, req.userId, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
    );
    
    // Also calculate streak
    const allLogs = await pool.query(
      `SELECT completed_at 
       FROM habit_logs 
       WHERE habit_id = $1 AND user_id = $2
       ORDER BY completed_at DESC`,
      [id, req.userId]
    );
    
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    
    if (allLogs.rows.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // Check if completed today or yesterday to start counting
      const lastCompletion = allLogs.rows[0].completed_at;
      if (lastCompletion === today || lastCompletion === yesterdayStr) {
        let checkDate = lastCompletion === today ? today : yesterdayStr;
        
        for (const log of allLogs.rows) {
          if (log.completed_at === checkDate) {
            currentStreak++;
            tempStreak++;
            
            // Move to previous day
            const prevDate = new Date(checkDate);
            prevDate.setDate(prevDate.getDate() - 1);
            checkDate = prevDate.toISOString().split('T')[0];
          } else {
            break;
          }
        }
      }
      
      // Calculate max streak
      tempStreak = 1;
      for (let i = 1; i < allLogs.rows.length; i++) {
        const current = new Date(allLogs.rows[i].completed_at);
        const previous = new Date(allLogs.rows[i-1].completed_at);
        const diffDays = Math.floor((previous - current) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
          maxStreak = Math.max(maxStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, tempStreak, currentStreak);
    }
    
    res.json({
      completions: logs.rows.map(log => log.completed_at),
      currentStreak,
      maxStreak
    });
  } catch (error) {
    console.error('Error getting habit calendar:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get habit streak
export const getHabitStreak = async (req, res) => {
  const { id } = req.params;
  try {
    const logs = await pool.query(
      `SELECT completed_at 
       FROM habit_logs 
       WHERE habit_id = $1 AND user_id = $2
       ORDER BY completed_at DESC`,
      [id, req.userId]
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Start checking from yesterday
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);

    // Check if completed today
    const completedToday = logs.rows.some(log => {
      const logDate = new Date(log.completed_at);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });

    // Count streak from yesterday backwards
    for (const log of logs.rows) {
      const logDate = new Date(log.completed_at);
      logDate.setHours(0, 0, 0, 0);
      
      if (logDate.getTime() === checkDate.getTime()) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    // Add today to streak if completed
    if (completedToday) {
      streak++;
    }

    res.json({ streak, habit_id: id });
  } catch (error) {
    console.error('Error getting streak:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all streaks for user
export const getAllStreaks = async (req, res) => {
  try {
    const habits = await pool.query(
      'SELECT id, name, icon, color FROM habits WHERE user_id = $1',
      [req.userId]
    );

    const streaksPromises = habits.rows.map(async (habit) => {
      const logs = await pool.query(
        `SELECT completed_at 
         FROM habit_logs 
         WHERE habit_id = $1 AND user_id = $2
         ORDER BY completed_at DESC`,
        [habit.id, req.userId]
      );

      let currentStreak = 0;
      
      if (logs.rows.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const lastCompletion = logs.rows[0].completed_at;
        
        if (lastCompletion === today || lastCompletion === yesterdayStr) {
          let checkDate = lastCompletion === today ? today : yesterdayStr;
          
          for (const log of logs.rows) {
            if (log.completed_at === checkDate) {
              currentStreak++;
              
              // Move to previous day
              const prevDate = new Date(checkDate);
              prevDate.setDate(prevDate.getDate() - 1);
              checkDate = prevDate.toISOString().split('T')[0];
            } else {
              break;
            }
          }
        }
      }
      
      const completedToday = logs.rows.length > 0 && 
                            logs.rows[0].completed_at === new Date().toISOString().split('T')[0];

      return {
        ...habit,
        streak: currentStreak,
        completed_today: completedToday
      };
    });

    const streaks = await Promise.all(streaksPromises);
    res.json(streaks);
  } catch (error) {
    console.error('Error getting streaks:', error);
    res.status(500).json({ error: error.message });
  }
};
