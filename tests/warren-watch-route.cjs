const E=require('../games/warren-watch/engine.js');
module.exports=function route(seed=1){let s=E.create(seed),actions=[];function doIt(a){s=E.act(s,a);if(!s)throw Error('illegal '+a);actions.push(a)}
for(let day=0;day<30;day++){
 if(E.act(s,'queen')){doIt('queen');return actions}
 while(s.rooms<2&&E.act(s,'room'))doIt('room');
 if(!s.brood&&s.ants<10&&s.food>=8)doIt('eggs');
 const w=E.forecast(s),g=w.threat+(s.health<6?1:0),n=s.brood?Math.ceil(s.brood/2):0;
 let f=Math.min(s.ants-g-n,Math.max(0,Math.ceil((Math.ceil(s.ants/2)+Math.max(0,(s.rooms<2?12:26)-s.food))/w.food)));
 let d=s.rooms<2?s.ants-g-n-f:0;if(!d)f=s.ants-g-n;
 for(const[i,count]of [f,n,d,g].entries())for(let k=0;k<count;k++)doIt('add:'+i);doIt('day');if(s.phase==='lost')throw Error('route lost '+seed)
}throw Error('route incomplete '+seed)};
