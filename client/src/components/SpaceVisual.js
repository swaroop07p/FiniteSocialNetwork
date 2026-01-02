import React from 'react';

const SpaceVisual = ({ current, max }) => {
  const percentage = (current / max) * 100;
  const isFull = current >= max;

  return (
    <div className="mt-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Storage Capacity</p>
          <h3 className={`text-2xl font-mono font-bold ${isFull ? 'text-red-500' : 'text-cyan-400'}`}>
            {current} <span className="text-slate-600 text-lg">/ {max}</span>
          </h3>
        </div>
        {isFull && (
          <span className="px-3 py-1 bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-black rounded-full animate-pulse">
            BATTLE MODE ACTIVE
          </span>
        )}
      </div>
      
      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
        <div 
          className={`h-full transition-all duration-700 ease-out ${isFull ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default SpaceVisual;