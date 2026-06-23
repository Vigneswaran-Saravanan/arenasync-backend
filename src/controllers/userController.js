import User from '../models/User.js'
import Match from '../models/Match.js'

// GET logged-in user's profile
// GET /api/users/profile
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// UPDATE logged-in user's profile
// PUT /api/users/profile
export async function updateProfile(req, res) {
  try {
    const { position, skillLevel, city } = req.body

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Only update fields that were actually sent
    if (position !== undefined) user.position = position
    if (skillLevel !== undefined) user.skillLevel = skillLevel
    if (city !== undefined) user.city = city

    await user.save()

    // Send back the updated user without the password
    const updatedUser = await User.findById(req.user._id).select('-password')
    res.json(updatedUser)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}