(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Lanternwake=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const DIRS={n:[0,-1],e:[1,0],s:[0,1],w:[-1,0]},ACTIONS=['n','e','s','w','bn','be','bs','bw','wait','snuff'];
const VOYAGES=[
 {name:'A light to follow',brief:'Carry two firefly jars home. Throw a lantern ahead, then sail through its glow.',oil:5,par:24,throws:3,rows:['#########','#S..#..D#','#...#...#','#..J..J.#','#...#...#','#...#...#','#########']},
 {name:'The hungry wing',brief:'A moth follows your lanterns. Leave a light behind it, then take the other channel.',oil:5,par:28,throws:4,rows:['#########','#S...M.D#','#..###..#','#J.....J#','#..###..#','#...R...#','#########']},
 {name:'Reed islands',brief:'The reed refuge offers one fresh oil and a small pool of permanent light.',oil:4,par:30,throws:4,rows:['#########','#S.#...D#','#..#J#..#','#J...#..#','#..R...J#','#M.#....#','#########']},
 {name:'Twin embers',brief:'Two moths compete for the nearest light. Use the islands to delay them.',oil:5,par:34,throws:5,rows:['#########','#S..#J.D#','#...#...#','#J..R..J#','#..###..#','#M.....M#','#########']},
 {name:'The last crossing',brief:'Bring all three jars to the far dock. Safe refuges, careful lures and reclaimed oil make a clean crossing.',oil:4,par:38,throws:5,rows:['#########','#SJ.#..D#','#...#J..#','#.R...R.#','#..#.#..#','#M.J...M#','#########']}
];
const copy=o=>JSON.parse(JSON.stringify(o)),W=9,H=7,xy=p=>[p%W,Math.floor(p/W)],dist=(a,b)=>Math.abs(a%W-b%W)+Math.abs(Math.floor(a/W)-Math.floor(b/W));
function cell(v,p){return Number.isInteger(p)&&p>=0&&p<W*H?VOYAGES[v].rows[Math.floor(p/W)][p%W]:'#';}
function water(v,p){return cell(v,p)!=='#';}
function points(v,c){const out=[];VOYAGES[v].rows.forEach((r,y)=>[...r].forEach((a,x)=>{if(a===c)out.push(y*W+x);}));return out;}
function neighbour(p,d){const [x,y]=xy(p),[dx,dy]=DIRS[d];return x+dx<0||x+dx>=W||y+dy<0||y+dy>=H?-1:p+dx+dy*W;}
// Light travels around water channels, never through rock.
function distances(v,from){const out={[from]:0},q=[from];for(let i=0;i<q.length;i++)for(const d of Object.keys(DIRS)){const p=neighbour(q[i],d);if(water(v,p)&&out[p]===undefined){out[p]=out[q[i]]+1;q.push(p);}}return out;}
function lit(s){const seen=new Set([s.boat]);for(const p of [...points(s.voyage,'S'),...points(s.voyage,'D'),...points(s.voyage,'R')]){const ds=distances(s.voyage,p);for(const [q,n]of Object.entries(ds))if(n<=(cell(s.voyage,p)==='R'?1:2))seen.add(+q);}for(const b of s.beacons){const ds=distances(s.voyage,b.p);for(const [q,n]of Object.entries(ds))if(n<=3)seen.add(+q);}return seen;}
function create(voyage=0){if(!Number.isInteger(voyage)||voyage<0||voyage>=VOYAGES.length)throw Error('Unknown voyage');const s={voyage,boat:points(voyage,'S')[0],oil:VOYAGES[voyage].oil,hull:3,jars:[],refuges:[],moths:points(voyage,'M'),beacons:[],turn:0,throws:0,hits:0,status:'playing',history:[],message:'Throw a lantern two spaces ahead. Only lit water can be sailed.'};s.seen=[...lit(s)];return s;}
function target(s,d){const a=neighbour(s.boat,d),p=a<0?-1:neighbour(a,d);return water(s.voyage,a)&&water(s.voyage,p)?p:-1;}
function advanceMoths(s){const moved=[];for(const pos of s.moths){let target=null,best=Infinity;const ds=distances(s.voyage,pos);for(const b of s.beacons){if(ds[b.p]<best){target=b.p;best=ds[b.p];}}let p=pos;if(target!==null&&pos!==target){const to=distances(s.voyage,target);for(const d of Object.keys(DIRS)){const n=neighbour(pos,d);if(to[n]!==undefined&&to[n]<best){p=n;break;}}}moved.push(p);}s.moths=moved;
 const eaten=s.beacons.filter(b=>moved.includes(b.p)).length;s.beacons=s.beacons.filter(b=>!moved.includes(b.p));return eaten;
}
function step(state,action){const fail=reason=>({ok:false,state,reason});if(state.status!=='playing')return fail('Voyage ended. Undo or restart to sail again.');if(!ACTIONS.includes(action))return fail('Unknown action.');const s=copy(state);let message='';
 if(DIRS[action]){const p=neighbour(s.boat,action);if(!water(s.voyage,p))return fail('Rock blocks that channel.');if(!lit(s).has(p))return fail('Unlit water. Throw a lantern before sailing.');s.boat=p;message='Oars dip into the glow.';}
 else if(action[0]==='b'){const p=target(s,action[1]);if(p<0)return fail('A lantern needs two clear water spaces.');if(!s.oil)return fail('No oil. Reclaim a nearby lantern or visit a refuge.');if(s.beacons.length>=2)return fail('Two lanterns already afloat. Reclaim one or let it expire.');if(s.beacons.some(b=>b.p===p))return fail('A lantern is already there.');s.beacons.push({p,life:7});s.oil--;s.throws++;message='Lantern afloat. Six turns of light remain after this turn.';}
 else if(action==='snuff'){const near=s.beacons.filter(b=>dist(s.boat,b.p)<=1).sort((a,b)=>a.life-b.life||a.p-b.p)[0];if(!near)return fail('Sail beside a lantern to reclaim it.');s.beacons=s.beacons.filter(b=>b!==near);s.oil++;message='Lantern reclaimed: one oil recovered.';}
 else message='You hold the oars. Moths and lanterns still advance.';
 if(cell(s.voyage,s.boat)==='J'&&!s.jars.includes(s.boat)){s.jars.push(s.boat);message='Firefly jar aboard.';}
 if(cell(s.voyage,s.boat)==='R'&&!s.refuges.includes(s.boat)){s.refuges.push(s.boat);s.oil++;message='Reed refuge: one fresh oil collected.';}
 if(advanceMoths(s))message+=' A moth swallowed a lantern.';
 if(s.moths.some(p=>dist(p,s.boat)<=1)){s.hull--;s.hits++;message+=' Moth wings struck the boat: hull −1.';}
 s.beacons=s.beacons.map(b=>({...b,life:b.life-1})).filter(b=>b.life>0);s.turn++;s.history.push(action);s.seen=[...new Set([...s.seen,...lit(s)])].sort((a,b)=>a-b);
 if(s.hull<=0){s.status='lost';message='The boat is swamped. Undo to change your light trail.';}
 else if(cell(s.voyage,s.boat)==='D'&&s.jars.length===points(s.voyage,'J').length){s.status='won';message='Every firefly is home. The marsh glows again.';}
 else if(s.turn>=180){s.status='lost';message='Nightfall. Undo or restart for a shorter crossing.';}
 s.message=message;return {ok:true,state:s,reason:message};
}
function medal(s){return s.status!=='won'?0:1+(s.hits===0?1:0)+(s.hits===0&&s.turn<=VOYAGES[s.voyage].par&&s.throws<=VOYAGES[s.voyage].throws?1:0);}
function replay(v,actions){if(!Array.isArray(actions)||actions.length>180||actions.some(a=>!ACTIONS.includes(a)))throw Error('Invalid route');let s=create(v);for(const a of actions){const r=step(s,a);if(!r.ok)throw Error('Invalid route step');s=r.state;}return s;}
function undo(s){return replay(s.voyage,s.history.slice(0,-1));}
function blank(){return {version:1,current:{voyage:0,actions:[]},records:Array(5).fill(null)};}
function unlocked(v){let n=0;while(n<4&&v.records[n])n++;return n;}
function decode(raw){const v=typeof raw==='string'?JSON.parse(raw):raw;if(!v||v.version!==1||!Array.isArray(v.records)||v.records.length!==5||!v.current)throw Error('Unreadable save');const records=v.records.map((r,i)=>{if(r===null)return null;const s=replay(i,r.actions);if(s.status!=='won')throw Error('Invalid record');return {actions:s.history,medals:medal(s),turns:s.turn,throws:s.throws};});const s=replay(v.current.voyage,v.current.actions);if(s.voyage>unlocked({records}))throw Error('Locked voyage');return {version:1,current:{voyage:s.voyage,actions:s.history},records};}
function record(v,s){const out=copy(v);out.current={voyage:s.voyage,actions:s.history};if(s.status==='won'){const old=out.records[s.voyage],m=medal(s);if(!old||m>old.medals||(m===old.medals&&s.turn<old.turns))out.records[s.voyage]={actions:s.history,medals:m,turns:s.turn,throws:s.throws};}return out;}
return {DIRS,ACTIONS,VOYAGES,W,H,xy,dist,cell,water,points,distances,lit,target,create,step,medal,replay,undo,blank,decode,unlocked,record};
});
