import express from 'express'
import { protect, requireRole } from '../middleware/authmiddleware.js'
import { getAllUsers, updateUser, deleteUser,
         getAllMatches, updateMatchStatus, deleteMatch
    } from '../controllers/adminController.js'

const router = express.Router()


router.get('/users', protect, requireRole('Admin'), getAllUsers)
router.put('/users/:id', protect, requireRole('Admin'), updateUser)
router.delete('/users/:id', protect, requireRole('Admin'), deleteUser)

router.get('/matches', protect, requireRole('Admin'), getAllMatches)
router.patch('/matches/:id', protect, requireRole('Admin'), updateMatchStatus)
router.delete('/matches/:id', protect, requireRole('Admin'), deleteMatch)

export default router