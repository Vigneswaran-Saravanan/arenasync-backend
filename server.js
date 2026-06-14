import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js'

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
  origin: 'http://localhost:5173',
  credentials: true
}))

// Routes — all auth routes start with /api/auth
// So signup will be at /api/auth/register and login /api/auth/login
app.use('/api/auth', authRoutes)
app.use('/api/matches', matchRoutes)

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


