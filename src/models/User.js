// Import mongoose
import mongoose from "mongoose";

// Schema defines the structure of a user 
const userSchema = new mongoose.Schema(
  {
    // Full name
    name:{
      type: String,
      required: true,
      trim: true
    },

    // Email must be unique
    email: {
      type : String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    // Password will be hashed
    password: {
      type: String,
      required: true
    },

    // Role determines what user can do
    role: {
      type: String,
      enum: ['Player', 'Organizer', 'Venue Host', 'Admin'],
      default: 'Player'
    },
    
    // City where the user plays
    city: {
      type: String,
      default: ''
    },

    // Preferred Position - for players
    position: {
      type: String,
      default: ''
    },

    // Skill Level
    skillLevel: {
      type: String,
      enum:['Beginner', 'Intermediate', 'Advanced', ''],
      default:''
    },

    // Account Status
    status:{
      type: String,
      enum: ['Active', 'Suspended'],
      default:'Active'
    }
  },
    { 
      // Timestamps automatically adds createdAt 
      timestamps: true
    }
)

// Create the User Model from schema

const User = mongoose.model('User', userSchema)

export default User