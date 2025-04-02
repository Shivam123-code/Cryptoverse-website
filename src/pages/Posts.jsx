import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { MessageSquare, Plus, Trash2, AlertCircle, Loader2, Edit } from 'lucide-react';

import { getPosts, createPost, updatePost, deletePost } from '../services/posts.js';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchPosts();
  }, [user, navigate]);

  const fetchPosts = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdatePost = async (e) => {
    e.preventDefault();

    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setError(null);
      setIsCreating(true);

      if (editingPost) {
        const updatedPost = await updatePost(editingPost.id, newPost);
        setPosts(prevPosts => prevPosts.map(post => (post.id === editingPost.id ? updatedPost : post)));
        setEditingPost(null);
      } else {
        const post = await createPost({ ...newPost, user_id: user.id });
        setPosts(prevPosts => [post, ...prevPosts]);
      }

      setNewPost({ title: '', content: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({ title: post.title, content: post.content });
    setShowForm(true);
  };

  const handleDeletePost = async (id) => {
    try {
      setError(null);
      await deletePost(id);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community Posts</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setNewPost({ title: '', content: '' });
            setEditingPost(null);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{editingPost ? 'Edit Post' : 'New Post'}</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2 text-red-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {showForm && (
        <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
          <form onSubmit={handleCreateOrUpdatePost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-800 text-white rounded-lg">Cancel</button>
              <button type="submit" disabled={isCreating} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                {isCreating ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold">{post.title}</h3>
              {user && post.user_id === user.id && (
                <div className="flex space-x-2">
                  <button onClick={() => handleEditPost(post)} className="text-blue-500"><Edit /></button>
                  <button onClick={() => handleDeletePost(post.id)} className="text-red-500"><Trash2 /></button>
                </div>
              )}
            </div>
            <p className="text-gray-400 mt-2">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
