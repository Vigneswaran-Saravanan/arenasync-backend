import Venue from '../models/Venue.js'
import Match from '../models/Match.js'

// GET All Venues
// GET /api/venues

export async function getVenues(req, res) {
  try {

    // Get all active venues from database
    // populate('host') replaces the host ID with name and email
    const venues = await Venue.find({ isActive: true })
      .populate('host', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json({
      message: 'Venues fetched successfully',
      venues
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}

// GET One Venue
// GET /api/venues/:id

export async function getVenueById(req, res) {
  try {

    const venue = await Venue.findById(req.params.id)
      .populate('host', 'name email')

    if (!venue) {
      return res.status(404).json({
        message: 'Venue not found'
      })
    }

    // Find upcoming matches booked at this venue
    // Matches by venueId for accuracy, falls back to name match for older matches created before venueId existed
    const bookings = await Match.find({
      $or: [
        { venueId: venue._id },
        { venue: venue.name }
      ],
      status: 'Upcoming'
    })
      .populate('organizer', 'name email')
      .sort({ date: 1 })

    res.status(200).json({
      message: 'Venue fetched successfully',
      venue,
      bookings
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}

// Create Venue
// POST /api/venues

export async function createVenue(req, res) {
  try {

    const {
      name,
      address,
      fieldType,
      capacity,
      facilities
    } = req.body

    // Check required fields
    if (!name || !address || !capacity) {
      return res.status(400).json({
        message: 'Venue name, address and capacity are required'
      })
    }

    // Create the venue
    // req.user is set by the protect middleware
    const venue = await Venue.create({
      name,
      host: req.user._id,
      address,
      fieldType: fieldType || '',
      capacity,
      facilities: facilities || []
    })

    // Populate host details before sending back
    await venue.populate('host', 'name email')

    res.status(201).json({
      message: 'Venue created successfully',
      venue
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}

// Update Venue
// PUT /api/venues/:id

export async function updateVenue(req, res) {
  try {

    const venue = await Venue.findById(req.params.id)

    if (!venue) {
      return res.status(404).json({
        message: 'Venue not found'
      })
    }

    // Check if logged-in user is the host who owns this venue
    if (venue.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Only the venue host can edit this venue'
      })
    }

    // Update the fields
    const {
      name,
      address,
      fieldType,
      capacity,
      facilities
    } = req.body

    if (name) venue.name = name
    if (address) venue.address = address
    if (fieldType) venue.fieldType = fieldType
    if (capacity) venue.capacity = capacity
    if (facilities) venue.facilities = facilities

    // Save the updated venue
    await venue.save()

    res.status(200).json({
      message: 'Venue updated successfully',
      venue
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}

// Delete Venue
// DELETE /api/venues/:id

export async function deleteVenue(req, res) {
  try {

    const venue = await Venue.findById(req.params.id)

    if (!venue) {
      return res.status(404).json({
        message: 'Venue not found'
      })
    }

    // Check if logged-in user is the host or admin
    const isHost = venue.host.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'Admin'

    if (!isHost && !isAdmin) {
      return res.status(403).json({
        message: 'Not authorized to delete this venue'
      })
    }

    await Venue.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: 'Venue deleted successfully'
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}

// Get all venues the logged-in host has created
// GET /api/venues/my-venues

export async function getMyVenues(req, res) {
  try {

    // Find all venues where the host matches the logged-in user
    const venues = await Venue.find({ host: req.user._id })
      .sort({ createdAt: -1 })

    res.status(200).json({
      message: 'Your venues fetched successfully',
      venues
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error: ' + error.message
    })
  }
}