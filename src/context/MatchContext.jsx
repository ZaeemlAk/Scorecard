import React from 'react';
import{createContext ,useContext,useState} from 'react';
import {handleRuns, handleExtra} from '../domain/cricketEngine';
import {processWicket} from '../domain/dismissals';

const MatchContext = createContext(null);

const initialData = {
scorecard : {totalRuns: 0, wickets: 0, overs: 0, ballsInOver: 0, extras: {wides:0, noBalls: 0, byes: 0, legByes:0 },isFreeHit: false,overCompleted:false,pendingBatter:false,},
activeState: {strikerId: "p1", nonStrikerId: "p2", currentBowlerId: "p3"},
deliveryHistory: [],
playerStats: {},
currentPartnership: {runs: 0, balls: 0, batter1Id: "p1", batter2Id: "p2"},
fallOfWickets: [],

};

export const teamA = {
p1: {id: "p1", name: "Virat Kohli"},
p2: {id: "p2", name: "Rohit Sharma"},
p4: {id: "p4", name: "Hardik Pandya"},
p5: {id: "p5", name: "Ms Dhoni"},
p6: {id: "p6", name: "KL Rahul"},
p7: {id: "p7", name: "Ravindra Jadeja"},
p9: {id: "p9", name: "Shubman Gill"},
p10: {id: "p10", name: "Yuzvendra Chahal"},
p11: {id: "p11", name: "Mohammed Shami"},
p12: {id: "p12", name: "Ishan Kishan"},
p13: {id: "p13", name: "Axar Patel"},
p16: {id: "p16", name: "Vaibhav Arora"},
};

export const teamB = {
p3: {id: "p3", name: "Mohd Siraj"},
p8: {id: "p8", name: "Jasprit Bumrah"},
p14: {id: "p14", name: "Ishant Sharma"},
p15: {id: "p15", name: "Harshit Rana"},
//rest bowling side
};

export const globalPlayers = { ...teamA, ...teamB };

export function MatchProvider ({children}) {
const[matchState, setMatchState] = useState(initialData);
const[history,setHistory] = useState([]);

const applyChange = (updater) => {
setHistory ((prevHistory) => [...prevHistory,matchState]);
setMatchState(updater);
};

const scoreRuns = (runs) => {
applyChange((prev) => handleRuns(prev,runs));
}
const scoreExtra = (type,batRuns=0) => {
applyChange((prev) => handleExtra(prev,type,batRuns));
}
const scoreWicket = (type,nextBatterId,outPlayerId = null) => {
applyChange((prev) => processWicket(prev,type,{nextBatterId,outPlayerId}));
};
const setNewBatter = (batterId) => {
applyChange((prev) =>{
const strikerWasOut = prev.activeState.strikerId === null;
const newActiveState = strikerWasOut
? {...prev.activeState, strikerId: batterId}
: {...prev.activeState, nonStrikerId: batterId};
return{
...prev,
activeState: newActiveState,
scorecard: {...prev.scorecard, pendingBatter: false}, 
currentPartnership: {
runs: 0,
balls: 0,
batter1Id: newActiveState.strikerId,
batter2Id: newActiveState.nonStrikerId,
},
}
});
};
const setNewBowler = (bowlerId) => {
applyChange((prev) =>({
...prev,
activeState: {...prev.activeState, currentBowlerId: bowlerId},
scorecard : {...prev.scorecard,overCompleted: false},
}));
};
const undoLast = () => {
setHistory((prevHistory) => {
if(prevHistory.length === 0) return prevHistory; 
const lastState = prevHistory[prevHistory.length-1];
setMatchState(lastState);
return prevHistory.slice(0, -1);
})
}
const canUndo = history.length > 0;
return (
<MatchContext.Provider value ={{matchState,scoreRuns,scoreExtra,scoreWicket,setNewBatter,setNewBowler,undoLast,canUndo}}>
{children}
</MatchContext.Provider>
);
} 

export const useMatch = () => useContext(MatchContext);