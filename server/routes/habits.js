import express from 'express';
import { authMiddleware } from '../controllers/authController.js';
import {
  getUserHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  logHabitCompletion,
  getHabitStreak,
  getAllStreaks,
  getHabitCalendar
} from '../controllers/habitsController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getUserHabits);
router.get('/streaks', getAllStreaks);
router.get('/:id/calendar', getHabitCalendar);
router.get('/:id/streak', getHabitStreak);
router.get('/:id', getHabit);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/complete', logHabitCompletion);

export default router;
