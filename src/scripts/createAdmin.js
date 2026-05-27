// Creates the admin account directly in MongoDB
// Run with: npm run create-admin

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL
    });

    if (existingAdmin) {
      console.log('Admin already exists — no action taken.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      salt
    );

    // Create admin — role is hardcoded here, never from a form
    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    });

    console.log('Admin created successfully!');
    console.log(`Name:  ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role:  ${admin.role}`);
    console.log('You can now log in at http://localhost:3000/login');

    // Close connection and exit cleanly
    process.exit(0);

  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();