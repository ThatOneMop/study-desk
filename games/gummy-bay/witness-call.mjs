// A bystander puts the phone to their ear. Four seconds later the squad knows.
export const WITNESS_SECONDS=4;
export function freshWitness(){return {state:'idle',left:WITNESS_SECONDS,called:false};}
export function stepWitness(witness,dt,{crime=false}={}){
 const step=Number.isFinite(dt)?Math.max(0,dt):0;
 const state=witness&&witness.state==='calling'?witness:freshWitness();
 if(state.state!=='calling'){
  if(!crime)return freshWitness();
  return {state:'calling',left:Math.max(0,WITNESS_SECONDS-step),called:false};
 }
 const left=state.left-step;
 if(left<=0)return {state:'idle',left:WITNESS_SECONDS,called:true};
 return {state:'calling',left,called:false};
}
