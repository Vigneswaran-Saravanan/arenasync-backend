import User from '../models/User.js'

// GET all users - admin only
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// UPDATE a user's role and/or status - admin only
// Lets the admin promote/demote a role, or suspend/reactivate an account
export async function updateUser(req, res) {
  try {
    const { role, status } = req.body

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (role) user.role = role
    if (status) user.status = status

    await user.save()

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// DELETE a user - admin only
export async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await user.deleteOne()

    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}