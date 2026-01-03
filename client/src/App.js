import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import PostForm from './components/PostForm';
import PostCard from './components/PostCard';
import SpaceVisual from './components/SpaceVisual';
import Login from './components/Login';
import { API_URL } from './config';

const socket = io(API_URL);

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('finite_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      localStorage.removeItem('finite_user');
      return null;
    }
  }); 

  const MAX_POSTS = 100;

  useEffect(() => {
    axios.get('${API_URL}/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.log("Fetch error:", err));

    socket.on('post_created', (newPost) => setPosts(prev => [newPost, ...prev]));
    socket.on('post_swapped', ({ deleted, added }) => {
  setPosts(prev => {
    // 1. Remove the deleted post
    const filtered = prev.filter(p => p._id !== deleted._id);
    // 2. Add the new post if it was sent in the same event
    return added ? [added, ...filtered] : filtered;
  });
  socket.on('post_liked', (updatedPost) => {
      setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
    });
    socket.on('post_deleted', (id) => {
      setPosts(prev => prev.filter(p => p._id !== id));
    });

    return () => {
      socket.off('post_created');
      socket.off('post_swapped');
      socket.off('post_liked');
      socket.off('post_deleted');
    };
  }, []);
});
    

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex justify-between items-center mb-8">
             <span className="text-xs text-slate-500 font-mono tracking-tighter">USER_ID: {socket.id || 'connecting...'}</span>
             <button 
                onClick={() => { localStorage.removeItem('finite_user'); window.location.reload(); }}
                className="text-xs text-red-500 font-bold hover:bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 transition-all"
             >
               DISCONNECT ({user.username})
             </button>
          </div>
          <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent mb-2">FINITE</h1>
          <p className="text-slate-500 uppercase text-[10px] tracking-[0.3em] font-bold">Scarce Digital Content Protocol</p>
          <SpaceVisual current={posts.length} max={MAX_POSTS} />
        </header>

        <section className="space-y-8">
          {/* We pass the WHOLE user object here */}
          <PostForm currentUser={user} />
          
          <div className="flex items-center gap-4 py-4 opacity-20">
            <div className="h-px flex-1 bg-white"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">Global Stream</span>
            <div className="h-px flex-1 bg-white"></div>
          </div>

          <div className="grid gap-6">
            {Array.isArray(posts) ? (
              posts.map(post => <PostCard key={post._id} post={post} currentUser={user} />)
            ) : (
              <p className="text-center text-slate-500">Initializing connection...</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}



export default App;