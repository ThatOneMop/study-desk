const E=require('../games/warren-watch/engine.js');
module.exports=function route(seed=1,fits=[]){let s=E.create(seed),actions=[];function doIt(a){s=E.act(s,a);if(!s)throw Error('illegal '+a);actions.push(a)}
for(let day=0;day<30;day++){
 if(fits.every(k=>s.fittings.includes(k))&&E.act(s,'queen')){doIt('queen');return actions}
 while(s.rooms<2&&E.act(s,'room'))doIt('room');
 for(const k of fits)if(E.act(s,'fit:'+k))doIt('fit:'+k);
 if(!s.brood&&s.ants<10&&s.food>=8)doIt('eggs');
 const w=E.forecast(s),g=E.threat(s)+(s.health<6?1:0),n=s.brood?E.nurses(s):0;
 let f=Math.min(s.ants-g-n,Math.max(0,Math.ceil((E.upkeep(s)+Math.max(0,(s.rooms<2?12:26)-s.food))/w.food)));
 let d=(s.rooms<2||!fits.every(k=>s.fittings.includes(k)))?s.ants-g-n-f:0;if(!d)f=s.ants-g-n;
 for(const[i,count]of [f,n,d,g].entries())for(let k=0;k<count;k++)doIt('add:'+i);doIt('day');if(s.phase==='lost')throw Error('route lost '+seed)
}throw Error('route incomplete '+seed)};
