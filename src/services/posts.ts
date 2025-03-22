import { supabase } from '../lib/supabase';

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
}

const checkAuth = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    throw new Error('Authentication required');
  }
  return session.session.user;
};

// Create a new post
export const createPost = async (data: CreatePostInput) => {
  const user = await checkAuth();

  const { data: post, error } = await supabase
    .from('posts')
    .insert([{
      ...data,
      user_id: user.id
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }

  return post;
};

// Get all posts
export const getPosts = async () => {
  await checkAuth();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }

  return posts;
};

// Get a single post by ID
export const getPost = async (id: string) => {
  await checkAuth();

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }

  return post;
};

// Update a post
export const updatePost = async (id: string, data: UpdatePostInput) => {
  const user = await checkAuth();

  const { data: post, error } = await supabase
    .from('posts')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }

  return post;
};

// Delete a post
export const deletePost = async (id: string) => {
  const user = await checkAuth();

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
};