const API_URL = 'http://localhost:5000/api/posts'; // ✅ Adjust if needed
// Change port if needed

export const getPosts = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    credentials: 'include', // Ensures user authentication is sent
  });
  return response.json();
};

export const createPost = async (postData) => {
  try {
    const response = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ✅ Ensures session cookies are sent
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
  }
};


export const getPost = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response.json();
};

export const updatePost = async (id, post) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(post),
  });
  return response.json();
};

export const deletePost = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to delete post");
  }
  return result;
};
