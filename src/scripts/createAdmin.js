import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'


dotenv.config()

async function createAdmin() {

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: process.env.ADMIN_EMAIL 
    })

    if (existingAdmin) {
      console.log('Admin account already exists:', process.env.ADMIN_EMAIL)
      process.exit(0)
    }

    // Hash the admin password from .env
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

    // Create the admin user
    const admin = await User.create({
      name: 'ArenaSync Admin',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'Admin',
      status: 'Active'
    })

    console.log('Admin account created successfully!')
    console.log('Email:', admin.email)
    console.log('Role:', admin.role)
    console.log('You can now login at /login with your admin credentials')

    process.exit(0)

  } catch (error) {
    console.log('Error creating admin:', error.message)
    process.exit(1)
  }
}

// Run the function
createAdmin()