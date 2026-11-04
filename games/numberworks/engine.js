(function(root, factory) { const api = factory(); if (typeof module === 'object' && module.exports) module.exports = api; else root.Numberworks = api; })(globalThis, function() {
'use strict';
const VERSION = 1, LIMIT = 999999999999, WORLD = 1000000000, MAX_BUILDINGS = 8000;
const DIR = [[1,0],[0,1],[-1,0],[0,-1]], OPS = ['add','mul','sub','div','pow'];
const META = {
 belt:{name:'Conveyor',icon:'→',color:'#58666a',size:1,unlock:0,help:'Draw a route. Numbers travel toward its arrow. Side inputs merge fairly.'},
 extractor:{name:'Extractor',icon:'↓',color:'#deaa57',size:1,unlock:0,help:'Place on an unlocked numbered deposit. Output follows the arrow.'},
 add:{name:'Adder',icon:'+',color:'#6bafa2',size:2,unlock:1,help:'A + B. Feed the two amber input ports; take the teal output.'},
 junction:{name:'Junction',icon:'⑂',color:'#d2a065',size:1,unlock:3,help:'Splits packets between front and both sides. Click priority in the inspector to favour the front.'},
 bridge:{name:'Crossing',icon:'╬',color:'#93a2b4',size:1,unlock:4,help:'Independent straight horizontal and vertical lanes. Numbers never mix or turn.'},
 mul:{name:'Multiplier',icon:'×',color:'#819cd1',size:2,unlock:5,help:'A × B. Parallel machines increase throughput.'},
 storage:{name:'Reservoir',icon:'▤',color:'#bb9dcd',size:2,unlock:7,help:'Buffers up to 1,000 identical packets. The first packet sets the stored number.'},
 sub:{name:'Subtractor',icon:'−',color:'#d59385',size:2,unlock:8,help:'A − B. Input order matters. Negative numbers are supported.'},
 div:{name:'Divider',icon:'÷',color:'#b5ac6e',size:2,unlock:10,help:'Floor division: Q = floor(A/B), R = A − Q×B. Both outputs must drain, including zero remainders.'},
 pow:{name:'Power press',icon:'^',color:'#a894d0',size:2,unlock:11,help:'A to the power B. B must be 0–31. Invalid or oversized results stop with an explanation.'},
 bin:{name:'Recycler',icon:'◇',color:'#b5b9b1',size:1,unlock:4,help:'Discards unwanted packets, including divider remainders.'}
};
const CONTRACTS = [
 [1,10,'First delivery','Bring a stream of 1s to Dispatch.','add'],
 [2,24,'A meeting of ones','Combine two streams with an Adder.','extract2'],
 [3,30,'A little more','Keep useful old lines running.','junction'],
 [4,36,'Crossed paths','Make room for more than one production line.','bridge'],
 [6,40,'Multiples','Learn to reuse an intermediate number.','mul'],
 [9,48,'Square business','Build 3 × 3, or find another expression.','extract3'],
 [12,54,'A steady dozen','A reservoir can smooth out an uneven supply.','storage'],
 [15,60,'Room to adjust','Subtraction opens routes around awkward targets.','sub'],
 [25,64,'Five by five','Look beyond the starting deposits.','extract5'],
 [17,70,'An awkward prime','Try 3 × 6 − 1.','div'],
 [32,72,'Power supply','Two outputs make division a useful routing problem.','pow'],
 [49,76,'Seven squared','More deposits are now available.','extract9'],
 [64,80,'Small base, big result','A power press can replace a long chain.',''],
 [81,84,'Balance the line','Compare input rates with processing capacity.',''],
 [121,88,'Beyond the deposits','Make 11, then reuse it.',''],
 [127,92,'One short','A power of two minus one is a useful pattern.',''],
 [256,96,'Binary workshop','Copy working modules and feed every input.',''],
 [729,100,'A third power','Keep an eye on the exponent input.',''],
 [1000,104,'Decimal workshop','Build a reusable stream of 10s.',''],
 [1024,108,'Ten doublings','Choose between one power press and a modular chain.',''],
 [2025,112,'Forty-five squared','Build intermediates once, then distribute them.',''],
 [4096,116,'A busy floor','Speed upgrades and parallel lines work together.',''],
 [65536,120,'A bigger idea','The factory floor is your notebook.',''],
 [99991,128,'The general machine','Try 100000 − 9. Graduate, then keep building.','endless']
];
const PROJECTS=[
 {id:'twins',name:'Two lines, one factory',unlock:3,needs:{2:18,3:18},brief:'Keep two different numbers arriving. Share supply or build independent lines.'},
 {id:'squares',name:'The square works',unlock:9,needs:{9:24,16:24,25:24},brief:'Build a family of squares. Reuse intermediate numbers and balance the splitters.'},
 {id:'offset',name:'Odd jobs',unlock:11,needs:{17:24,19:24,23:24},brief:'Nearby primes reward a common base with small adjustments.'},
 {id:'powers',name:'Power station',unlock:12,needs:{64:30,81:30,125:30},brief:'Three power lines, three input balances. Decide where parallel machines help.'},
 {id:'primes',name:'One short',unlock:16,needs:{127:36,255:36,511:36},brief:'Design a reusable doubling network and subtract a steady stream of ones.'},
 {id:'network',name:'The general factory',unlock:24,needs:{1000:40,2025:40,4096:40,99991:40},brief:'Your final network must supply four very different numbers. Keep useful old modules working.'}
];
const RANKS=[
 {name:'First workshop',total:50,minimum:1,streams:1,rate:.25},
 {name:'Production floor',total:200,minimum:2,streams:2,rate:.4},
 {name:'Factory district',total:600,minimum:9,streams:3,rate:.6},
 {name:'Industrial powerhouse',total:1500,minimum:64,streams:3,rate:1},
 {name:'Number empire',total:4000,minimum:1000,streams:4,rate:1.5}
];
function rankProgress(s){const rank=s.career.rank||0,r=RANKS[rank];if(!r)return null;const counts=new Map();for(const e of s.recent)if(s.time-e.t<30&&e.v>=r.minimum)counts.set(e.v,(counts.get(e.v)||0)+1);const streams=[...counts.values()].filter(n=>n/30+1e-9>=r.rate).length;return {...r,rank,streamsReady:streams,totalReady:s.stats.delivered>=r.total,ready:s.time>=30&&s.stats.delivered>=r.total&&streams>=r.streams};}
function advanceRank(s){const p=rankProgress(s);if(!p?.ready)return false;s.career.rank=(s.career.rank||0)+1;s.career.vouchers+=1;s.events.push({kind:'rank',text:p.name+' · all machinery +15% base speed · 1 research voucher'});return true;}
function career(){return{active:null,completed:{},vouchers:0,rank:0};}
function startProject(s,id){const p=PROJECTS.find(p=>p.id===id);if(!p||(!s.sandbox&&s.level<p.unlock)||s.career.active)return false;s.career.active={id,started:s.time,delivered:{},pieces:s.buildings.length,ops:s.buildings.filter(n=>OPS.includes(n.type)).length};return true;}
function cancelProject(s){s.career.active=null;}
function projectDelivery(s,v){const a=s.career.active;if(!a)return;const p=PROJECTS.find(p=>p.id===a.id);if(!p.needs[v])return;a.delivered[v]=(a.delivered[v]||0)+1;if(Object.entries(p.needs).every(([v,n])=>(a.delivered[v]||0)>=n)){const previous=s.career.completed[p.id],record={seconds:Math.max(.05,s.time-a.started),pieces:a.pieces,ops:a.ops};if(!previous)s.career.vouchers+=2;s.career.completed[p.id]=previous?{seconds:Math.min(previous.seconds,record.seconds),pieces:Math.min(previous.pieces,record.pieces),ops:Math.min(previous.ops,record.ops)}:record;s.career.active=null;s.events.push({kind:'project',text:p.name+' completed'+(!previous?' · 2 research vouchers earned':' · personal bests updated')});}}
function useVoucher(s,type){if(s.career.vouchers<1||!unlocked(s,type)||!upgradeCost(s,type))return false;s.career.vouchers--;s.upgrades[type]++;return true;}
function lesson(s){
 if(s.sandbox)return null;
 if(s.level>=3){
 const lessons={3:['Split supply, do not duplicate it','A Junction shares one stream between outputs. Two equally busy branches each get roughly half the supply. Keep your 2 and 3 lines for the first engineering project.','junction'],4:['Cross without mixing','A Crossing carries two independent straight streams. Use it where a new route crosses an old one. A normal conveyor intersection merges numbers.','bridge'],5:['Multiply your possibilities','Make 9 with 3 × 3. Each cycle consumes one packet from BOTH inputs. Two extractors can feed a multiplier; faster belts alone cannot fix slow inputs.','mul'],6:['Upgrade the bottleneck','Research spends banked numbers, not your commission progress. Compare extractor, belt and machine rates before upgrading. Keep old lines supplying upgrade ingredients.','research'],7:['Buffer an uneven supply','A Reservoir stores one number type. It smooths bursts but cannot increase average production. Its first packet selects the number; flush it to change that number.','storage'],8:['Input order matters','For A − B, route the larger number into A when you want a positive result. Inspect a machine to see its inputs before connecting the output.','sub'],9:['Reuse a working module','Select a production line, copy it, then paste and rotate it. Save useful modules in the Workshop. Supply every copied input; a copied layout creates no free numbers.','select'],10:['Drain BOTH divider outputs','A ÷ B produces a whole quotient Q and remainder R. Even a zero remainder needs an exit. Send unwanted remainders to a Recycler or the divider stops.','div'],11:['Small input, large result','The Power press computes A to the power B. Try 2 to the power 5 for 32. Keep exponent inputs controlled; results have a numeric safety limit.','pow'],12:['Plan the next factory','The roadmap previews upcoming targets. Reuse bases such as 2, 3 and 10, branch into several products, and use engineering projects to test your network.','goals']};
 const l=lessons[s.level];if(!l)return null;return{step:s.level+6,title:l[0],text:l[1],tool:META[l[2]]?l[2]:'inspect',action:['research','goals'].includes(l[2])?l[2]:null,x:0,y:1};
 }
 if(s.level===0){const mine=s.buildings.find(n=>n.type==='extractor'&&n.x===-9&&n.y===1);if(!mine)return{step:1,title:'Place your first extractor',text:'Choose Extractor and click the outlined 1. Its arrow points right. Buildings are free.',tool:'extractor',x:-9,y:1};if(mine.dir!==0)return{step:2,title:'Point the extractor toward Dispatch',text:'Click the highlighted extractor with Inspect, then Rotate until its arrow points right. The output must face the conveyor.',tool:'inspect',x:mine.x,y:mine.y,machine:mine.id};
 if(!(s.delivered[1]>0)){const g=grid(s);let gap=null;for(let x=-8;x<0;x++){const n=g.get(key(x,1));if(!n||n.type!=='belt'||n.dir!==0){gap=x;break}}return gap!==null?{step:2,title:gap===-8?'Connect your first line':'Close the gap in your line',text:'Choose Conveyor. Drag from the highlighted tile to Dispatch’s left edge. Arrows should point right. You can draw over a belt to correct its direction.',tool:'belt',x:gap,y:1,to:[-1,1]}:{step:3,title:'Watch your first delivery',text:'Your route is connected. Follow a number into Dispatch. Ten deliveries unlock the Adder; build another line while this one runs.',tool:'inspect',x:-1,y:1};}return{step:3,title:'Your first line works',text:'Ten 1s unlock the Adder. Let the line run. You can pause with Space and undo construction with Ctrl+Z.',tool:'inspect',x:-9,y:1};}
 if(s.level===1){const n=s.buildings.find(n=>n.type==='add');if(!n)return{step:4,title:'Turn two ones into a two',text:'Place an Adder in the outlined space. It needs one stream of 1s at A and another at B. The output is 2.',tool:'add',x:-4,y:3,size:2};const missing=!n.a.length&&!n.cycles?'a':!n.b.length&&!n.cycles?'b':null;if(missing){const p=port(n,missing),d=DIR[p.dir];return{step:missing==='a'?5:6,title:'Feed input '+missing.toUpperCase(),text:'Route a stream of 1s into the highlighted '+missing.toUpperCase()+' port. Use another 1 deposit for the second stream. The final belt snaps toward an adjacent input.',tool:'belt',x:p.p[0]+d[0],y:p.p[1]+d[1],machine:n.id};}return{step:7,title:'Deliver the twos',text:'Route the teal output to Dispatch. If production stops, click the Adder: it tells you which input or exit is blocked.',tool:'belt',x:port(n,'out').p[0]+DIR[n.dir][0],y:port(n,'out').p[1]+DIR[n.dir][1]};}
 return{step:8,title:'Build your own solution',text:'2 deposits are now unlocked. Make 3 using 1 + 2. Next you get Junctions; then choose your first optional project in Goals. Research upgrades old lines.',tool:'inspect',x:0,y:1};
}
const copy = x => JSON.parse(JSON.stringify(x));
const key = (x,y) => `${x},${y}`;
const integer = (v,min=-LIMIT,max=LIMIT) => Number.isSafeInteger(v) && v>=min && v<=max;
function hash(x,y,seed) { let h=Math.imul(x ^ seed,374761393)^Math.imul(y,668265263); h=Math.imul(h^(h>>>13),1274126177); return (h^(h>>>16))>>>0; }
const FIXED = [[-9,1,1],[-9,5,1],[-9,-3,2],[-13,1,1],[-5,-7,3],[-5,9,4],[7,-5,5],[8,7,6],[-15,-7,7],[13,1,8],[3,-11,9]];
function deposit(x,y,seed=2147) {
 for(const [a,b,n] of FIXED) if(a===x&&b===y) return n;
 if(Math.abs(x)<17&&Math.abs(y)<13) return 0;
 const cx=Math.floor(x/7), cy=Math.floor(y/7), h=hash(cx,cy,seed);
 return x===cx*7+1+h%4 && y===cy*7+1+(h>>>4)%4 ? 1+(h>>>9)%9 : 0;
}
function maxExtract(s) { return s.sandbox ? 9 : s.level>=12?9:s.level>=9?5:s.level>=6?3:s.level>=2?2:1; }
function unlocked(s,type) { return !!META[type] && (s.sandbox || s.level>=META[type].unlock); }
function contract(s) {
 if(s.level<CONTRACTS.length) { const [value,count,title,hint,reward]=CONTRACTS[s.level];return{value,count,title,hint,reward}; }
 const i=s.level-CONTRACTS.length,h=hash(i,41,s.seed), base=2+h%8, exp=3+(h>>>4)%4, offset=1+(h>>>9)%19;
 return{value:base**exp+offset,count:128+Math.min(i,24)*8,title:`Open commission ${i+1}`,hint:`One route is ${base}^${exp} + ${offset}.`,reward:''};
}
function roadmap(s,count=6){return Array.from({length:count},(_,i)=>{const level=s.level+i,c=contract({...s,level});return {...c,level,delivered:Math.min(c.count,s.delivered[c.value]||0)};});}
function targetFlow(s){const c=contract(s),perSecond=rate(s,c.value),remaining=Math.max(0,c.count-(s.delivered[c.value]||0));return {perSecond,remaining,seconds:perSecond>0?remaining/perSecond:null};}
function rewardText(reward) { if(META[reward]) return META[reward].name+' unlocked'; if(reward.startsWith('extract'))return 'Deposits up to '+reward.slice(7)+' unlocked';return reward==='endless'?'Graduate · open commissions unlocked':'New commission'; }
function create(seed=2147,sandbox=false) { return{version:VERSION,seed, sandbox,career:career(),level:0,buildings:[],nextId:1,delivered:{},bank:{},upgrades:{belt:0,extractor:0,add:0,mul:0,sub:0,div:0,pow:0},time:0,tick:0,markers:[],blueprints:[],stats:{extracted:0,processed:0,recycled:0,delivered:0},events:[],recent:[],camera:{x:-3,y:2,zoom:1},tutorial:0}; }
function make(type,x,y,dir=0,id=0) {return{id,type,x,y,dir, q:[],a:[],b:[],out:[],rem:[],lanes:[[],[]],progress:0,rr:0,priority:false,count:0,value:null,error:'',cycles:0};}
function local(n,x,y) { const z=META[n.type].size;let a=x,b=y; for(let r=0;r<n.dir;r++)[a,b]=[z-1-b,a];return[n.x+a,n.y+b]; }
function cells(n) {const z=META[n.type].size,r=[];for(let y=0;y<z;y++)for(let x=0;x<z;x++)r.push([n.x+x,n.y+y]);return r;}
function hub(x,y){return x>=0&&x<3&&y>=0&&y<3;}
function grid(s){const m=new Map();for(const n of s.buildings)for(const[x,y]of cells(n))m.set(key(x,y),n);return m;}
function available(s,type,x,y,dir=0,ignore=new Set()) {
 if(!unlocked(s,type))return 'Not unlocked yet';
 if(!integer(x,-WORLD,WORLD-2)||!integer(y,-WORLD,WORLD-2)||!integer(dir,0,3))return 'Coordinate exceeds numeric safety range';
 if(s.buildings.length>=MAX_BUILDINGS)return 'Factory limit reached';
 const n=make(type,x,y,dir),g=grid(s);for(const[a,b]of cells(n)){if(hub(a,b))return 'Dispatch needs this space';const hit=g.get(key(a,b));if(hit&&!ignore.has(hit.id))return 'Space is occupied';}
 if(type==='extractor'){const v=deposit(x,y,s.seed);if(!v)return 'Extractors need a numbered deposit';if(v>maxExtract(s))return `Deposit ${v} is locked`;}
 return '';
}
function place(s,type,x,y,dir=0){const error=available(s,type,x,y,dir);if(error)return{ok:false,error};const n=make(type,x,y,dir,s.nextId++);s.buildings.push(n);return{ok:true,node:n};}
function layout(s){return s.buildings.map(n=>({id:n.id,type:n.type,x:n.x,y:n.y,dir:n.dir,priority:n.priority}));}
function restoreLayout(s,arr){const existing=new Map(s.buildings.map(n=>[n.id,n]));s.buildings=arr.map(a=>{const old=existing.get(a.id);return old&&old.type===a.type&&old.x===a.x&&old.y===a.y&&old.dir===a.dir?Object.assign(old,{priority:!!a.priority}):Object.assign(make(a.type,a.x,a.y,a.dir,a.id),{priority:!!a.priority})});s.nextId=Math.max(s.nextId,...arr.map(n=>n.id+1));}
function remove(s,ids){const set=new Set(ids);s.buildings=s.buildings.filter(n=>!set.has(n.id));}
function clearPackets(s,ids=null){const set=ids?new Set(ids):null;for(const n of s.buildings)if(!set||set.has(n.id)){n.q=[];n.a=[];n.b=[];n.out=[];n.rem=[];n.lanes=[[],[]];n.progress=0;n.count=0;n.value=null;n.error='';}}
function beltPath(ax,ay,bx,by,verticalFirst=false,reverse=false){let p=[[ax,ay]],x=ax,y=ay;const walkX=()=>{while(x!==bx){x+=Math.sign(bx-x);p.push([x,y])}},walkY=()=>{while(y!==by){y+=Math.sign(by-y);p.push([x,y])}};if(verticalFirst){walkY();walkX()}else{walkX();walkY()}if(reverse)p.reverse();return p;}
function drawBelt(s,path,lastDir=0,autoCross=true){const placed=[],errors=[];if(path.length>1024)return{placed,errors:['Route too long']};for(let i=0;i<path.length;i++){const[x,y]=path[i];if(hub(x,y))continue;const next=path[i+1],prev=path[i-1];let dir=next?DIR.findIndex(d=>d[0]===next[0]-x&&d[1]===next[1]-y):prev?DIR.findIndex(d=>d[0]===x-prev[0]&&d[1]===y-prev[1]):lastDir;if(i===path.length-1){for(let d=0;d<4;d++){const tx=x+DIR[d][0],ty=y+DIR[d][1],target=grid(s).get(key(tx,ty));if(hub(tx,ty)||target&&(['add','mul','sub','div','pow','storage'].includes(target.type))&&(['a',...(target.type==='storage'?[]:['b'])].some(p=>isPort(target,p,tx,ty,d)))){dir=d;break}}}if(dir<0)continue;const n=grid(s).get(key(x,y));if(n){if(n.type==='belt'){if(autoCross&&unlocked(s,'bridge')&&n.dir%2!==dir%2&&i>0&&i<path.length-1&&prev[0]-x===x-next[0]&&prev[1]-y===y-next[1]){n.type='bridge';n.q=[];n.lanes=[[],[]];placed.push(n.id)}else if(n.dir!==dir){n.dir=dir;placed.push(n.id)}}continue}const r=place(s,'belt',x,y,dir);if(r.ok)placed.push(r.node.id);else errors.push(r.error)}return{placed,errors};}
function calculate(type,a,b){if(!integer(a)||!integer(b))return{error:'Invalid input'};let v,r;
 if(type==='add')v=a+b;else if(type==='mul')v=a*b;else if(type==='sub')v=a-b;else if(type==='div'){if(b===0)return{error:'B is zero · clear or change input'};v=Math.floor(a/b);r=a-v*b;}
 else if(type==='pow'){if(!integer(b,0,31))return{error:'Exponent B must be 0–31'};let z=1n;for(let i=0;i<b;i++){z*=BigInt(a);if(z>BigInt(LIMIT)||z< -BigInt(LIMIT))return{error:'Result exceeds 999,999,999,999'};}v=Number(z);}else return{error:'Unknown operator'};
 if(!integer(v)||r!==undefined&&!integer(r))return{error:'Result exceeds 999,999,999,999'};return{value:v,remainder:r};
}
function speed(s,type){const tier=s.upgrades[type]||0,boost=1+(s.career.rank||0)*.15;return boost*(type==='belt'?2+tier:type==='extractor'?1+tier*.75:(type==='pow'?.4:type==='div'?.6:1)*(1+tier*.6));}
function upgradeCost(s,type){const t=s.upgrades[type];if(t===undefined||t>=12)return null;if(t>=5){const bases=[81,121,256,729,1024,4096,65536];return {[bases[t-5]]:120+(t-5)*40,[type==='belt'?32:type==='extractor'?49:64]:60+(t-5)*20};}const values=type==='belt'?[1,2,6,12,32]:type==='extractor'?[2,3,9,15,49]:[2,4,12,25,64];const costs={[values[t]]:20+t*20};if(t>=2)costs[values[t-1]]=15+t*10;return costs;}
function buyUpgrade(s,type){const costs=upgradeCost(s,type);if(!costs||!unlocked(s,type)||Object.entries(costs).some(([v,n])=>(s.bank[v]||0)<n))return false;for(const[v,n]of Object.entries(costs))s.bank[v]-=n;s.upgrades[type]++;return true;}
function receive(s,v){s.delivered[v]=(s.delivered[v]||0)+1;s.bank[v]=(s.bank[v]||0)+1;s.stats.delivered++;s.recent.push({v,t:s.time});projectDelivery(s,v);let count=0;while(!s.sandbox&&(s.delivered[contract(s).value]||0)>=contract(s).count&&count++<10){const c=contract(s);s.level++;s.events.push({kind:'level',level:s.level,text:rewardText(c.reward)});}}
function packet(v,dir=0){return{v,age:0,dir};}
function port(n,which){if(which==='a')return{p:local(n,0,0),dir:(2+n.dir)%4};if(which==='b')return{p:local(n,0,1),dir:(2+n.dir)%4};if(which==='rem')return{p:local(n,1,1),dir:n.dir};return{p:local(n,1,0),dir:n.dir};}
function isPort(n,which,x,y,d){const p=port(n,which);return p.p[0]===x&&p.p[1]===y&&(d+2)%4===p.dir;}
function accept(s,g,x,y,d,p,commit){if(hub(x,y)){if(commit)receive(s,p.v);return true}const n=g.get(key(x,y));if(!n)return false;
 if(n.type==='bin'){if(commit)s.stats.recycled++;return true}
 if(n.type==='extractor')return false;
 if(n.type==='bridge'){const lane=n.lanes[d%2];if(lane.length>=1||lane.length&&lane[0].dir!==d)return false;if(commit)lane.push(packet(p.v,d));return true}
 if(n.type==='belt'||n.type==='junction'){if(n.dir===(d+2)%4||n.q.length>=1)return false;if(commit)n.q.push(packet(p.v,d));return true}
 if(n.type==='storage'){if(!isPort(n,'a',x,y,d)||n.count>=1000||n.value!==null&&n.value!==p.v)return false;if(commit){n.value=p.v;n.count++;}return true}
 if(OPS.includes(n.type)){let q=isPort(n,'a',x,y,d)?n.a:isPort(n,'b',x,y,d)?n.b:null;if(!q||q.length>=5)return false;if(commit)q.push(p.v);return true}return false;}
function outputSources(n){if(n.type==='belt'||n.type==='extractor'||n.type==='junction')return[{q:n.q,p:[n.x,n.y],dirs:n.type==='junction'?[n.dir,(n.dir+1)%4,(n.dir+3)%4]:[n.dir]}];if(n.type==='bridge')return n.lanes.map(q=>({q,p:[n.x,n.y],dirs:q.length?[q[0].dir]:[]}));if(n.type==='storage')return[{q:n.out,...{p:port(n,'out').p,dirs:[n.dir]}}];if(OPS.includes(n.type)){const r=[{q:n.out,p:port(n,'out').p,dirs:[n.dir]}];if(n.type==='div')r.push({q:n.rem,p:port(n,'rem').p,dirs:[n.dir]});return r}return[];}
function step(s,dt=.05){dt=Math.max(0,Math.min(.1,dt));s.time+=dt;s.tick++;if(s.career.active){const a=s.career.active;a.pieces=Math.max(a.pieces||0,s.buildings.length);a.ops=Math.max(a.ops||0,s.buildings.filter(n=>OPS.includes(n.type)).length);}s.recent=s.recent.filter(e=>s.time-e.t<30);const g=grid(s),beltInterval=1/speed(s,'belt');
 for(const n of s.buildings){for(const src of outputSources(n))for(const p of src.q)p.age+=dt;
  if(n.type==='extractor'){if(n.q.length<1){n.progress+=dt*speed(s,'extractor');if(n.progress>=1){n.q.push(packet(deposit(n.x,n.y,s.seed),n.dir));n.progress-=1;s.stats.extracted++;}}else n.progress=Math.min(n.progress,1);}
  if(n.type==='storage'&&n.count&&n.out.length<1){n.out.push(packet(n.value,n.dir));n.count--;if(!n.count)n.value=null;}
  if(OPS.includes(n.type)){n.error='';if(n.a.length&&n.b.length&&!n.out.length&&!n.rem.length){const r=calculate(n.type,n.a[0],n.b[0]);if(r.error){n.error=r.error;n.progress=0;}else{n.progress+=dt*speed(s,n.type);if(n.progress>=1){n.a.shift();n.b.shift();n.out.push(packet(r.value,n.dir));if(n.type==='div')n.rem.push(packet(r.remainder,n.dir));n.progress=0;n.cycles++;s.stats.processed++;}}}}
 }
 // Rotate the request order each tick. Packets received this tick have age 0 and cannot move twice.
 const nodes=s.buildings,offset=nodes.length?s.tick%nodes.length:0;
 for(let j=0;j<nodes.length;j++){const n=nodes[(j+offset)%nodes.length];for(const src of outputSources(n)){const p=src.q[0];if(!p||p.age+1e-9<beltInterval)continue;let dirs=src.dirs.slice();if(n.type==='junction'&&!n.priority){const shift=n.rr%dirs.length;dirs=dirs.slice(shift).concat(dirs.slice(0,shift));}for(const d of dirs){const x=src.p[0]+DIR[d][0],y=src.p[1]+DIR[d][1];if(accept(s,g,x,y,d,p,false)){src.q.shift();accept(s,g,x,y,d,p,true);n.rr=(src.dirs.indexOf(d)+1)%Math.max(1,src.dirs.length);break;}}}}
 advanceRank(s);return s;
}
function rate(s,value=null){const span=Math.max(1,Math.min(30,s.time));return s.recent.filter(e=>value===null||e.v===value).length/span;}
function status(s,n){if(n.error)return n.error;if(n.type==='extractor')return n.q.length?'Output waiting':'Extracting '+deposit(n.x,n.y,s.seed);if(OPS.includes(n.type)){if(n.out.length||n.rem.length)return 'Output waiting';if(!n.a.length&&!n.b.length)return 'Needs inputs A and B';if(!n.a.length)return 'Needs input A';if(!n.b.length)return 'Needs input B';return 'Processing'}if(n.type==='storage')return n.count?`${n.count} × ${n.value} stored`:'Empty reservoir';if(n.type==='bridge')return 'Two independent straight lanes';if(n.type==='bin')return 'Recycles incoming numbers';return n.q.length?'Packet travelling / waiting':'Ready for packets';}
function blueprint(s,ids,name='Module'){const set=new Set(ids),nodes=s.buildings.filter(n=>set.has(n.id));if(!nodes.length)return null;const minX=Math.min(...nodes.map(n=>n.x)),minY=Math.min(...nodes.map(n=>n.y));return{name:name.slice(0,40),nodes:nodes.map(n=>({type:n.type,x:n.x-minX,y:n.y-minY,dir:n.dir,priority:n.priority}))};}
function rotateBlueprint(bp){const maxY=Math.max(...bp.nodes.map(n=>n.y+META[n.type].size));return{name:bp.name,nodes:bp.nodes.map(n=>({...n,x:maxY-n.y-META[n.type].size,y:n.x,dir:(n.dir+1)%4}))};}
function stamp(s,bp,x,y){if(!bp||!Array.isArray(bp.nodes)||bp.nodes.length>1000)return{ok:false,error:'Invalid module'};const temp=copy(s),ids=[];for(const n of bp.nodes){const r=place(temp,n.type,n.x+x,n.y+y,n.dir);if(!r.ok)return r;r.node.priority=!!n.priority;ids.push(r.node.id)}s.buildings=temp.buildings;s.nextId=temp.nextId;return{ok:true,ids};}
function nearest(s,value,cx=0,cy=0){let best=null;for(let y=Math.max(-WORLD,Math.floor(cy)-70);y<Math.min(WORLD,cy+70);y++)for(let x=Math.max(-WORLD,Math.floor(cx)-70);x<Math.min(WORLD,cx+70);x++)if(deposit(x,y,s.seed)===value){const d=(x-cx)**2+(y-cy)**2;if(!best||d<best.d)best={x,y,d}}return best;}
function encode(s){const d=copy(s);d.events=[];return JSON.stringify(d);}
function decode(raw){if(typeof raw!=='string'||raw.length>5000000)throw Error('Save is too large');const s=JSON.parse(raw);if(!s||s.version!==VERSION||!integer(s.seed,1,999999)||typeof s.sandbox!=='boolean'||!integer(s.level,0,100000)||!Array.isArray(s.buildings)||s.buildings.length>MAX_BUILDINGS||!integer(s.nextId,1,100000000)||!Number.isFinite(s.time)||s.time<0||!integer(s.tick,0,Number.MAX_SAFE_INTEGER))throw Error('Invalid factory save');
 if(s.career===undefined)s.career=career();if(s.career&&s.career.rank===undefined)s.career.rank=0;
 if(!s.career||!integer(s.career.rank,0,RANKS.length))throw Error("Invalid factory rank");
 if(!s.career||!integer(s.career.vouchers,0,100)||!s.career.completed||typeof s.career.completed!=='object'||Array.isArray(s.career.completed))throw Error('Invalid career');
 for(const [id,r]of Object.entries(s.career.completed)){if(!PROJECTS.some(p=>p.id===id)||!r||!Number.isFinite(r.seconds)||r.seconds<0||!integer(r.pieces,0,MAX_BUILDINGS)||!integer(r.ops,0,MAX_BUILDINGS))throw Error('Invalid project record');}
 const active=s.career.active;if(active!==null){active.pieces??=s.buildings.length;active.ops??=s.buildings.filter(n=>OPS.includes(n.type)).length;const p=PROJECTS.find(p=>p.id===active?.id);if(!integer(active.pieces,0,MAX_BUILDINGS)||!integer(active.ops,0,MAX_BUILDINGS)||!p||!Number.isFinite(active.started)||active.started<0||active.started>s.time||!active.delivered||typeof active.delivered!=='object'||Array.isArray(active.delivered)||Object.entries(active.delivered).some(([v,n])=>!p.needs[v]||!integer(n,0,Number.MAX_SAFE_INTEGER)))throw Error('Invalid active project');}
 const fresh=create(s.seed,s.sandbox);fresh.level=s.level;const occupied=new Set(),ids=new Set();
 for(const n of s.buildings){if(!META[n.type]||!unlocked(fresh,n.type)||!integer(n.id,1,s.nextId-1)||ids.has(n.id)||!integer(n.x,-WORLD,WORLD-2)||!integer(n.y,-WORLD,WORLD-2)||!integer(n.dir,0,3))throw Error('Invalid building');ids.add(n.id);for(const[x,y]of cells(n)){if(hub(x,y)||occupied.has(key(x,y)))throw Error('Overlapping building');occupied.add(key(x,y));}if(n.type==='extractor'&&(!deposit(n.x,n.y,s.seed)||deposit(n.x,n.y,s.seed)>maxExtract(fresh)))throw Error('Invalid extractor');for(const k of ['q','out','rem']){if(!Array.isArray(n[k])||n[k].length>1)throw Error('Invalid packet buffer');for(const p of n[k])if(!integer(p.v)||!Number.isFinite(p.age)||p.age<0||!integer(p.dir,0,3))throw Error('Invalid packet');}for(const k of ['a','b'])if(!Array.isArray(n[k])||n[k].length>5||n[k].some(v=>!integer(v)))throw Error('Invalid input buffer');if(!Array.isArray(n.lanes)||n.lanes.length!==2||n.lanes.some(q=>!Array.isArray(q)||q.length>1||q.some(p=>!integer(p.v)||!Number.isFinite(p.age)||p.age<0||!integer(p.dir,0,3))))throw Error('Invalid crossing');if(!Number.isFinite(n.progress)||n.progress<0||n.progress>2||!integer(n.rr,0,4)||typeof n.priority!=='boolean'||!integer(n.count,0,1000)||n.value!==null&&!integer(n.value)||n.count>0&&n.value===null||typeof n.error!=='string'||!integer(n.cycles,0,Number.MAX_SAFE_INTEGER))throw Error('Invalid machine state');}
 for(const field of ['delivered','bank']){if(!s[field]||typeof s[field]!=='object'||Array.isArray(s[field])||Object.keys(s[field]).length>20000)throw Error('Invalid delivery book');for(const[k,v]of Object.entries(s[field]))if(!integer(Number(k))||!integer(v,0,Number.MAX_SAFE_INTEGER))throw Error('Invalid delivery count');}
 if(!s.upgrades||Object.keys(fresh.upgrades).some(k=>!integer(s.upgrades[k],0,12)))throw Error('Invalid upgrade');if(!s.stats||Object.keys(fresh.stats).some(k=>!integer(s.stats[k],0,Number.MAX_SAFE_INTEGER)))throw Error('Invalid statistics');
 if(!Array.isArray(s.markers)||s.markers.length>100||s.markers.some(m=>!integer(m.x,-WORLD,WORLD)||!integer(m.y,-WORLD,WORLD)||typeof m.text!=='string'||m.text.length>60))throw Error('Invalid marker');
 if(!Array.isArray(s.blueprints)||s.blueprints.length>20)throw Error('Invalid blueprint library');for(const bp of s.blueprints){if(typeof bp.name!=='string'||bp.name.length>40||!Array.isArray(bp.nodes)||!bp.nodes.length||bp.nodes.length>1000||bp.nodes.some(n=>!META[n.type]||!integer(n.x,0,WORLD*2)||!integer(n.y,0,WORLD*2)||!integer(n.dir,0,3)))throw Error('Invalid blueprint');}
 if(!s.camera||!Number.isFinite(s.camera.x)||!Number.isFinite(s.camera.y)||Math.abs(s.camera.x)>WORLD||Math.abs(s.camera.y)>WORLD||!Number.isFinite(s.camera.zoom)||s.camera.zoom<.25||s.camera.zoom>2.5)throw Error('Invalid camera');
 s.events=[];s.recent=[];s.tutorial=integer(s.tutorial,0,10)?s.tutorial:0;return s;
}
return{RANKS,rankProgress,advanceRank,roadmap,targetFlow,PROJECTS,career,startProject,cancelProject,useVoucher,lesson,VERSION,LIMIT,WORLD,MAX_BUILDINGS,DIR,OPS,META,CONTRACTS,copy,key,deposit,maxExtract,unlocked,contract,rewardText,create,make,local,cells,hub,grid,available,place,layout,restoreLayout,remove,clearPackets,beltPath,drawBelt,calculate,speed,upgradeCost,buyUpgrade,receive,packet,port,step,rate,status,blueprint,rotateBlueprint,stamp,nearest,encode,decode};
});
