import { Router } from 'express'
import {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  joinMatch,
  confirmPlayer,
  leaveMatch,
  getMyMatches,
  markAttendance,
  getMyCreatedMatches

} from '../controllers/matchController.js'
import { protect, requireRole } from '../middleware/authmiddleware.js'

const router = Router()

// GET /api/matches — get all matches 
router.get('/', getMatches)

// GET /api/matches/my-matches — get all matches the logged-in player joined
router.get('/my-matches', protect, getMyMatches)

// GET /api/matches/:id — get one match 
router.get('/:id', getMatchById)

// POST /api/matches — create match 
router.post('/', protect, requireRole('Organizer'), createMatch)

// PUT /api/matches/:id — update match 
router.put('/:id', protect, requireRole('Organizer'), updateMatch)

// DELETE /api/matches/:id — delete match 
router.delete('/:id', protect, deleteMatch)

// POST /api/matches/:id/join — player joins match 
router.post('/:id/join', protect, requireRole('Player'), joinMatch)

// PUT /api/matches/:id/players/:userId — organizer confirms or declines player
router.put('/:id/players/:userId', protect, requireRole('Organizer'), confirmPlayer)

// DELETE /api/matches/:id/leave — player leaves match
router.delete('/:id/leave', protect, requireRole('Player'), leaveMatch)

// PATCH /api/matches/:id/attendance — organizer marks who attended
router.patch('/:id/attendance', protect, requireRole('Organizer'), markAttendance)

// GET /api/matches/my-created — get all matches the organizer created
router.get('/my-created', protect, requireRole('Organizer'), getMyCreatedMatches)

export default router