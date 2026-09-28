import React from 'react';
import { globalPlayers } from '../../context/MatchContext'

export function PartnershipCard({ partnership }) {
if (!partnership) return null;
const { runs, balls, batter1Id, batter2Id } = partnership;
const runRate = balls > 0 ? ((runs / balls) * 6).toFixed(2) : '0.00';

return (
<div className="px-3 py-2 rounded bg-green-50 border border-emerald-200 text-sm">
<span className="text-xs font-bold text-green-700 uppercase tracking-wide">Partnership</span>
<div className="flex items-center justify-between mt-1">
<span className="text-slate-700">
{globalPlayers[batter1Id]?.name || 'Unknown'} & {globalPlayers[batter2Id]?.name || 'Unknown'}
</span>
<span className="font-bold text-slate-900">{runs} ({balls}) &middot; RR {runRate}</span>
</div>
</div>
);
}