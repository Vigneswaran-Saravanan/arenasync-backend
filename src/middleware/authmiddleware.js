import jwt from 'jsonwebtoken';

// PROTECT 


export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); 
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// ADMIN ONLY
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// ORGANIZER ONLY
export const organizerOnly = (req, res, next) => {
  if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Organizers only.' });
  }
  next();
};

// VENUE HOST ONLY

export const venueHostOnly = (req, res, next) => {
  if (req.user.role !== 'venue_host' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Venue hosts only.' });
  }
  next();
};