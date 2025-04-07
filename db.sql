
-- db.sql

-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- WATCHLIST TABLE
CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    -- Add specific fields you want to track in the watchlist
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




















SELECT column_name
FROM information_schema.columns
WHERE table_name = 'users';
ALTER TABLE users ADD COLUMN username VARCHAR(255) UNIQUE;

SELECT * FROM posts;

SELECT posts.*, users.username
FROM posts
LEFT JOIN users ON posts.user_id = users.id;

SELECT * FROM posts WHERE user_id NOT IN (SELECT id FROM users);


INSERT INTO posts (title, content, user_id, created_at) 
VALUES ('Test Post', 'This is a test post.', 1, NOW());

DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS user_sessions;


-- Step 1: Check users
SELECT * FROM users;

-- Step 2: Insert again (only if user_id exists!)
INSERT INTO posts (title, content, user_id, created_at) 
VALUES ('Test Post', 'This is a test post.', 3, NOW());

-- Step 3: Commit (if needed)
COMMIT;

-- Step 4: View inserted post
SELECT * FROM posts;
