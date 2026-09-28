import React from 'react';

export default function ScoreHeader({totalRuns,wickets,overs,ballsInOver }){
return(
<div className="bg-slate-900 text-white p-6 rounded-t-xl text-center shadow-md">
<div className="text-sm font-semibold tracking-widest text-green-400 uppercase mb-1">
Live Scorecard
<h1 className="text-5xl font-extrabold tracking-tight">
{totalRuns} <span className="text-slate-400 font-light">/</span>{wickets}    
</h1>
<p className="text-lg text-slate-300 mt-2 font-medium">
Overs:<span className="text-white font-bold">{overs}.{ballsInOver}</span>
</p>
</div>
</div>
)
}