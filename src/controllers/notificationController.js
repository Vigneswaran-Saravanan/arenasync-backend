import Notification from '../models/Notification.js'

// GET all notifications for the logged-in user
// GET /api/notifications
export async function getMyNotifications(req, res) {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)

    res.json(notifications)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// MARK ALL notifications as read for the logged-in user
// PATCH /api/notifications/mark-all-read
export async function markAllRead(req, res) {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    )

    res.json({ message: 'All notifications marked as read' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// MARK ONE notification as read
// PATCH /api/notifications/:id/read
export async function markOneRead(req, res) {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    notification.read = true
    await notification.save()

    res.json({ message: 'Notification marked as read' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// DELETE a single notification
// DELETE /api/notifications/:id
export async function deleteNotification(req, res) {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await notification.deleteOne()

    res.json({ message: 'Notification deleted' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}