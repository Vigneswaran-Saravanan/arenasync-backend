import Match from '../models/Match.js'
// Tested: join, confirm player and leave match all working

// GET All Matches
// GET /api/matches

export async function getMatches(req, res) {
  try {

    // Get all matches from database
    // populate('organizer') replaces the organizer ID
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
    // req.user is set by the protect middleware
    const match = await Match.create({
      title,
      organizer: req.user._id,
      venue,
      address,
      date,
      time,
      skillLevel,
      maxPlayers,
      description: description || '',
      pin: pin || { top: '50%', left: '50%' }
    })

    // Populate organizer details before sending back
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

    // Check if logged-in user is the organizer
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

    // Check if logged-in user is organizer or admin
    const isOrganizer = match.organizer.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'Admin'

    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({
        message: 'Not authorized to delete this match'
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

    // Check if match is still open
    if (match.status !== 'Upcoming') {
      return res.status(400).json({ message: 'This match is no longer accepting requests' })
    }

    // Check if the player already requested or confirmed
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

    // Add players with pending status
    match.players.push({
      user: req.user._id,
      status: 'pending'
    })

    await match.save()

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

    // Check if logged in user is the organizer
    if (match.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the organizer can accept or decline players' })
    }

    // Find the player in the players array
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
    const playerIndex = match.players.findIndex(function(p) {
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