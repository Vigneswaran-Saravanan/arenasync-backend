import mongoose from 'mongoose'

// Each notification belongs to one user (the recipient)
const notificationSchema = new mongoose.Schema(
  {
    // The user who receives this notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    type: {
      type: String,
      enum: ['join_request', 'request_accepted', 'request_declined', 'match_cancelled'],
      required: true
    },

    // The message shown in the notification panel
    message: {
      type: String,
      required: true
    },

    // Used to link the notification to the right match
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      default: null
    },

    // The player who sent the join request
    // Only set on join_request notifications so the organizer
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // Whether the user has opened the notification panel since this arrived
    read: {
      type: Boolean,
      default: false
    }
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true
  }
)

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification