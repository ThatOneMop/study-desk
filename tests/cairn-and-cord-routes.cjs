'use strict';
const E=require('../games/cairn-and-cord/engine.js');
const paths=[['a','s','c','d','e','top'],['a','b','s','b','c','d','e','f','top'],['a','b','s','b','c','d','e','f','top'],['a','b','s','c','d','e','f','g','h','top']];
function route(i,withStone=true){let s=E.fresh(i);const actions=[];const doIt=a=>{const r=E.step(s,a);if(!r.ok)throw Error(JSON.stringify(a)+': '+r.reason);s=r.state;actions.push(a);};for(const id of (withStone?paths[i]:i===0?['a','b','c','d','e','top']:paths[i].filter(x=>x!=='s'))){const h=E.hold(s,id);while(E.length(s,h)>s.paid)doIt({type:'rope',delta:1});if(E.cost(s,h)>s.grip)doIt({type:'rest'});doIt({type:'move',id});if(h.kind==='bolt')doIt({type:'clip'});if(h.kind==='ledge'){doIt({type:'rest'});doIt({type:'belay'});}}return {state:s,actions};}
function surveyRoute(i){let s=E.fresh(i);const actions=[];const doIt=a=>{const r=E.step(s,a);if(!r.ok)throw Error(JSON.stringify(a)+': '+r.reason);s=r.state;actions.push(a);};
for(const id of paths[i]){const h=E.hold(s,id);while(E.length(s,h)>s.paid)doIt({type:'rope',delta:1});if(E.cost(s,h)>s.grip)doIt({type:'rest'});doIt({type:'move',id});if(h.kind==='bolt')doIt({type:'clip'});if(h.kind==='ledge'){doIt({type:'rest'});doIt({type:'belay'});}if(id===(i===3?'g':'d')){const sample=E.hold(s,'survey');while(E.length(s,sample)>s.paid)doIt({type:'rope',delta:1});if(E.cost(s,sample)+2>s.grip)doIt({type:'rest'});doIt({type:'traverse',id:'survey'});doIt({type:'haul'});}}
return{state:s,actions};}
module.exports={route,paths,surveyRoute};
if(require.main===module)console.log(JSON.stringify(paths.map((_,i)=>({route:i,...route(i)})),null,2));
