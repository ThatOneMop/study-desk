(function(r,f){const e=f();if(typeof module==='object')module.exports=e;else r.Ambercut=e})(globalThis,()=>{'use strict';
const KEY='study-desk-ambercut-v1',names=['Fern in shale','Tide shell','Wing impression'],fossils=[[6,7,8,12,17,16,18],[7,11,12,13,16,17,18,22],[5,6,8,9,11,12,13,17]];
const copy=x=>JSON.parse(JSON.stringify(x)),near=i=>[i,i%5?i-1:-1,i%5<4?i+1:-1,i>=5?i-5:-1,i<20?i+5:-1].filter(x=>x>=0);
const matrix=[0,4,20,24];
function footprint(s,i){return s.tool==='chisel'?near(i):s.tool==='row'?near(i).filter(j=>Math.floor(j/5)===Math.floor(i/5)):s.tool==='column'?near(i).filter(j=>j%5===i%5):[i]}
function create(records=[null,null,null],site=0,seals=[false,false,false],commission=false){return {v:1,site,seals:[...seals],commission,depth:Array.from({length:25},(_,i)=>2+(i+site)%2),damage:[],strokes:0,tool:'chisel',phase:'dig',records:[...records],last:'Chisel clears a cross. Brush protects thin fossil layers.'}}
function found(s){return fossils[s.site].filter(i=>s.depth[i]===0).length}
function act(s,a){if(a==='restart')return create(s.records,s.site,s.seals,s.commission);if(a==='next')return s.phase==='won'?create(s.records,(s.site+1)%3,s.seals):null;if(a==='commission')return s.records.some(x=>x!==null)?create(s.records,s.site,s.seals,true):null;const n=copy(s);if(['brush','chisel','row','column'].includes(a)){n.tool=a;return n}if(s.phase!=='dig'||!Number.isInteger(a)||a<0||a>24||!s.depth[a])return null;
for(const i of footprint(s,a)){if(!n.depth[i])continue;if(n.depth[i]===1&&fossils[n.site].includes(i)&&s.tool!=='brush'&&!n.damage.includes(i))n.damage.push(i);n.depth[i]--}
n.strokes++;n.last=s.tool==='brush'?'A careful sweep reveals the surface.':s.tool==='chisel'?'A cross of shale flakes away.':'A narrow strip flakes away.';
if(n.commission&&matrix.some(i=>n.depth[i]!==2+(i+n.site)%2)){n.phase='lost';n.last='Corner matrix disturbed. Use narrow cuts to preserve the surrounding rock.'}
else if(n.damage.length>=3){n.phase='lost';n.last='Three fractures. Reset this tray and try a safer sequence.'}
else if(found(n)===fossils[n.site].length){n.phase='won';if(n.commission&&!n.damage.length)n.seals[n.site]=true;const score=100-n.strokes-12*n.damage.length;n.records[n.site]=n.records[n.site]===null?score:Math.max(score,n.records[n.site]);n.last=n.commission?(!n.damage.length?'Conservation seal earned: intact fossil and corner matrix.':'Specimen lifted, but fractures prevented a conservation seal.'):'Specimen lifted. Conservation assignments are now available.'}
else if(n.strokes>=50){n.phase='lost';n.last='The field kit is spent. Wider early cuts save strokes.'}return n}
function decode(raw){const s=JSON.parse(raw);if(s&&s.commission===undefined&&s.seals===undefined){s.commission=false;s.seals=[false,false,false]}const int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;if(!s||s.v!==1||!int(s.site,0,2)||!Array.isArray(s.depth)||s.depth.length!==25||s.depth.some((d,i)=>!int(d,0,2+(i+s.site)%2))||!Array.isArray(s.damage)||s.damage.length>fossils[s.site].length||new Set(s.damage).size!==s.damage.length||s.damage.some(i=>!fossils[s.site].includes(i)||s.depth[i]!==0)||!int(s.strokes,0,50)||!['brush','chisel','row','column'].includes(s.tool)||typeof s.commission!=='boolean'||!Array.isArray(s.seals)||s.seals.length!==3||s.seals.some(x=>typeof x!=='boolean')||!['dig','won','lost'].includes(s.phase)||!Array.isArray(s.records)||s.records.length!==3||s.records.some(x=>x!==null&&!int(x,0,100))||typeof s.last!=='string')throw Error('Invalid excavation save');
if(s.seals.some((earned,i)=>earned&&s.records[i]===null)||s.commission&&s.records.every(x=>x===null)||s.commission&&s.phase!=='lost'&&matrix.some(i=>s.depth[i]!==2+(i+s.site)%2))throw Error('Invalid conservation state');
const complete=found(s)===fossils[s.site].length;if(s.phase==='won'&&(!complete||s.damage.length>=3)||s.phase==='dig'&&(complete||s.strokes>=50||s.damage.length>=3)||s.phase==='lost'&&s.damage.length<3&&s.strokes<50&&!(s.commission&&matrix.some(i=>s.depth[i]!==2+(i+s.site)%2)))throw Error('Invalid excavation phase');return copy(s)}
return{KEY,names,fossils,near,matrix,footprint,create,found,act,decode};
});



