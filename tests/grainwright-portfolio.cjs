const E=require('../games/grainwright/engine.js');
function portfolioRoute(s){const d=E.plan(s),actions=[];let n=s;const emit=a=>{actions.push(a);n=E.act(n,a);if(!n)throw Error(JSON.stringify(a))};
// Work in contiguous bands; choose their direction from the majority grain.
while(n.height.some((h,i)=>h>d.target[i])){const start=n.height.findIndex((h,i)=>h>d.target[i]);let width=1;while(width<n.tools&&start+width<8&&n.height[start+width]>d.target[start+width])width++;const cells=Array.from({length:width},(_,i)=>start+i),dir=cells.reduce((v,i)=>v+d.grain[i],0)>=0?1:-1,mixed=cells.some(i=>d.grain[i]!==dir);emit({type:s.goal==='clean'&&mixed?'scrape':'plane',start:dir===1?start:start+width-1,dir,width})}
for(let i=0;i<8;i++)while(n.rough[i])emit({type:'sand',start:i});emit({type:'deliver'});return actions}
module.exports={portfolioRoute};
