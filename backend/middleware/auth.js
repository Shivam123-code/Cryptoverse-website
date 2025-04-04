import jwt from 'jsonwebtoken';

const JWT_SECRET = "6b39b8c62b74e7187a07c0d857c07fb9fd4299442dd78ce29c2eb764d32a8ffdfe98435809c9d92a2557e723c4da262aa95c4e163a10a628aae967872cf72dee";

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: Invalid token format' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });

    req.user = user;
    next();
  });
};

export default authenticateToken;

// Middleware to check session authentication
 export const authenticateUser = (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = req.session.user; // ✅ Attach user to request
    next();
  };
  
  