import { swapStrike } from "./cricketEngine";
import { recordBattingDelivery, recordBowlingDelivery, markPlayerOut } from "./playerStats";

const standardDismissal = {
execute: (state, details) => ({
...state,
activeState: { ...state.activeState, strikerId: null },
}),
validOnFreeHit: false,
countsAsWicket: true,
batterReturnable: false,
};

const eitherBatterDismissal = {
execute: (state, details) => {
const isStrikerOut = details.outPlayerId === state.activeState.strikerId;
return {
...state,
activeState: {
...state.activeState,
strikerId: isStrikerOut ? null : state.activeState.strikerId,
nonStrikerId: !isStrikerOut ? null : state.activeState.nonStrikerId,
},
};
},
validOnFreeHit: true,
countsAsWicket: true,
batterReturnable: false,
};

const retiredHurtDismissal = {
execute: eitherBatterDismissal.execute,
validOnFreeHit: true,
countsAsWicket: false,
batterReturnable: true,
};

const retiredOutDismissal = {
execute: eitherBatterDismissal.execute,
validOnFreeHit: true,
countsAsWicket: true,
batterReturnable: true,
};

export const DismissalStrategies = {
BOWLED: standardDismissal,
STUMPED: standardDismissal,
CAUGHT: standardDismissal,
CAUGHT_AND_BOWLED: standardDismissal,
LBW: standardDismissal,
HIT_WICKET: standardDismissal,

RUN_OUT: eitherBatterDismissal,
OBSTRUCTING_THE_FIELD: eitherBatterDismissal,

RETIRED_HURT: retiredHurtDismissal,
RETIRED_OUT: retiredOutDismissal,
};

export const processWicket = (state, dismissalType, details) => {
const strategy = DismissalStrategies[dismissalType];
if (!strategy) {
console.warn(`No dismissal strategy found for type: ${dismissalType}`);
return state;
}
if (state.scorecard.isFreeHit && !strategy.validOnFreeHit) {
console.warn(`${dismissalType} cannot be given on a Free Hit.`);
return state;
}

const bowlerCreditTypes = ['BOWLED', 'CAUGHT', 'CAUGHT_AND_BOWLED', 'LBW', 'STUMPED', 'HIT_WICKET'];
const creditBowler = bowlerCreditTypes.includes(dismissalType);

let playerStats = recordBowlingDelivery(state.playerStats, state.activeState.currentBowlerId, 0, creditBowler);

if (strategy.countsAsWicket) {
playerStats = markPlayerOut(playerStats, details.outPlayerId, dismissalType);
}

const afterDismissal = strategy.execute(state, details);
const { ballsInOver, overs } = state.scorecard;
let nextBalls = ballsInOver + 1;
let nextOvers = overs;
let overCompleted = false;
let activeState = { ...afterDismissal.activeState };

if (nextBalls === 6) {
nextOvers += 1;
nextBalls = 0;
overCompleted = true;
activeState = swapStrike(activeState);
}

const retiredBatters = strategy.batterReturnable
? [...(state.retiredBatters || []), { playerId: details.outPlayerId, score: state.scorecard.totalRuns }]
: (state.retiredBatters || []);

return {
...afterDismissal,
scorecard: {
...state.scorecard,
wickets: state.scorecard.wickets + (strategy.countsAsWicket ? 1 : 0),
retiredHurtCount: (state.scorecard.retiredHurtCount || 0) + (strategy.batterReturnable ? 1 : 0),
ballsInOver: nextBalls,
overs: nextOvers,
overCompleted,
isFreeHit: false,
pendingBatter: true,
},
activeState,
playerStats,
retiredBatters,
currentPartnership: { runs: 0, balls: 0, batter1Id: null, batter2Id: null },
fallOfWickets: strategy.countsAsWicket
? [
...state.fallOfWickets,
{ playerId: details.outPlayerId, score: state.scorecard.totalRuns, overs: `${state.scorecard.overs}.${nextBalls}`, dismissalType },
]
: state.fallOfWickets,
deliveryHistory: [...state.deliveryHistory, { type: 'WICKET', value: dismissalType }],
};
};