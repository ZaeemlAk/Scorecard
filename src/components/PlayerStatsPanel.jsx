import React from 'react';
import { useMatch } from '../context/MatchContext';
import { BatterCard } from './cards/BatterCard';
import { BowlerCard } from './cards/BowlerCard';
import { PartnershipCard } from './cards/PartnerShipCard';
import { FallOfWicketsCard } from './cards/FallOFWicketsCard';

export function PlayerStatsPanel() {
const { matchState } = useMatch();
const { strikerId, nonStrikerId, currentBowlerId } = matchState.activeState;
const { playerStats, currentPartnership, fallOfWickets } = matchState;

return (
<div className="p-5 bg-white border-t border-slate-200 space-y-2">
<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Batting</h4>
<BatterCard playerId={strikerId} isStriker={true} stats={playerStats[strikerId]} />
<BatterCard playerId={nonStrikerId} isStriker={false} stats={playerStats[nonStrikerId]} />

<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4">Bowling</h4>
<BowlerCard playerId={currentBowlerId} stats={playerStats[currentBowlerId]} />

<div className="mt-4">
<PartnershipCard partnership={currentPartnership} />
</div>

<div className="mt-4">
<FallOfWicketsCard fallOfWickets={fallOfWickets} />
</div>
</div>
);
}