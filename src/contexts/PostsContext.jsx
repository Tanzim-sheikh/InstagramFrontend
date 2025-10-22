// contexts/PostsContext.js
import React, { createContext, useContext, useState } from 'react';

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState(10);
  
  const value = {
    posts,
    setPosts,
    incrementPosts: () => setPosts(prev => prev + 1)
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) throw new Error('usePosts must be used within PostsProvider');
  return context;
};