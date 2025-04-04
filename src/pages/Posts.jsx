import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, createPost, updatePost, deletePost } from '../services/posts';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Plus, Trash2, Pencil, AlertCircle, Loader2 } from 'lucide-react';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
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
      setLoading(true);
      const data = await getPosts();
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setIsSaving(true);
    try {
      let savedPost;
      if (editingPostId) {
        savedPost = await updatePost(editingPostId, newPost);
        setPosts(posts.map(p => (p.id === editingPostId ? savedPost : p)));
      } else {
        savedPost = await createPost({
          ...newPost,
          user_id: user.id,
          created_at: new Date().toISOString()
        });
        setPosts([savedPost, ...posts]);
      }

      setNewPost({ title: '', content: '' });
      setEditingPostId(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post.');
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setNewPost({ title: post.title, content: post.content });
    setShowForm(true);
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
            setShowForm(true);
            setNewPost({ title: '', content: '' });
            setEditingPostId(null);
            setError(null);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Post</span>
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
          <h2 className="text-xl font-bold mb-4">
            {editingPostId ? 'Edit Post' : 'Create New Post'}
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setNewPost({ title: '', content: '' });
                  setEditingPostId(null);
                }}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{editingPostId ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400">No posts yet</h3>
          <p className="text-gray-500 mt-2">Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.filter(Boolean).map((post) => (
            post?.title && (
              <div key={post.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  {user && post.user_id === user.id && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 mt-2 whitespace-pre-line">{post.content}</p>
                <div className="text-sm text-gray-500 mt-4">
                  Posted on {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
