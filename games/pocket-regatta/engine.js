/* Original turn-based sailing: tack around the wind and shorten sail near reefs. */
(function(r,f){if(typeof module==='object')module.exports=f();else r.PocketRegatta=f()})(globalThis,()=>{'use strict';
const KEY='study-desk-pocket-regatta-v1',DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]],NAMES=['N','NE','E','SE','S','SW','W','NW'];
const COURSES=[{name:'The morning triangle',wind:0,start:[1,7],heading:1,reefs:[[4,4],[4,5]],marks:[[6,2],[7,6],[1,7]]},{name:'Split rock',wind:7,start:[1,7],heading:0,reefs:[[3,3],[3,4],[3,5],[5,3],[5,4]],marks:[[2,1],[7,2],[6,7]]},{name:'The long reach',wind:1,start:[1,7],heading:0,reefs:[[4,2],[4,3],[4,5],[4,6],[6,4]],marks:[[1,1],[7,1],[7,7],[1,7]]}];
const clone=x=>structuredClone(x),delta=(a,b)=>Math.min((a-b+8)%8,(b-a+8)%8);
function create(){return{version:1,level:0,journal:[],records:[null,null,null],setup:{heading:1,reefed:true}}}
function unlocked(s){let n=0;while(n<2&&s.records[n]!==null)n++;return n}
function fresh(level){const c=COURSES[level];return{level,x:c.start[0],y:c.start[1],heading:c.heading,mark:0,hull:3,turns:0,phase:'sailing',message:'Visit the numbered buoys in order, including the finish.'}}
function valid(a){return a&&typeof a==='object'&&!Array.isArray(a)&&Number.isInteger(a.heading)&&a.heading>=0&&a.heading<8&&typeof a.reefed==='boolean'}
function forecast(r,a){if(!valid(a))return{ok:false,reason:'Choose a heading and sail size.'};if(r.phase!=='sailing')return{ok:false,reason:'Undo or restart this crossing.'};if(a.heading===COURSES[r.level].wind)return{ok:false,reason:'Into the wind: tack diagonally to make headway.'};if(delta(a.heading,r.heading)>2)return{ok:false,reason:'Turn at most 90° per move. Plan a wider turn.'};const c=COURSES[r.level],path=[],speed=a.reefed?1:2;let x=r.x,y=r.y,mark=r.mark,collision=false;
 for(let i=0;i<speed;i++){const nx=x+DIRS[a.heading][0],ny=y+DIRS[a.heading][1];if(nx<0||nx>8||ny<0||ny>8||c.reefs.some(p=>p[0]===nx&&p[1]===ny)){collision=true;break}x=nx;y=ny;path.push([x,y]);if(c.marks[mark]?.[0]===x&&c.marks[mark]?.[1]===y)mark++;if(mark===c.marks.length)break}
 return{ok:true,x,y,mark,path,collision,speed};}
function step(old,a){const f=forecast(old,a);if(!f.ok)return null;const r={...old,x:f.x,y:f.y,mark:f.mark,heading:a.heading,hull:old.hull-(f.collision?1:0),turns:old.turns+1};r.phase=r.mark===COURSES[r.level].marks.length?'won':r.hull===0?'lost':'sailing';r.message=r.phase==='won'?'Pennant earned! All buoys rounded.':r.phase==='lost'?'Hull damaged. Undo the grounding or restart.':f.collision?'Grounded: one hull lost. Shorten sail or steer clear.':r.mark>old.mark?'Buoy rounded. Set your next course.':'Clean water. Choose your next tack.';return r}
function run(s){let r=fresh(s.level);for(const a of s.journal){r=step(r,a);if(!r)throw Error('Invalid journal')}return r}
function project(s,actions){
 if(!Array.isArray(actions)||actions.length>6)return{ok:false,index:0};
 let r=run(s);const legs=[];
 for(let i=0;i<actions.length;i++){
  const f=forecast(r,actions[i]);if(!f.ok)return{ok:false,index:i,reason:f.reason};
  r=step(r,actions[i]);legs.push({action:{...actions[i]},path:f.path,collision:f.collision,x:r.x,y:r.y,mark:r.mark,hull:r.hull});
 }
 return{ok:true,state:r,legs};
}
function act(old,a){const s=clone(old);if(a==='undo'){if(!s.journal.length)return{ok:false,state:old};s.setup=s.journal.pop()}else if(a==='retry')s.journal=[];else if(Number.isInteger(a)){if(a<0||a>unlocked(s))return{ok:false,state:old};s.level=a;s.journal=[];s.setup={heading:COURSES[a].heading,reefed:true}}else{if(s.journal.length>=200||!step(run(s),a))return{ok:false,state:old};s.journal.push({heading:a.heading,reefed:a.reefed});const r=run(s);if(r.phase==='won')s.records[s.level]=Math.min(s.records[s.level]??Infinity,r.turns)}return{ok:true,state:s}}
function decode(raw){if(typeof raw!=='string'||raw.length>15000)throw Error('Oversize save');const a=JSON.parse(raw);if(!a||a.version!==1||!Array.isArray(a.records)||a.records.length!==3||!Array.isArray(a.journal)||a.journal.length>200||!valid(a.setup))throw Error('Invalid save');const s=create();s.records=a.records.map((n,i)=>{if(n===null)return n;if(!Number.isInteger(n)||n<1||n>200||(i&&a.records[i-1]===null))throw Error('Invalid record');return n});if(!Number.isInteger(a.level)||a.level<0||a.level>unlocked(s))throw Error('Locked course');s.level=a.level;s.setup={heading:a.setup.heading,reefed:a.setup.reefed};s.journal=a.journal.map(x=>{if(!valid(x))throw Error('Invalid action');return{heading:x.heading,reefed:x.reefed}});run(s);return s}
return{KEY,DIRS,NAMES,COURSES,create,unlocked,fresh,forecast,step,run,project,act,decode};});
