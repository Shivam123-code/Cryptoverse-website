import React, { useEffect, useState } from 'react';
import { getPosts, createPost, updatePost, deletePost, Post } from '../services/posts';
import { supabase } from '../lib/supabase';
import { Pencil, Trash2, Plus, AlertCircle, X } from 'lucide-react';

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [user, setUser] = useState<any>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const setupPosts = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchPosts();
      } else {
        setLoading(false);
      }
    };

    setupPosts();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchPosts();
      } else {
        setPosts([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    try {
      setError(null);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSubmitLoading(true);
      
      if (isEditing) {
        await updatePost(isEditing, formData);
      } else {
        await createPost(formData);
      }
      
      setFormData({ title: '', content: '' });
      setIsEditing(null);
      await fetchPosts();
    } catch (err) {
      setError(isEditing ? 'Failed to update post' : 'Failed to create post');
      console.error('Error saving post:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (post: Post) => {
    setIsEditing(post.id);
    setFormData({ title: post.title, content: post.content });
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setError(null);
      await deletePost(id);
      setPosts(posts => posts.filter(post => post.id !== id));
    } catch (err) {
      setError('Failed to delete post');
      console.error('Error deleting post:', err);
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ title: '', content: '' });
    setError(null);
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to view and manage posts.</p>
          <p className="text-sm text-gray-500">Sign in to share your thoughts with the community.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Posts</h1>
          {isEditing && (
            <button
              onClick={cancelEdit}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
              <span>Cancel Editing</span>
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2 text-red-500">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={submitLoading}
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={submitLoading}
              />
            </div>
            <button
              type="submit"
              disabled={submitLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{isEditing ? 'Update Post' : 'Create Post'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400">No posts yet. Create your first post!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <p className="text-gray-400 text-sm">
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {post.user_id === user.id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Edit post"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;