import React from 'react'
import { globalPlayers } from '../../context/MatchContext'

export function BatterCard ({playerId,isStriker,stats}) {
const battingStats = stats?.battingStats || {runs: 0, balls: 0, fours: 0, sixes: 0, howOut: null};
const {runs,balls,fours,sixes} = battingStats ;
const strikeRate = balls > 0 ? ((runs/balls) * 100).toFixed(2) : '0.0';

return(
<div className={`flex items-center justify-between px-3 py-2 rounded ${isStriker ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-200'}`}>
<div className='flex items-center gap-2 p-1.5'>
<span className='text-sm font-semibold text-slate-800'>{globalPlayers[playerId]?.name || 'Unknown'}</span>
{isStriker ? <span className='text-xs font-bold text-blue-600'>*</span> : null}
</div>
<div className="flex items-center gap-3 text-sm">

<span className='font-bold text-slate-900'>{runs}</span>
<span className='text-slate-400'>({balls})</span>
<span className='text-xs text-slate-500'>SR: {strikeRate}</span>
<span className='text-xs text-slate-500'>4s: {fours}</span>
<span className='text-xs text-slate-500'>6s: {sixes}</span>
</div>
</div>
)
}