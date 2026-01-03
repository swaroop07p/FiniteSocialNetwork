import React from 'react';
import { Heart, ShieldCheck, Trash2 } from 'lucide-react';
import axios from 'axios';

const PostCard = ({ post, currentUser }) => {
  console.log("Current User Role:", currentUser?.role);

  console.log("Current User Role:", currentUser?.role);
  // client/src/components/PostCard.js

const handleDelete = async () => {
  if (window.confirm("Purge this content?")) {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${post._id}`);
      // No need to do anything here if your Socket.io listener in App.js 
      // is working, but adding a local alert helps for debugging.
    } catch (err) {
      console.error("Delete failed:", err);
      alert("System error during purge.");
    }
  }
};
const handleLike = async () => {
  try {
    // IMPORTANT: currentUser.id comes from your Login/App.js state
    await axios.patch(`http://localhost:5000/api/posts/${post._id}/like`, {
      userId: currentUser.id 
    });
    // Visual update happens via Socket.io automatically
  } catch (err) {
    // This catches the "Post already liked" error from backend
    alert(err.response?.data?.msg || "Like failed");
  }
};

  return (
    <div className="group bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl hover:bg-slate-900/80 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-500 font-bold uppercase text-xs">
            {post.author ? post.author[0] : "?"}
          </div>
          <div>
            <h4 className="font-bold text-slate-200 text-sm">{post.author}</h4>
            <p className="text-[10px] text-slate-600 font-mono">{new Date(post.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* FIX: Use currentUser.role directly from props */}
          {currentUser && currentUser.role === 'admin' && (
            <button 
              onClick={handleDelete} 
              className="p-2 text-slate-500 hover:text-red-500 transition-colors bg-red-500/5 rounded-lg border border-red-500/10"
              title="Admin Purge"
            >
              <Trash2 size={16} />
            </button>
          )}
          <div className="px-2 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded-md">
            <ShieldCheck size={12} className="text-emerald-500" />
          </div>
        </div>
      </div>

      <p className="text-slate-400 leading-relaxed mb-6 font-medium">{post.content}</p>

      <div className="flex items-center justify-between border-t border-slate-800/50 pt-4">
        <button 
          onClick={handleLike}
          className="flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-colors group/btn"
        >
          <Heart size={18} className={post.likes > 0 ? "fill-pink-500 text-pink-500" : ""} />
          <span className="text-xs font-black">{post.likes}</span>
        </button>
        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Verified Content</span>
      </div>
    </div>
  );
};

export default PostCard;