(function(r,f){const e=f();if(typeof module==='object')module.exports=e;else r.Ambercut=e})(globalThis,()=>{'use strict';
const KEY='study-desk-ambercut-v1',names=['Fern in shale','Tide shell','Wing impression'],fossils=[[6,7,8,12,17,16,18],[7,11,12,13,16,17,18,22],[5,6,8,9,11,12,13,17]];
const copy=x=>JSON.parse(JSON.stringify(x)),near=i=>[i,i%5?i-1:-1,i%5<4?i+1:-1,i>=5?i-5:-1,i<20?i+5:-1].filter(x=>x>=0);
function create(records=[null,null,null],site=0){return {v:1,site,depth:Array.from({length:25},(_,i)=>2+(i+site)%2),damage:[],strokes:0,tool:'chisel',phase:'dig',records:[...records],last:'Chisel clears a cross. Brush protects thin fossil layers.'}}
function found(s){return fossils[s.site].filter(i=>s.depth[i]===0).length}
function act(s,a){if(a==='restart')return create(s.records,s.site);if(a==='next')return s.phase==='won'?create(s.records,(s.site+1)%3):null;const n=copy(s);if(a==='brush'||a==='chisel'){n.tool=a;return n}if(s.phase!=='dig'||!Number.isInteger(a)||a<0||a>24||!s.depth[a])return null;
for(const i of s.tool==='chisel'?near(a):[a]){if(!n.depth[i])continue;if(n.depth[i]===1&&fossils[n.site].includes(i)&&s.tool==='chisel'&&!n.damage.includes(i))n.damage.push(i);n.depth[i]--}
n.strokes++;n.last=s.tool==='chisel'?'A cross of shale flakes away.':'A careful sweep reveals the surface.';
if(n.damage.length>=3){n.phase='lost';n.last='Three fractures. Reset this tray and try a safer sequence.'}
else if(found(n)===fossils[n.site].length){n.phase='won';const score=100-n.strokes-12*n.damage.length;n.records[n.site]=n.records[n.site]===null?score:Math.max(score,n.records[n.site]);n.last='Specimen lifted. Your best preservation score is saved.'}
else if(n.strokes>=50){n.phase='lost';n.last='The field kit is spent. Wider early cuts save strokes.'}return n}
function decode(raw){const s=JSON.parse(raw),int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;if(!s||s.v!==1||!int(s.site,0,2)||!Array.isArray(s.depth)||s.depth.length!==25||s.depth.some((d,i)=>!int(d,0,2+(i+s.site)%2))||!Array.isArray(s.damage)||s.damage.length>3||new Set(s.damage).size!==s.damage.length||s.damage.some(i=>!fossils[s.site].includes(i)||s.depth[i]!==0)||!int(s.strokes,0,50)||!['brush','chisel'].includes(s.tool)||!['dig','won','lost'].includes(s.phase)||!Array.isArray(s.records)||s.records.length!==3||s.records.some(x=>x!==null&&!int(x,0,100))||typeof s.last!=='string')throw Error('Invalid excavation save');
const complete=found(s)===fossils[s.site].length;if(s.phase==='won'&&(!complete||s.damage.length>=3)||s.phase==='dig'&&(complete||s.strokes>=50||s.damage.length>=3)||s.phase==='lost'&&s.damage.length<3&&s.strokes<50)throw Error('Invalid excavation phase');return copy(s)}
return{KEY,names,fossils,near,create,found,act,decode};
});

