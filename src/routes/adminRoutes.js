import express from 'express'
import { protect, requireRole } from '../middleware/authmiddleware.js'
import { getAllUsers, updateUser, deleteUser,
         getAllMatches, updateMatchStatus, deleteMatch,
         getAllVenues, deleteVenue
    } from '../controllers/adminController.js'

const router = express.Router()


router.get('/users', protect, requireRole('Admin'), getAllUsers)
router.put('/users/:id', protect, requireRole('Admin'), updateUser)
router.delete('/users/:id', protect, requireRole('Admin'), deleteUser)

router.get('/matches', protect, requireRole('Admin'), getAllMatches)
router.patch('/matches/:id', protect, requireRole('Admin'), updateMatchStatus)
router.delete('/matches/:id', protect, requireRole('Admin'), deleteMatch)

router.get('/venues', protect, requireRole('Admin'), getAllVenues)
router.delete('/venues/:id', protect, requireRole('Admin'), deleteVenue)

export default router