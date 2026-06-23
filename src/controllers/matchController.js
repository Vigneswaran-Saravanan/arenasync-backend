import Match from '../models/Match.js'
import Notification from '../models/Notification.js'


// Generates a random pin position within a safe visible range
function generateRandomPin() {
  const top = (Math.random() * 70 + 15).toFixed(1) + '%'
  const left = (Math.random() * 70 + 15).toFixed(1) + '%'
  return { top, left }
}

// GET All Matches
// GET /api/matches

export async function getMatches(req, res) {
  try {

    const matches = await Match.find({ status: 'Upcoming' })
      .populate('organizer', 'name email')
      .sort({ date: 1 })


    res.status(200).json({
      message: 'Matches fetched successfully',
      matches
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}

// GET One Match
// GET /api/matches/:id

export async function getMatchById(req, res) {
  try {

    const match = await Match.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('players.user', 'name email skillLevel')

    if (!match) {
      return res.status(404).json({
        message: 'Match not found'
      })
    }

    res.status(200).json({
      message: 'Match fetched successfully',
      match
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}

// Create Match
// POST /api/matches

export async function createMatch(req, res) {
  try {


    const {
      title,
      venue,
      venueId,
      address,
      date,
      time,
      skillLevel,
      maxPlayers,
      description,
      pin
    } = req.body

    // Check required fields
    if (!title || !venue || !address || !date || !time || !skillLevel || !maxPlayers) {
      return res.status(400).json({
        message: 'Title, venue, address, date, time, skill level and max players are required'
      })
    }

    // Create the match
    const match = await Match.create({
      title,
      organizer: req.user._id,
      venue,
      venueId: venueId || null,
      address,
      date,
      time,
      skillLevel,
      maxPlayers,
      description: description || '',
      pin: pin || generateRandomPin()
    })

    await match.populate('organizer', 'name email')

    res.status(201).json({
      message: 'Match created successfully',
      match
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}

// Update Match
// PUT /api/matches/:id

export async function updateMatch(req, res) {
  try {

    const match = await Match.findById(req.params.id)

    if (!match) {
      return res.status(404).json({
        message: 'Match not found'
      })
    }

    if (match.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Only the organizer can edit this match'
      })
    }

    // Update the fields
    const {
      title,
      venue,
      address,
      date,
      time,
      skillLevel,
      maxPlayers,
      description,
      status
    } = req.body

    if (title) match.title = title
    if (venue) match.venue = venue
    if (address) match.address = address
    if (date) match.date = date
    if (time) match.time = time
    if (skillLevel) match.skillLevel = skillLevel
    if (maxPlayers) match.maxPlayers = maxPlayers
    if (description) match.description = description
    if (status) match.status = status

    // Save the updated match
    await match.save()

    res.status(200).json({
      message: 'Match updated successfully',
      match
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}

// Delete Match
// DELETE /api/matches/:id
// Only the organizer or admin can delete
export async function deleteMatch(req, res) {
  try {

    const match = await Match.findById(req.params.id)

    if (!match) {
      return res.status(404).json({
        message: 'Match not found'
      })
    }

    const isOrganizer = match.organizer.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'Admin'

    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({
        message: 'Not authorized to delete this match'
      })
    }

    // Notify all confirmed players that the match has been cancelled
    const confirmedPlayers = match.players.filter(function (p) {
      return p.status === 'confirmed'
    })

    for (const player of confirmedPlayers) {
      await Notification.create({
        recipient: player.user,
        type: 'match_cancelled',
        message: match.title + ' has been cancelled',
        matchId: match._id,
        senderId: req.user._id
      })
    }

    await Match.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: 'Match deleted successfully'
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}

// Join Match
// POST /api/matches/:id/join

export async function joinMatch(req, res) {
  try {
    const match = await Match.findById(req.params.id)

    if (!match) {
      return res.status(404).json({ message: 'Match not found' })
    }

    if (match.status !== 'Upcoming') {
      return res.status(400).json({ message: 'This match is no longer accepting requests' })
    }

    const alreadyJoined = match.players.find(function (p) {
      return p.user.toString() === req.user._id.toString()
    })

    if (alreadyJoined) {
      return res.status(400).json({ message: ' You have already requested to join this match' })
    }

    // Check if the match if full
    const confirmedCount = match.players.filter(function (p) {
      return p.status === 'confirmed'
    }).length

    if (confirmedCount >= match.maxPlayers) {
      return res.status(400).json({ message: 'This match is full' })
    }

    match.players.push({
      user: req.user._id,
      status: 'pending'
    })

    await match.save()

    // Notify the organizer that a player wants to join
    await Notification.create({
      recipient: match.organizer,
      type: 'join_request',
      message: req.user.name + ' wants to join ' + match.title,
      matchId: match._id,
      senderId: req.user._id
    })

    res.status(200).json({
      message: 'Join request sent successfully',
      status: 'pending'
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// Confirm player
// PUT /api/matches/:id/players/:userId

export async function confirmPlayer(req, res) {

  try {

    const match = await Match.findById(req.params.id)

    if (!match) {
      return res.status(404).json({ message: 'Match not found' })
    }

    if (match.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the organizer can accept or decline players' })
    }

    const playerEntry = match.players.find(function (p) {
      return p.user.toString() === req.params.userId
    })

    if (!playerEntry) {
      return res.status(404).json({ message: 'Player not found in this match' })
    }

    // action should be 'confirmed' or 'declined'
    const { action } = req.body

    if (!action || !['confirmed', 'declined'].includes(action)) {
      return res.status(400).json({ message: 'Action must be confirmed or declined' })
    }

    // Update the player status
    playerEntry.status = action

    await match.save()

    // Notify the player whether they were accepted or declined
    await Notification.create({
      recipient: playerEntry.user,
      type: action === 'confirmed' ? 'request_accepted' : 'request_declined',
      message: action === 'confirmed'
        ? 'Your request to join ' + match.title + ' was accepted'
        : 'Your request to join ' + match.title + ' was declined',
      matchId: match._id,
      senderId: req.user._id
    })

    res.status(200).json({
      message: 'Player ' + action + ' successfully',
      status: action
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// Leave match
// DELETE /api/matches/:id/leave

export async function leaveMatch(req, res) {
  try {

    const match = await Match.findById(req.params.id)

    if (!match) {
      return res.status(404).json({ message: 'Match not found' })
    }

    // Check if player is in this match
    const playerIndex = match.players.findIndex(function (p) {
      return p.user.toString() === req.user._id.toString()
    })

    if (playerIndex === -1) {
      return res.status(400).json({ message: 'You are not in this match' })
    }

    // Remove the player from the array
    match.players.splice(playerIndex, 1)

    await match.save()

    res.status(200).json({
      message: 'You have left the match successfully'
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// Get all matches the logged-in player has joined 
// GET /api/matches/my-matches

export async function getMyMatches(req, res) {
  try {

    // Find all matches where this user appears in the players array
    const matches = await Match.find({ 'players.user': req.user._id })
      .populate('organizer', 'name email')
      .sort({ date: 1 })

    res.status(200).json({
      message: 'Your matches fetched successfully',
      matches
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}

// Mark player attendance after a match is completed
// PATCH /api/matches/:id/attendance

export async function markAttendance(req, res) {
  try {
    const match = await Match.findById(req.params.id)

    if (!match) {
      return res.status(404).json({ message: 'Match not found' })
    }

    if (match.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the organizer can mark attendance' })
    }

    if (match.status !== 'Completed') {
      return res.status(400).json({ message: 'Attendance can only be marked for completed matches' })
    }

    const { attendedPlayerIds } = req.body

    if (!Array.isArray(attendedPlayerIds)) {
      return res.status(400).json({ message: 'attendedPlayerIds must be an array' })
    }

    match.players.forEach(function (playerEntry) {
      if (playerEntry.status === 'confirmed') {
        playerEntry.attended = attendedPlayerIds.includes(playerEntry.user.toString())
      }
    })

    await match.save()

    const User = (await import('../models/User.js')).default

    for (const playerEntry of match.players) {
      if (playerEntry.status !== 'confirmed') continue

      // Find all matches this player was confirmed in
      const allMatches = await Match.find({
        'players.user': playerEntry.user,
        'players.status': 'confirmed',
        status: 'Completed'
      })

      // Count how many they actually attended
      let totalConfirmed = 0
      let totalAttended = 0

      for (const m of allMatches) {
        const entry = m.players.find(function (p) {
          return p.user.toString() === playerEntry.user.toString()
        })
        if (entry && entry.status === 'confirmed') {
          totalConfirmed++
          if (entry.attended) totalAttended++
        }
      }

      // Calculate percentage and save to User document
      const rate = totalConfirmed > 0
        ? Math.round((totalAttended / totalConfirmed) * 100)
        : 0

      await User.findByIdAndUpdate(playerEntry.user, { attendanceRate: rate })
    }

    res.status(200).json({ message: 'Attendance marked successfully' })

  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// GET all matches created by the logged-in organizer (all statuses)
// GET /api/matches/my-created
export async function getMyCreatedMatches(req, res) {
  try {
    const matches = await Match.find({ organizer: req.user._id })
      .populate('organizer', 'name email')
      .populate('players.user', 'name email')
      .sort({ date: 1 })

    res.status(200).json({
      message: 'Your created matches fetched successfully',
      matches
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}