import React from 'react';
import {useState,useEffect} from 'react';
import { useMatch } from '../context/MatchContext';
import { globalPlayers,teamA,teamB } from '../context/MatchContext';
import { DismissalStrategies } from '../domain/dismissals';

export function ControlPanel() {
const { scoreRuns, scoreExtra, scoreWicket,setNewBatter,setNewBowler,undoLast,canUndo,matchState } = useMatch();
const { strikerId, nonStrikerId, currentBowlerId } = matchState.activeState;

const [pendingRunOut, setPendingRunOut] = useState(false);
const [pendingExtra, setPendingExtra] = useState(null);
const [dismissedIds, setDismissedIds] = useState([]);

const [pendingBowlerChange, setPendingBowlerChange] = useState(false);
const [previousBowlerId, setPreviousBowlerId] = useState(null);

const pendingBatter = matchState.scorecard.pendingBatter;

useEffect (() =>{
if (matchState.scorecard.overCompleted){
setPreviousBowlerId(matchState.activeState.currentBowlerId);
setPendingBowlerChange(true);
}
},[matchState.scorecard.overCompleted]);

const triggerWicket = (type) => {
if (type === 'RUN_OUT') {
setPendingRunOut(true);
return;
}
setDismissedIds((prev) => [...prev,strikerId]);
scoreWicket(type,null,strikerId);
};

const confirmRunOut = (whoIsOutId) => {
setDismissedIds((prev) => [...prev,whoIsOutId]);
scoreWicket('RUN_OUT',null,whoIsOutId);
setPendingRunOut(false);
};
const triggerExtra = (type) =>{
setPendingExtra(type)
};

const confirmExtra = (batRuns) =>{
scoreExtra(pendingExtra,batRuns);
setPendingExtra(null);
};

const availableBatters = Object.keys(teamA).filter((id) => id !== strikerId && id !== nonStrikerId && !dismissedIds.includes(id));
let confirmNewBatter = (batterId) => {
setNewBatter(batterId);
};

const availableBowlers = Object.keys(teamB).filter((id) => id !== previousBowlerId);
let confirmNewBowler = (bowlerId) =>{
setNewBowler(bowlerId);
setPendingBowlerChange(false);
};

const extraLabels = {
WIDE: 'Runs off the Bat on this Wide',
NO_BALL: 'Runs off the Bat on this No Ball',
BYE: 'How many Byes were Run?',
LEG_BYE: 'How many Leg Byes were Run?',
};

const btnRun = "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow active:scale-95 transition-transform text-sm";
const btnExtra = "bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow active:scale-95 transition-transform text-sm";
const btnWicket = "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow active:scale-95 transition-transform text-sm md:col-span-2";
const btnDisabled = "bg-slate-300 text-slate-500 font-semibold py-2 px-4 rounded shadow cursor-not-allowed text-sm md:col-span-2";
const btnChoice = "bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded shadow active:scale-95 transition-transform text-sm";
const btnDisabledSmall = "bg-slate-300 text-slate-500 font-semibold py-2 px-4 rounded shadow cursor-not-allowed text-sm";

const noReplacementsLeft = availableBatters.length === 0;
const isFreeHit = matchState.scorecard.isFreeHit;
const isInningOver = matchState.scorecard.wickets >= 10;

const isRunButtonDisabled = isInningOver || pendingBowlerChange || pendingBatter;
const isExtraButtonDisabled = isInningOver || pendingBowlerChange || pendingBatter;

const isDismissalDisabled = (type) =>{
if(isInningOver || pendingBowlerChange|| pendingBatter) return true;
if(noReplacementsLeft) return true;
if(isFreeHit && !DismissalStrategies[type]?.validOnFreeHit) return true;
return false;
};

const wicketButtons = [
{type: 'BOWLED', label: 'Wicket (Bowled)'},
{type: 'RUN_OUT', label: 'Wicket (Run Out)'},
{type: 'CAUGHT', label: 'Wicket (Caught)'},
{type: 'CAUGHT_AND_BOWLED', label: 'Wicket (Caught and Bowled)'},
{type: 'LBW', label: 'Wicket (LBW)'},
{type: 'STUMPED', label: 'Wicket (Stumped)'},
{type: 'HIT_WICKET', label: 'Wicket (Hit Wicket)'},
{type: 'OBSTRUCTING_THE_FIELD', label: 'Wicket (OBSTRUCTING_THE_FIELD)'},
{type: 'RETIRED_HURT', label: 'Wicket (Retired Hurt)'},
{type: 'RETIRED_OUT', label: 'Wicket (Retired Out)'},

];
return (
<div className="p-6 bg-white">
<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Scoring Panel</h3>
<button 
onClick = {undoLast}
disabled = {!canUndo}
className={canUndo
? 'text-xs font-semibold text-red-600 hover:text-red-700 underline'
: 'text-xs font-semibold text-slate-300 cursor-not-allowed'}
>
Cancel
</button>


{pendingRunOut ? (
<div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded">
<p className="text-xs font-semibold text-slate-500 mb-2">Who was run out?</p>
<div className="flex gap-2">
<button onClick={() => confirmRunOut(strikerId)} className={btnChoice}>
{globalPlayers[strikerId].name} (Striker)
</button>
<button onClick={() => confirmRunOut(nonStrikerId)} className={btnChoice}>
{globalPlayers[nonStrikerId].name} (Non-Striker)
</button>
<button onClick={() => setPendingRunOut(false)} className="text-xs text-slate-400 underline">
Cancel
</button>
</div>
</div>
) : null}

{pendingExtra? (
<div className='mb-4 p-3 bg-slate-50 border border-slate-200 rounded'>
<p className='text-xs font-semibold text-slate-500 mb-2'>{extraLabels[pendingExtra]}</p>
<div className='flex gap-2 flex-wrap'>
{(pendingExtra === 'BYE' || pendingExtra === 'LEG_BYE'
? [1,2,3,4]
: [0,1,2,3,4,6]
).map((r) => (
<button key={r} onClick={() => confirmExtra(r)} className = {btnChoice}>
{r}
</button>
))}
<button onClick= {() => setPendingExtra(null)} className='text-xs text-slate-400 underline'>
Cancel
</button>

</div>
</div> 
): null}
{pendingBatter ? (
<div className= 'mb-4 p-3 bg-slate-50 border border-slate-200 rounded'>
<p className='text-xs font-semibold text-slate-500 mb-2'>Player Out - Select Next Batter</p>
<div className='flex gap-2 flex-wrap'>
{availableBatters.map((id) => (
<button key={id} onClick = {() => confirmNewBatter(id)} className={btnChoice}>
{globalPlayers[id].name}
</button>

))}
</div>
</div>
): null}

{pendingBowlerChange ? (
<div className='mb-4 p-3 bg-slate-50 border border-slate-200 rounded'>
<p className='text-xs font-semibold text-slate-500 mb-2'>Over Complete - Select Next Bowler</p>
<div className='flex gap-2 flex-wrap'>
{availableBowlers.map((id) => (
<button key={id} onClick={() => confirmNewBowler(id)} className={btnChoice}>
{globalPlayers[id].name}
</button>
))}
</div>
</div>
) : null}

{isInningOver ? (
<div className="mb-2 p-2 bg-slate-800 text-white text-sm font-bold text-center rounded">
All Out - Inning Over
</div>
) : isFreeHit ? (
<div className='mb-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-800 text-sm font-bold text-center rounded'>
Free Hit-Next Ball 
</div>
): null}


<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
<button onClick={() => scoreRuns(0)} className={isRunButtonDisabled ? btnDisabledSmall : btnRun} disabled={isRunButtonDisabled}>Dot Ball</button>
<button onClick={() => scoreRuns(1)} className={isRunButtonDisabled ? btnDisabledSmall : btnRun} disabled={isRunButtonDisabled}>1 Run</button>
<button onClick={() => scoreRuns(4)} className={isRunButtonDisabled ? btnDisabledSmall : btnRun} disabled={isRunButtonDisabled}>4 Runs</button>
<button onClick={() => scoreRuns(6)} className={isRunButtonDisabled ? btnDisabledSmall : btnRun} disabled={isRunButtonDisabled}>6 Runs</button>
<button onClick={() => triggerExtra('WIDE')} className={isExtraButtonDisabled ? btnDisabledSmall : btnExtra} disabled={isExtraButtonDisabled}>Wide</button>
<button onClick={() => triggerExtra('NO_BALL')} className={isExtraButtonDisabled ? btnDisabledSmall : btnExtra} disabled={isExtraButtonDisabled}>No Ball</button>
<button onClick={() => triggerExtra('BYE')} className={isExtraButtonDisabled ? btnDisabledSmall : btnExtra} disabled={isExtraButtonDisabled}>Bye</button>
<button onClick={() => triggerExtra('LEG_BYE')} className={isExtraButtonDisabled ? btnDisabledSmall : btnExtra} disabled={isExtraButtonDisabled}>Leg Bye</button>

{wicketButtons.map(({type,label}) => (
<button
key={type}
onClick ={() => triggerWicket(type)}
className={isDismissalDisabled(type) ? btnDisabled : btnWicket}
disabled={isDismissalDisabled(type)}
> {label}</button>
))}
</div>
</div>
);
}