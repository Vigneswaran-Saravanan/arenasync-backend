// Import bcryptjs for hashing passwords
import bcrypt from 'bcryptjs'

// Import jsonwebtoken - for login 
import jwt from 'jsonwebtoken'

// Import the User model
import User from "../models/User.js"

// Register
// POST /api/auth/register
export async function register ( req, res){

  try{
    // Get the data sent from the frontend form
    const { name, email, password, role, city, position, skillLevel} = req.body

    // Check all required fields
    if (!name || !email || !password || !role){
      return res.status(400).json({
        message: 'Name, email, password and role are required'
      })
    }

    // Check if the user with this email already exists
    const existingUser = await User.findOne({email})
    if(existingUser){
      return res.status(400).json({
        message: 'An account with this email already exists'
      })
  }
 
   // Hash the password before saving
   // The 10 means strong standard
   const hashedPassword = await bcrypt.hash(password, 10)

   // Create the new user in the database
   const user = await User.create({
    name,
    email,
    password : hashedPassword,
    role,
    city: city || '',
    position: position || '',
    skillLevel: skillLevel || ''
   })

  // Create a JWT token for the user
  // This token proves they are logged in 
  const token = jwt.sign(
  {
    id : user._id,
    role: user.role
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d'}
)

// Send back the token and user info
res.status(201).json({
  message: 'Account created successfully',
  token,
  user:{
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.city,
    city: user.position,
    skillLevel: user.skillLevel

  }
})
  }
  catch (error){
    res.status(500).json({
      message: 'Server error:' + error.message
    })
  }
}

// Login
// POST /api/auth/login
export async function login(req, res){
  
  try{
    // Get email and password
    const {email, password} = req.body

    // Check both fields
    if (!email || !password){
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }
  
    // Find the user by email in the database
    const user = await User.findOne({email})
    
    if(!user){
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }
    
    // Check if account is suspended
    if(user.status === "Suspended"){
      return res.status(403).json({
        message: 'Your account has been suspended'
      })
    }

    // Compare the entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }
    
    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Send back token and user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        position: user.position,
        skillLevel: user.skillLevel
      }
    })

  } catch(error){
    res.status(500).json({
      message: 'Server error' + error.message
    })
  }
}
