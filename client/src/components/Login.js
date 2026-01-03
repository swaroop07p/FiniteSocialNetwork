import React, { useState } from 'react';
import axios from 'axios';
import { Shield, UserPlus, LogIn } from 'lucide-react';
import { API_URL } from '../config';

const Login = ({ onLogin }) => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isNewUser ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, { username, password });
      
      // Store token and user data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('finite_user', JSON.stringify(res.data.user));
      
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.msg || "Authentication failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield size={32} className="text-cyan-400" />
        </div>
        
        <h1 className="text-3xl font-black text-white text-center mb-2 uppercase tracking-tight">
          {isNewUser ? 'Create Identity' : 'Access Terminal'}
        </h1>
        <p className="text-slate-500 text-center mb-8 text-xs font-bold uppercase tracking-widest">
          {isNewUser ? 'Join the finite battle' : 'Verify your credentials'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm mb-6 text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Username</label>
            <input 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 outline-none focus:border-cyan-500 transition-all text-white"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Password</label>
            <input 
              required
              type="password"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 outline-none focus:border-cyan-500 transition-all text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20">
            {isNewUser ? <UserPlus size={18}/> : <LogIn size={18}/>}
            {isNewUser ? 'REGISTER ACCOUNT' : 'INITIALIZE SESSION'}
          </button>
        </form>

        <button 
          onClick={() => setIsNewUser(!isNewUser)}
          className="w-full mt-6 text-slate-500 hover:text-cyan-400 text-xs font-bold transition-colors"
        >
          {isNewUser ? 'ALREADY HAVE AN ACCOUNT? LOGIN' : 'NEW USER? CREATE ACCOUNT'}
        </button>
      </div>
    </div>
  );
};

export default Login;