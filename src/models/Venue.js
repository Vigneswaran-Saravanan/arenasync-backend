import mongoose from 'mongoose'

// Main venue schema
const venueSchema = new mongoose.Schema(
  {
    // Venue name
    name: {
      type: String,
      required: true,
      trim: true
    },

    // The venue host who created this listing
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Venue address
    address: {
      type: String,
      required: true,
      trim: true
    },

    // Field type — natural grass, artificial turf, etc.
    fieldType: {
      type: String,
      default: ''
    },

    // Maximum capacity in number of players
    capacity: {
      type: Number,
      required: true,
      min: 2,
      max: 30
    },

    // Optional photo URL
    photoUrl: {
      type: String,
      default: ''
    },

    // List of facilities — floodlights, parking, etc.
    facilities: {
      type: [String],
      default: []
    },

    // Whether this listing is active and visible to organizers
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true
  }
)

const Venue = mongoose.model('Venue', venueSchema)

export default Venue