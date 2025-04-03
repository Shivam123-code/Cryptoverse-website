import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log("DB_PASSWORD:", process.env.DB_PASSWORD); // Debugging

const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "cryptoverse",
    password: "Shivam@123", // Hardcoded for debugging
    port: 5432,
  });
  

export { pool };
