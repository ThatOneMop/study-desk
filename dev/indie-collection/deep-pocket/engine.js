'use strict';
(function(root,factory){const E=factory();if(typeof module==='object'&&module.exports)module.exports=E;else root.DeepPocket=E})(typeof window!=='undefined'?window:globalThis,()=>{
 const fish=[
  {name:'Lantern Dace',value:12,color:'#ffd87c',pattern:[-6,12,18,-2],habit:'A gentle dip, then two rising pulls.'},
  {name:'Ribbon Perch',value:18,color:'#f0a786',pattern:[20,0,8,-10],habit:'A sharp first run; recover on the fourth beat.'},
  {name:'Glass Loach',value:22,color:'#a4ded7',pattern:[25,18,-8,0],habit:'Two runs, followed by a quiet window.'},
  {name:'Copper Bream',value:28,color:'#db9368',pattern:[12,28,-10,5],habit:'Its second pull is the strongest.'},
  {name:'Velvet Pike',value:34,color:'#a6bde6',pattern:[28,8,24,-12],habit:'Alternating lunges. The fourth beat gives line back.'},
  {name:'Moon Koi',value:42,color:'#e6d4a0',pattern:[35,-10,30,0],habit:'Big runs alternate with breathing room.'}
 ];
 const chapters=[
  {name:'The Paper Jetty',story:'Help Nori restock her little fish stall, and return one fish to the reeds.',current:0,cash:30,release:1,survey:0,color:'#dbbe77'},
  {name:'Copper Reeds',story:'The reed nursery needs a survey. Record a Glass Loach and bring back a modest haul.',current:2,cash:55,release:1,survey:2,color:'#d49b76'},
  {name:'Blue Sink',story:'A cold spring runs beneath the lake. Find a Velvet Pike and leave two fish swimming.',current:4,cash:65,release:2,survey:4,color:'#8fc0d3'},
  {name:'Threadwater',story:'The channels pull hard today. Survey the Copper Bream without emptying the nursery.',current:5,cash:80,release:2,survey:3,color:'#c5b4dc'},
  {name:'The Bell Pool',story:'One last field trip: record a Moon Koi, release two fish and fund the next survey.',current:6,cash:95,release:2,survey:5,color:'#d9d6a0'}
 ];
 const spots=['Reed edge','Old pilings','Open pocket'],depths=['Shallow','Midwater','Deep'],habitat=[[0,1,2],[1,3,4],[2,4,5]],costs={grip:3,spool:3};
 const clone=o=>JSON.parse(JSON.stringify(o)),integer=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
 function fresh(index,p){return{index,status:'active',phase:'choose',spot:0,depth:0,casts:0,records:[],fight:null,stars:0,equipment:clone(p.upgrades),message:'Choose a bank and depth, then cast. Nothing moves until you choose an action.'}}
 function create(){const profile={coins:0,best:[0,0,0,0,0],upgrades:{grip:false,spool:false},seen:[false,false,false,false,false,false]};return{version:1,profile,run:fresh(0,profile)}}
 function totals(o){const r=o.run.records;return{cash:r.filter(x=>x.choice==='keep').reduce((v,x)=>v+fish[x.fish].value,0),released:new Set(r.filter(x=>x.choice==='release').map(x=>x.fish)).size,escapes:r.filter(x=>x.choice==='escape').length,survey:r.some(x=>x.fish===chapters[o.run.index].survey&&x.choice!=='escape')}}
 function ready(o){const t=totals(o),c=chapters[o.run.index];return t.cash>=c.cash&&t.released>=c.release&&t.survey}
 function prediction(o,spot=o.run.spot,depth=o.run.depth){if(!integer(spot,0,2)||!integer(depth,0,2))return null;return(habitat[spot][depth]+o.run.casts%3)%6}
 function select(o,spot,depth){const s=o.run;if(s.status!=='active'||s.phase!=='choose'||!integer(spot,0,2)||!integer(depth,0,2))return false;s.spot=spot;s.depth=depth;return true}
 function cast(o){const s=o.run;if(s.status!=='active'||s.phase!=='choose'||s.casts>=8)return false;const id=prediction(o);s.casts++;s.phase='fight';s.fight={fish:id,tension:40+s.depth*4,progress:0,beat:0};s.message=fish[id].name+' is on the line. Read the next pull before committing.';return true}
 function pull(o){const s=o.run,f=s.fight;if(!f)return 0;return fish[f.fish].pattern[f.beat%4]+chapters[s.index].current-(s.equipment.grip?4:0)}
 function endCast(o){const s=o.run,t=totals(o);s.fight=null;s.phase='choose';if(t.escapes>=3||s.casts>=8&&!ready(o)){s.status='lost';s.message='Field trip ended. Your earlier medals and journal are safe. Retry with a different approach.'}}
 function act(o,action){const s=o.run,f=s.fight;if(s.status!=='active'||s.phase!=='fight'||!['reel','brace','ease'].includes(action))return false;const delta={reel:14,brace:-12,ease:-38}[action];f.tension=Math.max(0,Math.min(100,f.tension+pull(o)+delta));f.progress=Math.min(100,f.progress+({reel:22+(s.equipment.spool?4:0),brace:8,ease:0}[action]));f.beat++;
  if(f.tension===0||f.tension===100||f.beat>=14&&f.progress<100){const reason=f.tension===0?'Too much slack.':f.tension===100?'The line snapped.':'The fish shook the hook after fourteen beats.';s.records.push({fish:f.fish,choice:'escape',beats:f.beat});endCast(o);if(s.status==='active')s.message=reason+' Try again: three escapes end this trip.';return true}
  if(f.progress>=100){s.phase='landed';o.profile.seen[f.fish]=true;s.message='In the landing net! Keep it for the stall or release it for the nursery.'}else s.message=action==='reel'?'Steady winding. Watch the next pull.':action==='brace'?'Rod held low. A little closer, a little safer.':'Line given back. Room for the next run.';return true}
 function canKeep(o){return o.run.phase==='landed'&&!o.run.records.some(x=>x.choice==='keep'&&x.fish===o.run.fight.fish)}
 function decide(o,choice){const s=o.run;if(s.status!=='active'||s.phase!=='landed'||!['keep','release'].includes(choice)||choice==='keep'&&!canKeep(o))return false;const id=s.fight.fish;s.records.push({fish:id,choice,beats:s.fight.beat});endCast(o);if(s.status==='active')s.message=choice==='keep'?'A '+fish[id].value+'-shell catch for the stall. Only one of each species is accepted per trip.':'Released gently. Nursery goals count different species, not repeated releases.';return true}
 function preview(o,action){if(o.run.status!=='active'||o.run.phase!=='fight')return null;const copy=clone(o),before=o.run.fight;act(copy,action);if(!['reel','brace','ease'].includes(action))return null;const f=copy.run.fight;return{tension:f?f.tension:Math.max(0,Math.min(100,before.tension+pull(o)+{reel:14,brace:-12,ease:-38}[action])),progress:f?f.progress:Math.min(100,before.progress+({reel:22+(o.run.equipment.spool?4:0),brace:8,ease:0}[action])),result:copy.run.phase==='landed'?'landed':copy.run.phase==='fight'?'fight':'escape'}}
 function decisionPreview(o,choice){if(o.run.phase!=='landed'||o.run.status!=='active')return null;const copy=clone(o);if(!decide(copy,choice))return null;return{...totals(copy),ready:ready(copy),status:copy.run.status}}
 function finish(o){const s=o.run;if(s.status!=='active'||s.phase!=='choose'||!ready(o))return false;const t=totals(o);s.status='complete';s.stars=1+(t.escapes===0?1:0)+(s.casts<=chapters[s.index].release+3?1:0);const difference=Math.max(0,s.stars-o.profile.best[s.index]);o.profile.best[s.index]=Math.max(o.profile.best[s.index],s.stars);o.profile.coins+=difference;s.message='Field trip complete. '+s.stars+' medals; '+difference+' newly banked. Replay only rewards an improved result.';return true}
 function next(o,index){const s=o.run;if(s.status==='active'||!integer(index,0,4)||index>0&&!o.profile.best[index-1])return false;o.run=fresh(index,o.profile);return true}
 function retry(o){o.run=fresh(o.run.index,o.profile);return true}
 function upgrade(o,key){if(!Object.hasOwn(costs,key)||o.run.status==='active'||o.profile.upgrades[key]||o.profile.coins<costs[key])return false;o.profile.coins-=costs[key];o.profile.upgrades[key]=true;return true}
 function valid(o){try{const p=o.profile,s=o.run;if(o.version!==1||!p||!s||!integer(s.index,0,4)||!['active','lost','complete'].includes(s.status)||!['choose','fight','landed'].includes(s.phase)||!integer(s.spot,0,2)||!integer(s.depth,0,2)||!integer(s.casts,0,8)||!integer(s.stars,0,3)||typeof s.message!=='string'||s.message.length>600)return false;
  if(!Array.isArray(p.best)||p.best.length!==5||!p.best.every(x=>integer(x,0,3))||p.best.some((x,i)=>i&&x&&!p.best[i-1])||!Array.isArray(p.seen)||p.seen.length!==6||!p.seen.every(x=>typeof x==='boolean'))return false;
  for(const k of Object.keys(costs))if(typeof p.upgrades?.[k]!=='boolean'||typeof s.equipment?.[k]!=='boolean'||s.equipment[k]&&!p.upgrades[k])return false;
  if(p.coins!==p.best.reduce((a,b)=>a+b,0)-Object.keys(costs).reduce((v,k)=>v+(p.upgrades[k]?costs[k]:0),0)||!integer(p.coins,0,15)||s.index>0&&!p.best[s.index-1])return false;
  if(!Array.isArray(s.records)||s.records.length>8||!s.records.every(x=>integer(x.fish,0,5)&&['keep','release','escape'].includes(x.choice)&&integer(x.beats,x.choice==='escape'?1:4,14)&&(x.choice==='escape'||p.seen[x.fish])))return false;
  const kept=s.records.filter(x=>x.choice==='keep').map(x=>x.fish);if(new Set(kept).size!==kept.length)return false;
  if(s.casts!==s.records.length+(s.phase==='choose'?0:1))return false;
  if(s.phase==='choose'){if(s.fight!==null)return false}else{const f=s.fight;if(!f||!integer(f.fish,0,5)||!integer(f.tension,1,99)||!integer(f.progress,0,100)||!integer(f.beat,0,14)||(s.phase==='fight'?f.progress>=100||f.beat>=14:f.progress!==100||!p.seen[f.fish]))return false}
  if(s.status==='complete'&&(s.phase!=='choose'||!ready(o)||s.stars!==1+(totals(o).escapes===0?1:0)+(s.casts<=chapters[s.index].release+3?1:0)||p.best[s.index]<s.stars))return false;
  if(s.status!=='complete'&&s.stars!==0||s.status==='lost'&&(s.phase!=='choose'||totals(o).escapes<3&&(s.casts<8||ready(o)))||s.status==='active'&&(totals(o).escapes>=3||s.casts>=8&&s.phase==='choose'&&!ready(o)))return false;
  return true}catch{return false}}
 function encode(o){return JSON.stringify(o)}function decode(raw){try{if(typeof raw!=='string'||raw.length>18000)return null;const o=JSON.parse(raw);return valid(o)?o:null}catch{return null}}
 return{fish,chapters,spots,depths,costs,clone,create,totals,ready,prediction,select,cast,pull,act,canKeep,decide,preview,decisionPreview,finish,next,retry,upgrade,valid,encode,decode};
});
