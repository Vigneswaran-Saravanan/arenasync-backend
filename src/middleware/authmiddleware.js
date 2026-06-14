import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// PROTECT MIDDLEWARE 
// Checks if the user has a valid JWT token

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    // If no token is provided, block the request
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Not authorized. No token provided.'
      })
    }

    // Extract just the token part after "Bearer "
    const token = authHeader.split(' ')[1]

    // Verify the token using the JWT secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find the full user from database using id stored in token
    const user = await User.findById(decoded.id).select('-password')

    // If user no longer exists in database, block the request
    if (!user) {
      return res.status(401).json({
        message: 'Not authorized. User not found.'
      })
    }

    // If user account is suspended, block the request
    if (user.status === 'Suspended') {
      return res.status(403).json({
        message: 'Your account has been suspended.'
      })
    }

    // Attach the full user object to the request
    req.user = user

    // Move to the next middleware or route handler
    next()

  } catch (error) {
    return res.status(401).json({
      message: 'Not authorized. Invalid token.'
    })
  }
}

// REQUIRE ROLE MIDDLEWARE 
// Checks if the logged in user has the required role

export function requireRole(...roles) {
  return function(req, res, next) {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. You do not have permission.'
      })
    }

    next()
  }
}