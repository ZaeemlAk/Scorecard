export const initPlayerStats = () => ({
battingStats: {runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, howOut: null},
bowlingStats: {balls: 0, runs: 0, wickets: 0},
});

const getOrInit = (playerStats,playerId) =>
playerStats[playerId] || initPlayerStats();

export const recordBattingDelivery = (
playerStats,
strikerId,
runs,
{countBall = true, creditRuns = true} = {}
) => {
const current = getOrInit(playerStats,strikerId)
return{
...playerStats,
[strikerId]:{
...current,
battingStats:{
...current.battingStats,
runs: current.battingStats.runs + (creditRuns ? runs : 0),
balls: current.battingStats.balls + (countBall ? 1 : 0 ),
fours: current.battingStats.fours + (creditRuns && runs === 4 ? 1 : 0),
sixes: current.battingStats.sixes + (creditRuns && runs === 6 ? 1 : 0),
},
},
};
};

export const recordBowlingDelivery = (
playerStats,
bowlerId,
runsConceded,
isWicket,
{countBall = true, creditRuns=true} = {}
) => {
const current = getOrInit(playerStats,bowlerId)
return{
...playerStats,
[bowlerId]:{
...current,
bowlingStats:{
...current.bowlingStats,

balls: current.bowlingStats.balls + (countBall ? 1 : 0),
runs: current.bowlingStats.runs + (creditRuns ? runsConceded :0),
wickets : current.bowlingStats.wickets + (isWicket ? 1 : 0),
},
},
};
};
export const markPlayerOut = (playerStats,outPlayerId,howOut) =>{
const current = getOrInit(playerStats,outPlayerId);

return{
...playerStats,
[outPlayerId] : {
...current,
battingStats: {...current.battingStats, isOut: true, howOut},
},
};
};