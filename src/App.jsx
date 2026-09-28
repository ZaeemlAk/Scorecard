import React from 'react';
import { MatchProvider, useMatch } from './context/MatchContext';
import ScoreHeader from './components/ScoreHeader';
import { ControlPanel } from './components/ControlPanel';
import { PlayerStatsPanel } from './components/PlayerStatsPanel';


function ScorecardDashboard() {
const { matchState } = useMatch();
const { scorecard, deliveryHistory } = matchState;

return (
<div className="min-h-screen bg-slate-100 py-10 px-4">
<div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl border border-slate-200 overflow-hidden">
<ScoreHeader 
totalRuns={scorecard.totalRuns} 
wickets={scorecard.wickets} 
overs={scorecard.overs} 
ballsInOver={scorecard.ballsInOver} 
/>
<ControlPanel />
<PlayerStatsPanel/>
<div className="p-5 bg-slate-50 border-t border-slate-200">
<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
Recent Delivery Timeline
</h4>
{deliveryHistory.length === 0 ? (
<p className="text-sm text-slate-400">No balls bowled yet in this Innings.</p>
) : (
<div className="flex flex-wrap gap-2 items-center">
{deliveryHistory.map((delivery, index) => {
let badgeClass = "px-2.5 py-1 rounded text-xs font-bold shadow-sm ";
if (delivery.type === 'WICKET') badgeClass += "bg-red-100 text-red-800 border border-red-300";
else if (delivery.type === 'EXTRA') badgeClass += "bg-green-100 text-green-800 border border-amber-300";
else if ( delivery.type === 'RUNS' && (delivery.value === 4 || delivery.value === 6)) badgeClass += "bg-blue-100 text-blue-800 border border-blue-300";
else badgeClass += "bg-slate-200 text-slate-700 border border-slate-300";
return (
<span key={index} className={badgeClass}>
{delivery.type === 'RUNS' 
? (delivery.value === 0 ? '•' : `${delivery.value}R`) 
: delivery.type === 'EXTRA'
? `${delivery.extraType === 'WIDE' ? 'WD' : 'NB'} ${delivery.batRuns ? '+' + delivery.batRuns: ''}`
: delivery.value 
}
</span>
);
})}
</div>
)}
</div>
</div>
</div>
);
}

export default function App() {
return (
<MatchProvider>
<ScorecardDashboard />
</MatchProvider>
);
}
