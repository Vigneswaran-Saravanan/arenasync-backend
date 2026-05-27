import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();
// Connect to MongoDB
connectDB();

// Parse incoming JSON request bodies
app.use(express.json());

// Allow React frontend (port 3000) to talk to this backend (port 5000)
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Mount auth routes — all prefixed with /api/auth
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});