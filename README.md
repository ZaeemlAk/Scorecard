<!--     
Interface Segregation ISP: UI Presentational Components
ControlPanel.jsx  Interactive scoring buttons panel
ScoreHeader.jsx   Scoreboard digital banner layout
context/          Dependency Inversion DIP: Application Layer Abstraction
MatchContext.jsx  State hub holding match data configurations
domain/           Single Responsibility Pure JS Cricket Engine Logic
cricketEngine.js  Handles legal deliveries, over updates & strike changes
dismissals.js     Liskov Substitution (LSP): Polymorphic wicket behaviors
Fallback for Ordinary delivery regular runs dot ball 
createContext — creates a Context object for sharing state without prop drilling.
useContext — hook to consume a Context's value inside a component.
useState - hook to hold local component state
(prev) => handleRuns(prev,runs) This is an Updater Function
For a larger App to avoid unnecssary re-render make use of useMemo.
Instead of every component needing to import { useContext } from 'react' and import { MatchContext } from './context/MatchContext' separately, they just do import { useMatch } from './context/MatchContext' and call useMatch()
Prop drilling is what happens when you need to pass data from a parent component down to a deeply nested child component, but that data has to pass through every component in between — even ones that don't actually need it themselves, they just forward it along.
import { useMatch } from '../context/MatchContext';
Imports the custom hook from the context file — this is how ControlPanel gets direct access to match state and the scoring functions, without needing them passed as props (this is the prop-drilling-avoidance we just talked about).
{globalPlayers[strikerId]?.name || 'None'} This function mainly render dynamically the Striker name base on their id and if the player is missing it is returning None value so that the system will not crash
useMatch is a custom Hook presumably Built on React context that give access to share match data/actions.
{children} is destructured from props it represent whatever JSX is nested inside <MatchProvider>... </MatchProvider>
Returns a new object, spreading in all existing fields from activeState first (so currentBowlerId is preserved unchanged). ...activeState.

let activeState = {...state.activeState};
Makes a shallow copy of activeState so it can be reassigned locally without mutating the original state object (important for React's immutability requirements).
Spreading ({...state, scorecard: {...}}) guarantees a brand-new object at every level that changed, which is what tells React this is different, please re-render.
The one-sentence version: every spread here exists to guarantee that state updates produce brand-new object/array references instead of mutating existing ones — which is what makes React's re-render detection work correctly, keeps your domain functions predictable and pure, and avoids subtle bugs where "old" and "new" state accidentally become the same object in memory.
badges : one per delivery
isFreeHit = False means Cleared after every legal delivery
if there is no curly braces{} after arrow function => this is implicit Conversion if t
.toFixed(1) (The Formatting): This rounds the calculated strike rate to exactly one decimal place and converts it into a string (e.g., 135.483... becomes "135.5").
If your incoming stats object ever gets updated with a balls value that arrives as a string instead of a number (for example, if it comes from an input field or a database text field), JavaScript will try to do string division. While JavaScript handles this automatically, it's safer to ensure it is treated as a number.
const [dismissedIds, setDismissedIds] = useState([]); // track everyone who's out so far
the two hooks used: useState for local component state, useEffect for reacting to changes in matchState specifically, detecting when an over completes
The Undo button Calls undoLast directly  disabled when there's nothing to undo, styled red when active / grey when not Labeled Cancel which as flagged last message — is misleading given what it actually does.
The component that wraps your app and supplies match data to every descendant. {children} is whatever JSX is nested inside <MatchProvider>...</MatchProvider> in App.jsx.
This is the key mechanism applyChange takes an updater function (e.g(prev) => handleRuns(prev, runs)) and does two things
Pushes the current matchState (as it exists right now, before this change) onto the history array a new array with everything old plus the current snapshot appended.
Then applies the actual change by calling setMatchState(updater).
we use slice method in react as it doesn't change the original array it only return a returns a copy and is safe for react state and is best used for pagination,limiting list,copying array safely.
Unless splice changes the original array it destroy and alters original at react state it causes rendering bug and it is mainly used for Modifying Local, non-state variables. 
Pagination is a design pattern used to split a large dataset into smaller, discrete chunks or pages. Instead of loading thousands of items on a single screen all at once, pagination displays a limited number of items (like 10 or 20) and provides UI controls (such as "Next," "Previous," or page numbers) to navigate between them.You encounter pagination daily on websites like Google Search results, Amazon product listings, and e-commerce item grids.
We use the concat() method in JavaScript because it merges two or more arrays (or strings) together and returns a brand-new array without modifying the original ones.Just like the slice() method, concat() is non-mutating, making it highly valued in React and functional programming for preserving state immutability.
-->
