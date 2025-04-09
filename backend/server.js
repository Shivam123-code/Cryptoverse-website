import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import pgSession from 'connect-pg-simple'; // Correct import
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import watchlistRoutes from './routes/watchlist.js';
import postsRoutes from './routes/posts.js'; 
import adminRoutes from './routes/admin.js';
import snapshotRoutes from './routes/snapshots.js';


const { Pool } = pg;
const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

// 🛠 Enable JSON Parsing & CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,  // Allow cookies and headers like Authorization
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow the necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow the required headers
}));
    
app.use(express.json());
app.use('/admin', adminRoutes);
app.use(cookieParser()); 

// 🛠 PostgreSQL Database Connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cryptoverse",
  password: "Shivam@123",
  port: 5432,
});

// 🔥 Use connect-pg-simple after defining pool
const PgSession = pgSession(session); // Correct initialization

// 🛠 Session Middleware (MUST be before routes)
app.use(session({
  store: new PgSession({
    pool: pool,  // Use your PostgreSQL connection pool
    tableName: 'sessions' // Store sessions in PostgreSQL
  }),
  secret: '6b39b8c62b74e7187a07c0d857c07fb9fd4299442dd78ce29c2eb764d32a8ffdfe98435809c9d92a2557e723c4da262aa95c4e163a10a628aae967872cf72dee',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// 🛠 API routes
app.use('/api', watchlistRoutes);
app.use('/api/posts', postsRoutes);
app.use("/routes/watchlist", watchlistRoutes);
app.use('/api/snapshots', snapshotRoutes);


// ✅ Register Route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  console.log("🔹 Register request received:", { email, password });

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Hashed Password:", hashedPassword);

    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    console.log("✅ User registered successfully:", result.rows[0]);
    res.json({ user: result.rows[0] });

  } catch (error) {
    console.error("❌ Registration failed:", error);
    res.status(500).json({ error: 'Database error. Check logs.' });
  }
});

// ✅ Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("\n🔹 Received login request:", { email, password });

  try {
    const userResult = await pool.query('SELECT id, email, password_hash, is_admin FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      console.log("⚠️ No user found for email:", email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    console.log("📜 Retrieved user from DB:", user);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log("✅ Password Match:", isMatch);

    if (!isMatch) {
      console.log("⚠️ Invalid password");
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token


// ✅ Include is_admin in JWT
const token = jwt.sign(
  { id: user.id, email: user.email, isAdmin: user.is_admin },
  JWT_SECRET,
  { expiresIn: '1d' }
);

  

    console.log("✅ JWT Token Generated:", token);

    // ✅ Set cookie for session-based authentication
    res.cookie('token', token, {
      httpOnly: true, // Prevent access via JavaScript
      secure: false,  // Set to true in production with HTTPS
      sameSite: 'lax'
    });

    res.json({ token, user: { id: user.id, email: user.email } });

  } catch (error) {
    console.error("❌ Login failed:", error);
    res.status(500).json({ error: 'Server error' });
  }
 
});

    


// ✅ Middleware to Verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Forbidden: Invalid token" });
  
    req.user = {
      id: decoded.id,
      email: decoded.email,
      isAdmin: decoded.isAdmin || false,
    };
  
    next();
  });
  
};

// ✅ Authenticated Route to Get User Info
app.get('/user', authenticateToken, (req, res) => {
  console.log("🔹 Authenticated request by:", req.user);
  res.json(req.user);
});

// ✅ Start the server
app.listen(5000, () => {
  console.log('✅ Server running on port 5000');
});
