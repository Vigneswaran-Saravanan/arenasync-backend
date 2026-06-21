import express from 'express'
import { protect, requireRole } from '../middleware/authmiddleware.js'
import { getAllUsers, updateUser, deleteUser } from '../controllers/adminController.js'

const router = express.Router()

// Every route here requires a valid token AND the Admin role
router.get('/users', protect, requireRole('Admin'), getAllUsers)
router.put('/users/:id', protect, requireRole('Admin'), updateUser)
router.delete('/users/:id', protect, requireRole('Admin'), deleteUser)

export default router