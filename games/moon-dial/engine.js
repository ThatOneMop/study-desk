/* Original Moon Dial: coupled rotary mechanisms with one sliding clutch. */
(function(r,f){if(typeof module==='object')module.exports=f();else r.MoonDial=f()})(globalThis,()=>{'use strict';
const KEY='study-desk-moon-dial-v1',MACHINES=[{name:'The bedside clock',start:[2,4,1],goal:[0,0,0],edges:[[0,1],[1,2]]},{name:'The garden chime',start:[1,3,5,2],goal:[0,3,0,3],edges:[[0,1],[1,2],[1,3]]},{name:'The moon observatory',start:[4,1,3,2,5],goal:[0,2,4,2,0],edges:[[0,1],[1,2],[2,3],[3,4]]}];
const copy=x=>structuredClone(x),wrap=n=>(n+6)%6;
function create(){return{version:1,level:0,selected:0,history:[],records:[null,null,null]}}
function unlocked(s){let i=0;while(i<2&&s.records[i]!==null)i++;return i}
function fresh(level){return{level,angles:MACHINES[level].start.slice(),clutch:-1,turns:0,phase:'active',message:'Choose a coupling to disengage, then turn a dial.'}}
function affected(r,gear){const signs=new Map([[gear,1]]),queue=[gear];for(let i=0;i<queue.length;i++)MACHINES[r.level].edges.forEach(([a,b],edge)=>{if(edge===r.clutch)return;const n=a===queue[i]?b:b===queue[i]?a:null;if(n!==null&&!signs.has(n)){signs.set(n,-signs.get(queue[i]));queue.push(n)}});return signs}
function step(old,a){if(!a||typeof a!=='object'||Array.isArray(a)||old.phase==='won')return null;const r=copy(old),m=MACHINES[r.level];if(a.type==='clutch'){if(!Number.isInteger(a.edge)||a.edge< -1||a.edge>=m.edges.length||a.edge===r.clutch)return null;r.clutch=a.edge;r.message=a.edge<0?'All couplings engaged.':'Coupling '+m.edges[a.edge].map(i=>String.fromCharCode(65+i)).join('–')+' is open; the others remain engaged.'}else if(a.type==='turn'){if(!Number.isInteger(a.gear)||a.gear<0||a.gear>=r.angles.length||![1,-1].includes(a.dir))return null;for(const [i,sign]of affected(r,a.gear))r.angles[i]=wrap(r.angles[i]+sign*a.dir);r.turns++;r.message='Dial '+String.fromCharCode(65+a.gear)+' turned '+(a.dir===1?'clockwise':'anticlockwise')+'.'}else return null;if(r.angles.every((v,i)=>v===m.goal[i])){r.phase='won';r.message='In tune! Every dial is registered to its moon mark.'}return r}
function run(s){let r=fresh(s.level);for(const a of s.history){r=step(r,a);if(!r)throw Error('Invalid journal')}return r}
function act(old,a){const s=copy(old);if(a==='undo'){if(!s.history.length)return{ok:false,state:old};s.history.pop()}else if(a==='retry')s.history=[];else if(Number.isInteger(a)){if(a<0||a>unlocked(s))return{ok:false,state:old};s.level=a;s.selected=Math.min(s.selected??0,MACHINES[a].start.length-1);s.history=[]}else{if(s.history.length>=400||!step(run(s),a))return{ok:false,state:old};s.history.push(copy(a));const r=run(s);if(r.phase==='won'&&(s.records[s.level]===null||r.turns<s.records[s.level]))s.records[s.level]=r.turns}return{ok:true,state:s}}
function decode(raw){if(typeof raw!=='string'||raw.length>30000)throw Error('Oversize save');const a=JSON.parse(raw);if(!a||a.version!==1||!Array.isArray(a.records)||a.records.length!==3||!Array.isArray(a.history)||a.history.length>400)throw Error('Invalid save');const s=create();s.records=a.records.map((n,i)=>{if(n===null)return null;if(!Number.isInteger(n)||n<1||n>400||(i&&a.records[i-1]===null))throw Error('Invalid record');return n});if(!Number.isInteger(a.level)||a.level<0||a.level>unlocked(s))throw Error('Locked mechanism');s.level=a.level;if(a.selected!==undefined&&(!Number.isInteger(a.selected)||a.selected<0||a.selected>=MACHINES[s.level].start.length))throw Error('Invalid selected dial');s.selected=a.selected??0;s.history=a.history.map(x=>copy(x));run(s);return s}
// Breadth-first search over compact mechanical states, not the saved journal.
// Finds a shortest action route (clutch changes count as actions, unlike records).
function route(s){
 const r=run(s);if(r.phase==='won')return[];
 const m=MACHINES[s.level],n=m.start.length,k=m.edges.length+1,powers=Array.from({length:n},(_,i)=>6**i);
 const encode=a=>a.reduce((v,x,i)=>v+x*powers[i],0),decode=v=>powers.map(p=>Math.floor(v/p)%6);
 const start=encode(r.angles)*k+r.clutch+1,target=encode(m.goal),size=6**n*k;
 const parents=new Int32Array(size).fill(-2),actions=new Array(size),queue=new Int32Array(size);
 parents[start]=-1;queue[0]=start;let head=0,tail=1;
 const moves=Array.from({length:k},(_,c)=>Array.from({length:n},(_,gear)=>[...affected({...r,clutch:c-1},gear)]));
 function finish(id){const out=[];while(parents[id]!==-1){out.push(actions[id]);id=parents[id]}return out.reverse()}
 while(head<tail){const id=queue[head++],c=id%k,code=Math.floor(id/k),angles=decode(code);
  const visit=(next,a)=>{if(parents[next]!==-2)return false;parents[next]=id;actions[next]=a;queue[tail++]=next;return true};
  for(let next=0;next<k;next++)if(next!==c)visit(code*k+next,{type:'clutch',edge:next-1});
  for(let gear=0;gear<n;gear++)for(const dir of [-1,1]){
   const a=angles.slice();for(const [i,sign]of moves[c][gear])a[i]=wrap(a[i]+sign*dir);
   const nc=encode(a),next=nc*k+c;
   if(visit(next,{type:'turn',gear,dir})&&nc===target)return finish(next);
  }
 }
 return null;
}

return{route,KEY,MACHINES,create,unlocked,fresh,affected,step,run,act,decode};});
