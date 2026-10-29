(function(root){'use strict';
const KEY='study-desk-cairn-and-cord-v1';
// Coordinates are fictional climbing-space units, not real climbing advice.
const make=(id,x,y,kind='hold',extra={})=>({id,x,y,kind,...extra});
const ROUTES=[
 {name:'The Warmup Wall',subtitle:'Learn the rope. Find the little cairn.',sky:'#dccbb2',rock:'#886e5d',wind:[0],holds:[make('base',0,0,'ledge'),make('a',0,1,'bolt'),make('b',1,2),make('s',-1,2,'hold',{stone:true}),make('c',0,3,'ledge'),make('d',1,4,'bolt'),make('e',0,5),make('top',0,6,'summit')]},
 {name:'The Fox Traverse',subtitle:'Cross the wall before gaining height.',sky:'#bed5cd',rock:'#667e75',wind:[0,1,0],holds:[make('base',0,0,'ledge'),make('a',-1,1,'bolt'),make('b',-2,2),make('s',-3,3,'hold',{stone:true}),make('c',-1,3,'ledge'),make('d',0,4,'bolt'),make('e',1,4),make('f',2,5,'rough'),make('top',2,6,'summit')]},
 {name:'Copper Teeth',subtitle:'Rough holds take extra grip. Chalk has limits.',sky:'#e0ba91',rock:'#976a57',wind:[0,0,1,0],holds:[make('base',0,0,'ledge'),make('a',1,1,'bolt'),make('b',1,2,'rough'),make('s',2,3,'rough',{stone:true}),make('c',0,3,'ledge'),make('d',-1,4,'bolt'),make('e',-2,5,'rough'),make('f',-1,6),make('top',0,7,'summit')]},
 {name:'The Blue Hour',subtitle:'Wind rises on exposed holds. Watch the next gust.',sky:'#9caebe',rock:'#526279',wind:[0,2,1,0],holds:[make('base',0,0,'ledge'),make('a',-1,1,'bolt'),make('b',0,2,'hold',{exposed:true}),make('s',1,2,'hold',{stone:true,exposed:true}),make('c',0,3,'ledge'),make('d',1,4,'bolt'),make('e',2,5,'rough',{exposed:true}),make('f',1,6,'ledge'),make('g',0,7,'bolt'),make('h',-1,8,'hold',{exposed:true}),make('top',0,9,'summit')]}
];
// Optional outcrops need an anchored traverse; the original summit paths stay intact.
[[3.2,3.6],[2.5,3.2],[-3.2,3.4],[-2.5,6.5]].forEach(([x,y],i)=>ROUTES[i].holds.push(make('survey',x,y,'sample')));
const clone=x=>JSON.parse(JSON.stringify(x)),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),hold=(s,id=s.at)=>ROUTES[s.route].holds.find(h=>h.id===id);
function fresh(route=0){if(!Number.isInteger(route)||!ROUTES[route])throw Error('Unknown route');return{route,at:'base',anchors:['base'],paid:2,grip:10,chalk:2,pitons:3,health:3,slips:0,moves:0,stone:false,sample:false,tethered:false,phase:'climb',log:[],message:'Select a nearby hold. Pay out rope if it is too tight.'};}
function length(s,target=hold(s)){let n=0;for(let i=1;i<s.anchors.length;i++)n+=dist(hold(s,s.anchors[i-1]),hold(s,s.anchors[i]));return n+dist(hold(s,s.anchors.at(-1)),target);}
function risk(s,target){const anchor=hold(s,s.anchors.at(-1)),slack=Math.max(0,s.paid-length(s,target));return Math.max(0,2*Math.max(0,target.y-anchor.y)+slack);}
function cost(s,target){return Math.ceil(dist(hold(s),target))+(target.kind==='rough'?2:0)+(target.exposed?ROUTES[s.route].wind[s.moves%ROUTES[s.route].wind.length]:0);}
function step(input,a){const s=clone(input);const fail=reason=>({ok:false,reason,state:input});if(s.phase!=='climb')return fail('This climb has ended. Replay or choose the next route.');if(!a||typeof a.type!=='string')return fail('Choose a climbing action.');if(s.log.length>=300)return fail('Route notebook full. Restart this climb.');
 if(['move','traverse','haul'].includes(a.type)){
  const from=hold(s),anchor=hold(s,s.anchors.at(-1)),to=a.type==='haul'?anchor:hold(s,a.id);
  if(!to||to.id===from.id)return fail('Choose a different hold.');
  if(a.type==='move'){
   if(to.kind==='sample')return fail('This outcrop needs a rope traverse from an anchor.');
   if(dist(from,to)>1.51)return fail('That hold is out of reach.');
  }else if(a.type==='traverse'){
   if(s.at!==anchor.id)return fail('Stand at your latest anchor. Set an anchor here first.');
   if(to.y>anchor.y||dist(from,to)>3.2)return fail('Traverse at or below your anchor, within 3.2 metres.');
  }else if(!s.tethered)return fail('Haul back is available after a rope traverse.');
  if(length(s,to)>s.paid+1e-7)return fail('Rope too tight. Pay out a metre or change your route.');
  const need=a.type==='haul'?2:cost(s,to);s.moves++;s.tethered=false;
  if(s.grip<need){const drop=risk(s,to);s.health-=drop>4?2:1;s.slips++;s.at=s.anchors.at(-1);s.grip=6;s.paid=Math.max(2,Math.ceil(length(s)));s.message='Grip ran out. '+(drop>4?'A long fall cost two hearts.':'The rope caught a short fall.');if(s.health<=0){s.health=0;s.phase='lost';s.message+=' Return to base and try another plan.';}}
  else{s.at=to.id;s.grip-=need;s.tethered=a.type==='traverse';if(to.stone)s.stone=true;if(to.kind==='sample')s.sample=true;
   s.message=to.kind==='sample'?'Survey rubbing packed. Haul back costs 2 grip; chalk first if needed.':a.type==='haul'?'Back at the anchor. Plan your next pitch.':to.kind==='ledge'?'A safe ledge. Rest, then belay here to reclaim rope and pitons.':to.kind==='bolt'?'Sound rock: set an anchor to unlock a rope traverse.':'Look for your next hold.';
   if(to.kind==='summit'){s.phase='won';s.message=s.stone?'Summit reached — cairn stone safely delivered.':'Summit reached. Replay to bring the cairn stone.';if(s.sample)s.message+=' Survey stamp earned!';}}
 }else if(a.type==='rope'){
  if(a.delta!==1&&a.delta!==-1)return fail('Adjust one metre at a time.');const n=s.paid+a.delta;if(n<2||n>9)return fail('Rope payout must stay between 2 and 9 metres.');if(n+1e-7<length(s))return fail('The rope is already taut.');s.paid=n;s.message=a.delta>0?'One metre paid out. Extra slack means a longer fall.':'One metre reeled in.';
 }else if(a.type==='clip'){
  const h=hold(s);if(h.kind!=='bolt'&&h.kind!=='ledge')return fail('Place anchors only on sound marked rock or ledges.');if(s.anchors.includes(s.at))return fail('This hold is already anchored.');if(!s.pitons)return fail('No pitons left. Belay from a ledge to reclaim them.');s.anchors.push(s.at);s.pitons--;s.tethered=false;s.message='Anchor set. Traverse sideways from here, or climb higher.';
 }else if(a.type==='rest'){
  if(s.grip===10)return fail('Your grip is already full.');if(hold(s).kind==='ledge'){s.grip=10;s.message='A full rest on the ledge.';}else{if(!s.chalk)return fail('No chalk left. Find a ledge for a full rest.');s.chalk--;s.grip=Math.min(10,s.grip+5);s.message='Chalk restores five grip. Save some for the steep section.';}
 }else if(a.type==='belay'){
  if(hold(s).kind!=='ledge')return fail('Belay changes need a broad ledge.');if(s.anchors.length===1&&s.anchors[0]===s.at)return fail('Already belaying from here.');s.anchors=[s.at];s.tethered=false;s.pitons=3;s.paid=2;s.message='New belay established. Rope and pitons reclaimed.';
 }else return fail('Unknown action.');
 s.log.push(['move','traverse'].includes(a.type)?{type:a.type,id:a.id}:a.type==='rope'?{type:'rope',delta:a.delta}:{type:a.type});return{ok:true,state:s};
}
function preview(s,a){const result=step(s,a);if(!result.ok)return{ok:false,reason:result.reason};const n=result.state;return{ok:true,at:n.at,grip:n.grip,health:n.health,paid:n.paid,slip:n.slips>s.slips,phase:n.phase,stone:n.stone,sample:n.sample,tethered:n.tethered,rope:length(n),nextWind:ROUTES[n.route].wind[n.moves%ROUTES[n.route].wind.length]};}
const medals=s=>s.phase==='won'?1+Number(s.stone)+Number(s.slips===0):0;
function replay(route,log){if(!Array.isArray(log)||log.length>300)throw Error('Invalid route log');let s=fresh(route);for(const a of log){const r=step(s,a);if(!r.ok)throw Error('Invalid recorded action');s=r.state;}return s;}
function newBook(){return{version:1,run:fresh(),records:[null,null,null,null],surveys:[null,null,null,null]};}
function unlocked(book,i){return Number.isInteger(i)&&i>=0&&i<4&&(i===0||!!book.records[i-1]);}
function act(book,a){if(a?.type==='undo'){if(!book.run.log.length||book.run.phase==='won')return{ok:false,state:book,reason:'Nothing to undo on this climb.'};const n=clone(book);n.run=replay(n.run.route,n.run.log.slice(0,-1));return{ok:true,state:n};}if(a?.type==='route'){if(!unlocked(book,a.id))return{ok:false,state:book,reason:'Reach the previous summit first.'};const n=clone(book);n.run=fresh(a.id);return{ok:true,state:n};}const r=step(book.run,a);if(!r.ok)return{...r,state:book};const n=clone(book);n.run=r.state;if(n.run.phase==='won'){const i=n.run.route,old=n.records[i],score=medals(n.run);if(!old||score>old.medals||(score===old.medals&&n.run.moves<old.moves))n.records[i]={medals:score,moves:n.run.moves,log:clone(n.run.log)};if(n.run.sample&&(!n.surveys[i]||n.run.moves<n.surveys[i].moves))n.surveys[i]={moves:n.run.moves,log:clone(n.run.log)};}return{ok:true,state:n};}
function encode(book){return JSON.stringify({version:1,route:book.run.route,log:book.run.log,records:book.records,surveys:book.surveys});}
function decode(raw){if(typeof raw!=='string'||raw.length>200000)throw Error('Notebook too large');const o=JSON.parse(raw);if(o.version!==1||!Array.isArray(o.records)||o.records.length!==4)throw Error('Unreadable notebook');const records=o.records.map((r,i)=>{if(r===null)return null;const s=replay(i,r.log);if(s.phase!=='won'||r.medals!==medals(s)||r.moves!==s.moves)throw Error('Invalid summit record');return{medals:r.medals,moves:r.moves,log:s.log};});for(let i=1;i<4;i++)if(records[i]&&!records[i-1])throw Error('Invalid unlock');const savedSurveys=o.surveys===undefined?[null,null,null,null]:o.surveys;if(!Array.isArray(savedSurveys)||savedSurveys.length!==4)throw Error('Invalid survey book');const surveys=savedSurveys.map((r,i)=>{if(r===null)return null;const s=replay(i,r.log);if(!records[i]||s.phase!=='won'||!s.sample||r.moves!==s.moves)throw Error('Invalid survey record');return{moves:s.moves,log:s.log};});const b={version:1,records,surveys,run:replay(o.route,o.log)};if(!unlocked(b,b.run.route))throw Error('Locked climb');if(b.run.phase==='won'&&!records[b.run.route])throw Error('Missing summit record');return b;}
const API={KEY,ROUTES,fresh,newBook,hold,length,risk,cost,step,preview,act,medals,replay,unlocked,encode,decode};if(typeof module!=='undefined')module.exports=API;else root.Cairn=API;
})(typeof window!=='undefined'?window:globalThis);
