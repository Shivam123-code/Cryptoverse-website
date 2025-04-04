import express from 'express';
import { pool } from '../db.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// ✅ Get all posts (with user info)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');

    if (!rows || rows.length === 0) {
      return res.json([]); // ✅ Return an empty array instead of undefined
    }

    res.json(rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Create a new post (Only logged-in users)
router.post('/', authenticateUser, async (req, res) => {
  const { title, content } = req.body;
  const user_id = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, user_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update a post (Only the owner can update)
router.put('/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const user_id = req.user.id;

  try {
    const { rows } = await pool.query('SELECT user_id FROM posts WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Post not found' });

    if (rows[0].user_id !== user_id) {
      return res.status(403).json({ message: 'You are not authorized to edit this post' });
    }

    const updatedPost = await pool.query(
      'UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    res.json(updatedPost.rows[0]);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete a post (Only the owner can delete)
router.delete('/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const { rows } = await pool.query('SELECT user_id FROM posts WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Post not found' });

    if (rows[0].user_id !== user_id) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
