import { Router } from 'express'
import {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} from '../controllers/matchController.js'
import { protect, requireRole } from '../middleware/authmiddleware.js'

const router = Router()

// GET /api/matches — get all matches 
router.get('/', getMatches)

// GET /api/matches/:id — get one match 
router.get('/:id', getMatchById)

// POST /api/matches — create match 
router.post('/', protect, requireRole('Organizer'), createMatch)

// PUT /api/matches/:id — update match 
router.put('/:id', protect, requireRole('Organizer'), updateMatch)

// DELETE /api/matches/:id — delete match 
router.delete('/:id', protect, deleteMatch)

export default router