import mongoose from 'mongoose'

// Each player in the match has a status
// pending = requested, confirmed = accepted, declined = rejected
const playerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'declined'],
    default: 'pending'
  },
  attended: {
    type: Boolean,
    default: false
  }
})

// Main match schema
const matchSchema = new mongoose.Schema(
  {
    // Match title 
    title: {
      type: String,
      required: true,
      trim: true
    },

    // The organizer who created this match
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Venue details
    venue: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    // Match date and time
    date: {
      type: Date,
      required: true
    },

    time: {
      type: String,
      required: true
    },

    // Skill level required
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },

    // Maximum number of players allowed
    maxPlayers: {
      type: Number,
      required: true,
      min: 2,
      max: 22
    },

    // List of players who requested or confirmed
    players: [playerSchema],

    // Match status
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming'
    },

    // Optional notes from organizer
    description: {
      type: String,
      default: ''
    },

    // Weather info — stored when match is created
    weather: {
      temp: { type: String, default: '' },
      condition: { type: String, default: '' }
    },

    // Map pin position for the home page map
    pin: {
      top: { type: String, default: '50%' },
      left: { type: String, default: '50%' }
    }
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true
  }
)

const Match = mongoose.model('Match', matchSchema)

export default Match