import express from 'express'
import { protect } from '../middleware/authmiddleware.js'
import {
  getMyNotifications,
  markAllRead,
  markOneRead
} from '../controllers/notificationController.js'

const router = express.Router()

router.get('/', protect, getMyNotifications)
router.patch('/mark-all-read', protect, markAllRead)
router.patch('/:id/read', protect, markOneRead)

export default router