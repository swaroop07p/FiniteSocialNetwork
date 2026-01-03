import React, { useState } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import { API_URL } from '../config';

const PostForm = ({ currentUser }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return;

    try {
      await axios.post('${API_URL}/api/posts', { 
        content, 
        author: currentUser.username // Send the string name to backend
      });
      setContent('');
    } catch (err) {
      console.error("Transmission failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl transition-all focus-within:border-cyan-500/30">
      <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
        <span>Authorized as:</span>
        <span className="text-cyan-400">{currentUser.username}</span> 
      </div>
      
      <textarea 
        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 outline-none focus:border-cyan-500/20 h-28 resize-none placeholder:text-slate-700 text-slate-200"
        placeholder="Enter transmission content... space is finite."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      
      <button className="group w-full mt-4 bg-white hover:bg-cyan-400 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
        <span className="uppercase text-xs tracking-widest">Broadcast</span>
        <Send size={16} />
      </button>
    </form>
  );
};

export default PostForm;