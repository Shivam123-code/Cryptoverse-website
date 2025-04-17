import React, { useEffect, useState } from 'react';
import { Loader2, User, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPosts } from '../services/admin'; 

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();

        // Ensure posts is always an array
        const safeData = Array.isArray(data) ? data : [];
        setPosts(safeData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]); // fallback in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All User Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-400">No posts found.</p>
      ) : (
        posts.map((userPostGroup) => (
          <div key={userPostGroup.user_id} className="mb-8 bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="mb-4 flex items-center space-x-3">
              <User className="text-blue-500" />
              <h2 className="text-xl font-semibold">{userPostGroup.email}</h2>
            </div>
            <div className="space-y-4">
              {userPostGroup.posts.map((post) => (
                <div key={post.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center space-x-2 text-purple-400 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{new Date(post.created_at).toLocaleString()}</span>
                  </div>
                  <h3 className="text-lg font-medium text-white">{post.title}</h3>
                  <p className="text-gray-300">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPosts;
