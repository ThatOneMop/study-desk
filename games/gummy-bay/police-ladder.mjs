// Four-stage Sugar Squad ladder. The seconds are how long a broken line of
// sight has to last before the chase clears. Seeing the player again refills
// that timer. Escalation is a separate step (running, a witness, a bonk).
export const LADDER=Object.freeze([
 Object.freeze({id:'suspicious',seconds:60,label:'SUSPICIOUS'}),
 Object.freeze({id:'investigating',seconds:30,label:'INVESTIGATING'}),
 Object.freeze({id:'pursuit',seconds:35,label:'PURSUIT'}),
 Object.freeze({id:'all-units',seconds:45,label:'ALL UNITS'})
]);
export const LADDER_SECONDS=Object.freeze({suspicious:60,investigating:30,pursuit:35,'all-units':45});
const ORDER=['suspicious','investigating','pursuit','all-units'];

export function stageSeconds(id){return LADDER_SECONDS[id]||0;}
export function freshChase(){return {stage:'clear',left:0,searching:false};}
export function spotChase(chase,stage='suspicious'){
 const id=LADDER_SECONDS[stage]?stage:'suspicious';
 if(chase?.stage&&chase.stage!=='clear')return {stage:chase.stage,left:stageSeconds(chase.stage),searching:false};
 return {stage:id,left:stageSeconds(id),searching:false};
}
export function escalateChase(chase){
 const stage=chase?.stage&&ORDER.includes(chase.stage)?chase.stage:'suspicious';
 const next=ORDER[Math.min(ORDER.length-1,ORDER.indexOf(stage)+1)];
 return {stage:next,left:stageSeconds(next),searching:false};
}
// `seen` refills the stage timer. Losing sight starts (or continues) the
// search countdown. Hitting zero clears the chase: you got away.
export function stepChase(chase,dt,seen){
 const step=Number.isFinite(dt)?Math.max(0,dt):0;
 const state=chase&&typeof chase.stage==='string'?chase:freshChase();
 if(state.stage==='clear'||!LADDER_SECONDS[state.stage])return seen?spotChase(state):freshChase();
 if(seen)return {stage:state.stage,left:stageSeconds(state.stage),searching:false};
 const budget=state.searching?finiteLeft(state.left):stageSeconds(state.stage);
 const left=budget-step;
 if(left<=0)return freshChase();
 return {stage:state.stage,left,searching:true};
}
function finiteLeft(value){return Number.isFinite(value)?Math.max(0,value):0;}
