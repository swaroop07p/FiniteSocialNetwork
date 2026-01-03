import React, { useState } from 'react';
import { Heart, MessageSquare, Send, ShieldCheck, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const PostCard = ({ post, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = async () => {
    try {
      await axios.patch(`${API_URL}/api/posts/${post._id}/like`, {
        userId: currentUser.id 
      });
    } catch (err) { console.error("Like error"); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axios.post(`${API_URL}/api/posts/${post._id}/comment`, {
        text: commentText,
        username: currentUser.username
      });
      setCommentText('');
    } catch (err) { console.error("Comment error"); }
  };

  return (
    <div className="group bg-slate-900/40 border border-slate-800/50 rounded-3xl overflow-hidden transition-all hover:bg-slate-900/60">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-500 font-bold uppercase text-xs">
              {post.author[0]}
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">{post.author}</h4>
              <p className="text-[10px] text-slate-600 font-mono">{new Date(post.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
          {currentUser.role === 'admin' && (
            <button onClick={() => axios.delete(`${API_URL}/api/posts/${post._id}`)} className="text-slate-600 hover:text-red-500 transition-colors">
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <p className="text-slate-300 mb-6">{post.content}</p>

        <div className="flex items-center gap-6 border-t border-slate-800/50 pt-4">
          <button onClick={handleLike} className="flex items-center gap-2 group/btn">
            <Heart size={20} className={post.likes > 0 ? "fill-pink-500 text-pink-500" : "text-slate-500"} />
            <span className="text-xs font-bold text-slate-500">{post.likes}</span>
          </button>
          
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors">
            <MessageSquare size={20} />
            <span className="text-xs font-bold">{post.comments?.length || 0}</span>
            {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* DROPDOWN COMMENTS SECTION */}
      {showComments && (
        <div className="bg-slate-950/50 border-t border-slate-800/50 p-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-4 max-h-60 overflow-y-auto mb-4 pr-2 custom-scrollbar">
            {post.comments?.map((c, i) => (
              <div key={i} className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-cyan-500 uppercase tracking-tighter">{c.username}</span>
                  <span className="text-[8px] text-slate-600 italic">{new Date(c.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-slate-300">{c.text}</p>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleComment} className="flex gap-2">
            <input 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a transmission..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs outline-none focus:border-cyan-500/50 transition-all text-white"
            />
            <button className="bg-cyan-600 p-2 rounded-xl text-white hover:bg-cyan-500 transition-colors">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;