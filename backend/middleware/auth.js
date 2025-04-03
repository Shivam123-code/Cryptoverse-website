import jwt from 'jsonwebtoken';

const JWT_SECRET = "6b39b8c62b74e7187a07c0d857c07fb9fd4299442dd78ce29c2eb764d32a8ffdfe98435809c9d92a2557e723c4da262aa95c4e163a10a628aae967872cf72dee";

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    req.user = user; // Attach user data to request
    next();
  });
};

// Middleware to check session authentication
export const authenticateUser = (req, res, next) => {
  console.log("Session Data:", req.session);

  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  req.user = req.session.user;
  next();
};
