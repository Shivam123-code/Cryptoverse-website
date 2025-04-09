// // middleware/auth.js
// import jwt from 'jsonwebtoken';

// export const authenticateUser = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader?.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Include isAdmin for admin-only routes
//     req.user = { userId: decoded.id || decoded.userId,

//       isAdmin: decoded.isAdmin || false,
//     };

//     next();
//   } catch (err) {
//     console.error('JWT verification failed:', err.message);
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// };y

import jwt from 'jsonwebtoken';

// Your user authentication middleware
export const authenticateUser = (req, res, next) => {
  // ... your existing logic here
};

// ✅ Token authentication middleware for general user routes
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(403).json({ error: 'Invalid token' });
  }
};

