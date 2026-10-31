(function(root,f){const api=f();if(typeof module==='object'&&module.exports)module.exports=api;else root.Tumbleglass=api})(globalThis,function(){'use strict';
const KEY='study-desk-tumbleglass-v1',DIRS={up:-5,right:1,down:5,left:-1};
const LEVELS=[{name:'Amber & tide',walls:[0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24],start:[6,8],goals:[7,16]},{name:'The divider',walls:[0,1,2,3,4,5,9,10,12,14,15,19,20,21,22,23,24],start:[6,18],goals:[13,7]},{name:'Three reflections',walls:[0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24],start:[6,7,18],goals:[17,16,8]}];
const clone=x=>JSON.parse(JSON.stringify(x)),int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
function initial(l){return{beads:LEVELS[l].start.slice(),locked:LEVELS[l].start.map(()=>false),clampUsed:false}}
function tilt(level,board,dir,hold=null){if(!Object.hasOwn(DIRS,dir)||!(hold===null||int(hold,0,board.beads.length-1))||(hold!==null&&(board.clampUsed||board.locked[hold])))return null;const l=LEVELS[level],b=clone(board),step=DIRS[dir],order=b.beads.map((_,i)=>i).sort((a,c)=>step>0?b.beads[c]-b.beads[a]:b.beads[a]-b.beads[c]);for(const i of order){if(b.locked[i]||i===hold)continue;while(!l.walls.includes(b.beads[i]+step)&&!b.beads.includes(b.beads[i]+step)){b.beads[i]+=step;if(b.beads[i]===l.goals[i]){b.locked[i]=true;break}}}if(JSON.stringify(b)===JSON.stringify(board))return null;if(hold!==null)b.clampUsed=true;return b}
function lift(level,board,i,dir){if(board.liftUsed||!int(i,0,board.beads.length-1)||!Object.hasOwn(DIRS,dir))return null;const p=board.beads[i]+DIRS[dir];if(p<0||p>=25||Math.abs(p%5-board.beads[i]%5)+Math.abs(Math.floor(p/5)-Math.floor(board.beads[i]/5))!==1||LEVELS[level].walls.includes(p)||board.beads.includes(p))return null;const b=clone(board);b.beads[i]=p;b.locked[i]=p===LEVELS[level].goals[i];b.liftUsed=true;return b}
function move(level,b,a){if(a&&typeof a==='object'&&!Array.isArray(a)&&Object.keys(a).sort().join(',')==='dir,lift')return lift(level,b,a.lift,a.dir);return typeof a==='string'?tilt(level,b,a):a&&typeof a==='object'&&!Array.isArray(a)&&Object.keys(a).length===2&&Object.hasOwn(a,'dir')&&Object.hasOwn(a,'hold')&&a.hold!==null?tilt(level,b,a.dir,a.hold):null}
function board(s){let b=initial(s.level);for(const d of s.moves){b=move(s.level,b,d);if(!b)throw Error('Invalid journal')}return b}
function won(b){return b.locked.every(Boolean)}
// Breadth-first search is advisory only: it never changes the board or journal.
function solve(level,start,allowLift=true){
 if(won(start))return{status:'complete',moves:[]};
 const key=b=>b.beads.join(',')+'|'+b.locked.map(Number).join('')+'|'+Number(b.clampUsed)+'|'+Number(!!b.liftUsed);
 const queue=[{b:clone(start),moves:[]}],seen=new Set([key(start)]);
 for(let head=0;head<queue.length;head++){
  const {b,moves}=queue[head],holds=[null];
  if(!b.clampUsed)b.locked.forEach((locked,i)=>{if(!locked)holds.push(i)});
  const actions=holds.flatMap(hold=>Object.keys(DIRS).map(dir=>hold===null?dir:{dir,hold}));if(allowLift&&!b.liftUsed)b.locked.forEach((locked,i)=>{for(const dir of Object.keys(DIRS))actions.push({dir,lift:i})});
  for(const action of actions){
   const n=move(level,b,action);if(!n)continue;
   const k=key(n);if(seen.has(k))continue;seen.add(k);
   const route=[...moves,action];
   if(won(n))return{status:'solvable',moves:route};
   queue.push({b:n,moves:route});
  }
 }
 return{status:'dead-end',moves:[]};
}
const STUDIES=[{id:'bare',name:'Bare hands',goal:'Finish without the clamp or lift.'},{id:'clamp',name:'Steady hand',goal:'Change a tilt with the clamp, then finish without lifting.'},{id:'rescue',name:'Second setting',goal:'Lift a nested bead out of its socket, then finish.'}];
function techniques(level,moves){let b=initial(level),rescued=false,clampChanged=false;for(const a of moves){if(a&&typeof a==='object'&&Object.hasOwn(a,'lift')&&b.locked[a.lift])rescued=true;const next=move(level,b,a);if(a&&typeof a==='object'&&Object.hasOwn(a,'hold')){const free=tilt(level,b,a.dir);if(next&&(!free||next.beads.join(',')!==free.beads.join(',')))clampChanged=true;}b=next;if(!b)throw Error('Invalid study');}return{bare:won(b)&&!b.clampUsed&&!b.liftUsed,clamp:won(b)&&clampChanged&&!b.liftUsed,rescue:won(b)&&rescued};}
// Store an actual winning journal for each technique, never an unverified badge.
function archive(s){const earned=techniques(s.level,s.moves);if(!Object.values(earned).some(Boolean))return s;const n=clone(s);n.studies??=[{},{},{}];for(const {id} of STUDIES)if(earned[id]&&(!n.studies[n.level][id]||s.moves.length<n.studies[n.level][id].length))n.studies[n.level][id]=clone(s.moves);return n;}
function create(){return{version:1,level:0,moves:[],records:[null,null,null]}}
function act(s,a){const n=clone(s);if(a==='undo'){if(!n.moves.length)return{ok:false,state:s};n.moves.pop();return{ok:true,state:n}}if(a==='retry'){n.moves=[];return{ok:true,state:n}}if(a?.type==='level'){if(!int(a.level,0,2)||(a.level>0&&n.records[a.level-1]===null))return{ok:false,state:s};n.level=a.level;n.moves=[];return{ok:true,state:n}}const b=board(s);if(won(b)||s.moves.length>=300)return{ok:false,state:s};const next=move(s.level,b,a);if(!next)return{ok:false,state:s};n.moves.push(clone(a));if(won(next))n.records[n.level]=Math.min(n.records[n.level]??Infinity,n.moves.length);return{ok:true,state:n}}
function decode(raw){const s=JSON.parse(raw);if(!s||s.version!==1||!int(s.level,0,2)||!Array.isArray(s.moves)||s.moves.length>300||!Array.isArray(s.records)||s.records.length!==3||!s.records.every(x=>x===null||int(x,1,300))||s.records.some((x,i)=>x!==null&&i>0&&s.records[i-1]===null)||(s.level>0&&s.records[s.level-1]===null))throw Error('Invalid save');let b=initial(s.level);for(const d of s.moves){if(won(b))throw Error('Moves after completion');b=move(s.level,b,d);if(!b)throw Error('No-op in journal')}if(won(b)&&(s.records[s.level]===null||s.records[s.level]>s.moves.length))throw Error('Missing record');const out={version:1,level:s.level,moves:s.moves.slice(),records:s.records.slice()};
if(Object.hasOwn(s,'studies')){if(!Array.isArray(s.studies)||s.studies.length!==3)throw Error('Invalid studies');out.studies=s.studies.map((v,i)=>{if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!STUDIES.some(t=>t.id===k)))throw Error('Invalid studies');const clean={};for(const [id,moves] of Object.entries(v)){const verified=decode(JSON.stringify({version:1,level:i,moves,records:s.records}));if(!techniques(i,verified.moves)[id])throw Error('Unfinished technique');clean[id]=clone(verified.moves);}return clean;});}return out;}
return{STUDIES,techniques,archive,KEY,DIRS,LEVELS,initial,tilt,lift,move,board,won,solve,create,act,decode};});


