import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['player', 'organizer', 'venue_host', 'admin'],
    default: 'player',
  },
  city: {
    type: String,
    default: '',
  },
  position: {
    type: String,
    default: '',
  },
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  attendanceRate: {
    type: Number,
    default: 100,
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active',
  },
}, {
  timestamps: true,
});

export default mongoose.model('User', UserSchema);