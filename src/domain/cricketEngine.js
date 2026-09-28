import { recordBattingDelivery,recordBowlingDelivery } from "./playerStats";
export const swapStrike = (activeState) => {
return{
...activeState,
strikerId: activeState.nonStrikerId,
nonStrikerId: activeState.strikerId,
};
};
export const handleRuns = (state,runs) => {
let {totalRuns, ballsInOver,overs} = state.scorecard;
let activeState = {...state.activeState};

let nextRuns = totalRuns + runs;
let nextBalls = ballsInOver + 1;
let nextOvers = overs;

if(runs % 2 !== 0){
activeState = swapStrike(activeState);
}
let overCompleted = false;
if(nextBalls === 6) {
nextOvers += 1;
nextBalls = 0;
overCompleted = true;
activeState = swapStrike(activeState);
} 
const playerStats = recordBowlingDelivery(
recordBattingDelivery(state.playerStats,state.activeState.strikerId,runs),
state.activeState.currentBowlerId,
runs,
false
);
const currentPartnership = {
...state.currentPartnership,
runs: state.currentPartnership.runs + runs,
balls: state.currentPartnership.balls + 1,
}

return {
...state,
scorecard: {
...state.scorecard,
totalRuns: nextRuns,
ballsInOver: nextBalls,
overs: nextOvers,
overCompleted,
isFreeHit: false,
},
activeState,
playerStats,
currentPartnership,
deliveryHistory: [... state.deliveryHistory, {type: 'RUNS', value: runs}],
};
};

export const ExtraStrategies = {
WIDE: {
applyExtras: (extras) => ({ ...extras, wides: extras.wides + 1 }),
setsFreeHit: false,
penaltyRuns: 1,
advancesBall: false,
batterFacesBall: false,
creditRunsToBatter: false,
},
NO_BALL: {
applyExtras: (extras) => ({ ...extras, noBalls: extras.noBalls + 1 }),
setsFreeHit: true,
penaltyRuns:1,
advancesBall: false, 
batterFacesBall: true,
creditRunsToBatter: true,
},
BYE: {
applyExtras: (extras) => ({ ...extras, byes: (extras.byes || 0) + 1 }),
setsFreeHit: false,
penaltyRuns:0,
advancesBall: true,
batterFacesBall: true,
creditRunsToBatter: false,
},
LEG_BYE: {
applyExtras: (extras) => ({ ...extras, legByes: (extras.legByes || 0) + 1 }),
setsFreeHit: false,
penaltyRuns:0,
advancesBall: true,
batterFacesBall: true,
creditRunsToBatter: false,
},
};
export const handleExtra = (state, extraType, batRuns = 0) => {
const strategy = ExtraStrategies[extraType];
if (!strategy) {
console.warn(`No extra strategy found for type: ${extraType}`);
return state;
}

const { totalRuns, extras, isFreeHit,ballsInOver,overs } = state.scorecard;
let activeState = { ...state.activeState };

const nextExtras = strategy.applyExtras(extras);
const totalAdded = strategy.penaltyRuns + batRuns;

let nextBalls = ballsInOver;
let nextOvers = overs;
let overCompleted = false;


if(strategy.advancesBall) {
nextBalls += 1;
if(nextBalls === 6){
nextOvers += 1;
nextBalls = 0;
overCompleted = true;
activeState = swapStrike(activeState);

}
}

if (batRuns % 2 !== 0) {
activeState = swapStrike(activeState);
}

let playerStats = recordBattingDelivery(
state.playerStats,
state.activeState.strikerId,
batRuns,
{countBall : strategy.batterFacesBall , creditRuns : strategy.creditRunsToBatter}
);
playerStats = recordBowlingDelivery(
playerStats,
state.activeState.currentBowlerId,
totalAdded,
false,
{countBall : strategy.advancesBall, creditRuns: strategy.penaltyRuns > 0}
);

const currentPartnership = {
...state.currentPartnership,
runs: state.currentPartnership.runs + batRuns, 
balls: state.currentPartnership.balls + (strategy.batterFacesBall ? 1 : 0),
}

return {
...state,
scorecard: {
...state.scorecard,
totalRuns: totalRuns + totalAdded,
extras: nextExtras,
ballsInOver: nextBalls,
overs: nextOvers,
overCompleted,
isFreeHit: strategy.setsFreeHit ? true : isFreeHit,
},
activeState,
playerStats,
currentPartnership,
deliveryHistory: [
...state.deliveryHistory,
{ type: 'EXTRA', extraType, batRuns },
],
};
};