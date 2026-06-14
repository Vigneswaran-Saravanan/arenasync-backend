import Match from '../models/Match.js'

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