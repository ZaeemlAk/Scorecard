import React from 'react';
import { globalPlayers } from '../../context/MatchContext'

const dismissalLabels = {
BOWLED: 'b',
CAUGHT: 'c',
CAUGHT_AND_BOWLED: 'c & b',
LBW: 'lbw',
STUMPED: 'st',
HIT_WICKET: 'hit wkt',
RUN_OUT: 'run out',
OBSTRUCTING_THE_FIELD: 'obstructing',
RETIRED_HURT: 'retired hurt',
};

export function FallOfWicketsCard({ fallOfWickets }) {
if (!fallOfWickets || fallOfWickets.length === 0) {
return (
<div className="px-3 py-2 rounded bg-slate-50 border border-slate-200 text-sm text-slate-400">
No wickets yet
</div>
);
}

return (
<div className="px-3 py-2 rounded bg-slate-50 border border-slate-200">
<span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Fall of Wickets</span>
<div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm">
{fallOfWickets.map((entry, index) => (
<span key={index} className="text-slate-700">
{index + 1}-{entry.score}
<span className="text-slate-400">
{' '}({globalPlayers[entry.playerId]?.name || 'Unknown'}, {dismissalLabels[entry.dismissalType] || entry.dismissalType}, {entry.overs} ov)
</span>
</span>
))}
</div>
</div>
);
}