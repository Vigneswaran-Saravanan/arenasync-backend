import { Router } from 'express'
import {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  getMyVenues
} from '../controllers/venueController.js'
import { protect, requireRole } from '../middleware/authmiddleware.js'

const router = Router()

// GET /api/venues — get all venues
router.get('/', getVenues)

// GET /api/venues/my-venues — get all venues the logged-in host created
router.get('/my-venues', protect, requireRole('Venue Host'), getMyVenues)

// GET /api/venues/:id — get one venue
router.get('/:id', getVenueById)

// POST /api/venues — create venue
router.post('/', protect, requireRole('Venue Host'), createVenue)

// PUT /api/venues/:id — update venue
router.put('/:id', protect, requireRole('Venue Host'), updateVenue)

// DELETE /api/venues/:id — delete venue
router.delete('/:id', protect, deleteVenue)

export default router