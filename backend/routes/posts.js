// In backend/routes/posts.js
import express from 'express';

const router = express.Router();

// Dummy posts data (replace with database logic later)
let posts = [];

// Define your CRUD operations...
router.get('/', (req, res) => {
  res.json(posts);
});

router.post('/', (req, res) => {
  const newPost = { id: Date.now().toString(), ...req.body };
  posts.push(newPost);
  res.status(201).json(newPost);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) return res.status(404).json({ message: 'Post not found' });

  posts[index] = { ...posts[index], ...req.body };
  res.json(posts[index]);
});

router.delete('/:id', (req, res) => {
  posts = posts.filter((post) => post.id !== req.params.id);
  res.json({ message: 'Post deleted' });
});

// Export the router for general usage
export default router;
