import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js'
import venueRoutes from './src/routes/venueRoutes.js'
import adminRoutes from './src/routes/adminRoutes.js'
import notificationRoutes from './src/routes/notificationRoutes.js'
import userRoutes from './src/routes/userRoutes.js'

// Load environment variables from .env file
dotenv.config();

const app = express();
// Connect to MongoDB
connectDB();

// Middleware — allows the server to read JSON from requests
// Parse incoming JSON request bodies
app.use(express.json());

// Middleware — allows requests from React frontend (localhost:5173)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://arenasync-soccer.vercel.app'
  ],
  credentials: true
}))

// Routes — all auth routes start with /api/auth
app.use('/api/auth', authRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/venues', venueRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/users', userRoutes)

// A simple test route — visit http://localhost:5000 in browser
app.get('/', (req, res) => {
  res.json({ message: 'ArenaSync API is running' })
})

// Get port from .env file, default to 5000
const PORT = process.env.PORT || 5000

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})


