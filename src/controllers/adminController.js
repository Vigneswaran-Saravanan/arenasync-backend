import User from '../models/User.js'
import Match from '../models/Match.js'
import Venue from '../models/Venue.js'

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


// GET all matches - admin only
export async function getAllMatches(req, res) {
    try {
        const matches = await Match.find()
            .populate('organizer', 'name email')
            .sort({ date: -1 })
        res.json(matches)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// UPDATE a match's status - admin only
export async function updateMatchStatus(req, res) {
    try {
        const { status } = req.body

        const match = await Match.findById(req.params.id)

        if (!match) {
            return res.status(404).json({ message: 'Match not found' })
        }

        match.status = status
        await match.save()

        res.json(match)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// DELETE a match - admin only
export async function deleteMatch(req, res) {
    try {
        const match = await Match.findById(req.params.id)

        if (!match) {
            return res.status(404).json({ message: 'Match not found' })
        }

        await match.deleteOne()

        res.json({ message: 'Match deleted' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// GET all venues - admin only
export async function getAllVenues(req, res) {
    try {
        const venues = await Venue.find()
            .populate('host', 'name email')
            .sort({ createdAt: -1 })
        res.json(venues)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

// DELETE a venue - admin only
export async function deleteVenue(req, res) {
    try {
        const venue = await Venue.findById(req.params.id)

        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' })
        }

        await venue.deleteOne()

        res.json({ message: 'Venue deleted' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}