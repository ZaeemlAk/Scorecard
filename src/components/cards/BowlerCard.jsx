import React from 'react';
import { globalPlayers } from '../../context/MatchContext'

export function BowlerCard({ playerId, stats }) {
const bowlingStats = stats?.bowlingStats || { balls: 0, runs: 0, wickets: 0 };
const { balls, runs, wickets } = bowlingStats;
const completedOvers = Math.floor(balls / 6);
const remainderBalls = balls % 6;
const oversDisplay = `${completedOvers}.${remainderBalls}`;
const economy = balls > 0 ? (runs / (balls / 6)).toFixed(2) : '0.00';

return (
<div className="flex items-center justify-between px-3 py-2 rounded bg-slate-50 border border-slate-200">
<span className="text-sm font-semibold text-slate-800">{globalPlayers[playerId]?.name || 'Unknown'}</span>
<div className="flex items-center gap-3 text-sm">
<span className="text-slate-700">{oversDisplay} over</span>
<span className="font-bold text-slate-900">{wickets}/{runs}</span>
<span className="text-xs text-slate-500">Econ: {economy}</span>
</div>
</div>
);
}