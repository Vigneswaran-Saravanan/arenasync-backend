import express from 'express'
import { protect } from '../middleware/authmiddleware.js'
import {
  getMyNotifications,
  markAllRead,
  markOneRead,
  deleteNotification
} from '../controllers/notificationController.js'

const router = express.Router()

router.get('/', protect, getMyNotifications)
router.patch('/mark-all-read', protect, markAllRead)
router.patch('/:id/read', protect, markOneRead)
router.delete('/:id', protect, deleteNotification)

export default router