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
