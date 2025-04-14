import dotenv from 'dotenv';
dotenv.config();

export const isAdmin = (req, res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (req.user && req.user.email === adminEmail) {
    next(); // authorized
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};
