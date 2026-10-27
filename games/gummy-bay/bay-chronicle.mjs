// v179: the bay chronicle. A story hour after Founders’ Day, then a long empire
// track aimed at about 20 hours. Cuts use the same shot format as story-acts
// so the existing letterbox player can run them.
// Family friendly: the “crime” is candy, the double-cross is a phone tip, and
// the soda fountain is a shop till that pays cash into the bank.
import {createTimeline} from './cinematics.mjs?v=132';

export const CHRONICLE_VERSION=1;
// The live clock adds 1.2 game-minutes per real second, so one day is 20 real minutes.
export const DAY_MINUTES=20;
export const ARC_MINUTES=60;
export const EMPIRE_HOURS=20;

export const DISTRICTS=Object.freeze([
 {id:'salt-docks',name:'Salt Docks'},
 {id:'tin-terrace',name:'Tin Terrace'},
 {id:'hillcrest',name:'Hillcrest'},
 {id:'neon-row',name:'Neon Row'}
]);
export const GANGS=Object.freeze([
 {id:'sour',name:'Sour Crew',level:6,perk:'races',line:'Scooters and sour faces. They race. They do not scrap.'},
 {id:'pier',name:'Pier Posse',level:8,perk:'tickets',line:'Arcade regulars who save you a stool.'},
 {id:'parade',name:'Parade Club',level:10,perk:'heat',line:'A social club that still talks about the old parades.'}
]);
export const PROPERTIES=Object.freeze([
 {id:'warehouse',name:'Jelly Warehouse',purpose:'storage',cost:4000,level:5,blurb:'Extra shelves. Packs you are not carrying can live here.'},
 {id:'venue',name:'Soda Fountain',purpose:'front',cost:7500,level:9,blurb:'A real shop. Ring pocket cash up as fountain takings and it lands in the bank, minus costs.'},
 {id:'works',name:'Bottling Works',purpose:'production',cost:12000,level:13,blurb:'A small morning line that wraps a few gummies for you.'}
]);
const count=v=>Number.isFinite(v)?Math.max(0,Math.floor(v)):0;
const mission=(row)=>Object.freeze(row);
// Deltas are measured from the moment the arc opens, so a strong save still has new work.
export const MISSIONS=Object.freeze([
 mission({id:'c-phone',title:'Gramps, again',giver:'Gramps',where:'payphone',cut:'tin',
  text:'Founders’ Day is over and Gramps is still on the payphone. Call him. He says the recipe tin was never just recipes.',
  goal:(f,b)=>[count(f.called)-count(b.called),1],
  reward:{xp:40,cash:0},
  done:'Gramps: “Open the tin at home. And do not trust a man who frowns in a lemon hat.”'}),
 mission({id:'c-tin',title:'The recipe tin',giver:'Gramps',where:'home',cut:'backstory',
  text:'The tin is under the worktable. Inside: recipes, and a note about the night the giant gummy bear melted on the mayor.',
  goal:(f)=>[f.atBase?1:0,1],
  reward:{xp:60,cash:40},
  customers:['Ivy'],
  done:'The note calls it the Great Jelly Incident. Candy was banned because the mayor got stuck, not because gummies are wicked.'}),
 mission({id:'c-rival',title:'Lemon Larry’s truce',giver:'Lemon Larry',where:'kickflip',cut:'offer',
  text:'Larry has heard about the parade. Sell four more packs. He wants a truce, and he wants it on the strip.',
  goal:(f,b)=>[count(f.sold)-count(b.sold),4],
  reward:{xp:50,cash:80},
  customers:['Pip'],
  done:'Larry: “Friends. Imagine that. Bring a friendship batch to the pier and I will tell the mayor you are harmless.”'}),
 mission({id:'c-marge',title:'Marge’s side errand',giver:'Marge',where:'craft',
  text:'A side moment. Marge needs gelatin money before Larry’s big idea. Earn another $150.',
  goal:(f,b)=>[count(f.earned)-count(b.earned),150],
  reward:{xp:40,cash:60},
  done:'Marge: “Gelatin’s on the house. Larry smiles with his mouth only. Remember that.”'}),
 mission({id:'c-batch',title:'The friendship batch',giver:'Lemon Larry',where:'pier',cut:'handshake',
  text:'Take the truce to the pier. Eight packs sold since the arc began, and you standing on the boards.',
  goal:(f,b)=>[(f.atPier?1:0)&&(count(f.sold)-count(b.sold)>=8)?1:0,1],
  reward:{xp:70,cash:100},
  done:'Larry shakes your hand for the crowd. His other hand is already on his phone.'}),
 mission({id:'c-cross',title:'The double-cross',giver:'Inspector Hardtack',where:'home',cut:'cross',
  text:'Get home. Larry told the Sugar Squad the friendship batch was a bribe. The truce was the trap.',
  goal:(f)=>[f.atBase?1:0,1],
  reward:{xp:80,cash:0},
  done:'Hardtack finds a recipe tin and a lot of embarrassment. Larry’s tip named the wrong jar.'}),
 mission({id:'c-tilly',title:'Tilly’s side door',giver:'Tilly',where:'arcade',
  text:'A side moment while the squad cools off. Win 5 more prize tickets. Tilly heard Larry’s call.',
  goal:(f,b)=>[count(f.tickets)-count(b.tickets),5],
  reward:{xp:50,cash:0},
  customers:['Rosa'],
  done:'Tilly: “He said, and I quote, ‘tell Hardtack the new kid melts mayors.’ Then he bought a sour belt.”'}),
 mission({id:'c-law',title:'Why the bay banned candy',giver:'Mayor Plum',where:'payphone',cut:'law',
  text:'The mayor will only talk once you have grown a little. Reach level 4, or one level above where this arc found you.',
  goal:(f,b)=>[count(f.level)>=Math.max(4,count(b.level)+1)?1:0,1],
  reward:{xp:90,cash:120},
  customers:['Theo'],
  done:'Mayor Plum: “I was stuck in a gummy bear for an hour. I banned candy. I was wrong, and the act is still on the books.”'}),
 mission({id:'c-clear',title:'A cool evening on the pier',giver:'Gramps',where:'pier',cut:'cleared',
  text:'After 6 PM, stand on the pier with your own work behind you. The breeze keeps gummies solid. That was the whole trick.',
  goal:(f)=>[f.atPier&&count(f.time)>=18*60?1:0,1],
  reward:{xp:100,cash:200},
  done:'The bay eats a gummy and nobody gets stuck. Hardtack writes “weather” in his notebook and goes home.'}),
 mission({id:'c-keys',title:'Keys to the next street',giver:'Gramps',where:'home',cut:'keys',
  text:'Call Gramps one more time, then go home. He is sending you toward the Salt Docks. The long work starts there.',
  goal:(f,b)=>[(count(f.called)-count(b.called)>=2&&f.atBase)?1:0,1],
  reward:{xp:120,cash:250,title:'Keeper of the Tin'},
  customers:['Wren'],
  district:'salt-docks',
  done:'Gramps: “One hour of trouble. Now the bay. Warehouses, a fountain, a bottling line, and crews who race instead of fight.”'})
]);
export const MISSION_IDS=Object.freeze(MISSIONS.map(m=>m.id));
export const missionById=id=>MISSIONS.find(m=>m.id===id)||null;

// Long tail. A day is 20 real minutes, so day 60 is about 20 hours of the clock,
// and the last rung also wants level 20, a full crew and every property.
export const RUNGS=Object.freeze([
 {id:'r1',hour:1,level:2,day:1,text:'The notebook days. Sell, call, and keep the lights on.'},
 {id:'r2',hour:3,level:4,day:3,mission:'c-tin',text:'You know why candy is banned. Keep going.'},
 {id:'r3',hour:5,level:5,day:6,property:'warehouse',text:'A warehouse for the jars that do not fit at home.'},
 {id:'r4',hour:7,level:6,day:10,gang:true,district:'salt-docks',text:'A crew, and the Salt Docks open.'},
 {id:'r5',hour:9,level:9,day:16,property:'venue',text:'The soda fountain. A front counter with a real till.'},
 {id:'r6',hour:11,level:11,day:22,district:'tin-terrace',text:'Tin Terrace stops being a rumour.'},
 {id:'r7',hour:13,level:13,day:30,standing:40,text:'Your crew actually likes you.'},
 {id:'r8',hour:15,level:14,day:38,property:'works',text:'The bottling works takes a morning shift.'},
 {id:'r9',hour:17,level:16,day:46,district:'hillcrest',text:'Hillcrest, where the big houses look down on the bay.'},
 {id:'r10',hour:18,level:18,day:54,standing:70,text:'Regulars, crews and streets all know the tin.'},
 {id:'r11',hour:20,level:20,day:60,district:'neon-row',standing:100,properties:3,text:'Neon Row. About twenty hours in, the bay is yours.'}
]);

export function freshChronicle(){
 return {v:CHRONICLE_VERSION,open:false,done:[],seen:[],base:null,gang:'',standing:0,stoodDay:0,owned:{},worksDay:0,title:'',log:[]};
}
export function normalizeChronicle(raw){
 const s=freshChronicle();if(!raw||typeof raw!=='object')return s;
 s.open=raw.open===true;
 const done=new Set(Array.isArray(raw.done)?raw.done:[]);
 for(const id of MISSION_IDS){if(!done.has(id))break;s.done.push(id);}
 if(s.done.length)s.open=true;
 const cuts=new Set(Object.keys(CUTS));
 s.seen=(Array.isArray(raw.seen)?raw.seen:[]).filter(id=>cuts.has(id));
 const b=raw.base&&typeof raw.base==='object'?raw.base:{};
 if(s.open)s.base={sold:count(b.sold),called:count(b.called),earned:count(b.earned),tickets:count(b.tickets),level:count(b.level)||1,day:count(b.day)||1,bank:count(b.bank)};
 const gang=GANGS.some(g=>g.id===raw.gang)?raw.gang:'';
 s.gang=gang;s.standing=Math.min(100,count(raw.standing));s.stoodDay=count(raw.stoodDay);
 for(const p of PROPERTIES)if(raw.owned&&raw.owned[p.id]===true)s.owned[p.id]=true;
 s.worksDay=count(raw.worksDay);
 s.title=typeof raw.title==='string'&&s.done.includes('c-keys')?raw.title.slice(0,60):'';
 s.log=Array.isArray(raw.log)?raw.log.filter(e=>typeof e==='string').slice(-12).map(e=>e.slice(0,180)):[];
 return s;
}
export function currentMission(story){if(!story?.open)return null;return MISSIONS.find(m=>!story.done.includes(m.id))||null;}
export function missionProgress(m,facts,base){
 if(!m)return null;const [have,need]=m.goal(facts||{},base||{});
 return {have:Math.min(count(have),need),need,met:have>=need,label:need>1?Math.min(count(have),need)+' / '+need:(have>=need?'Done':'To do')};
}
export function arcComplete(story){return !!story?.done?.includes('c-keys');}

export function stepChronicle(prev,facts){
 const story=normalizeChronicle(prev),events=[];const f=facts||{};
 if(!story.open){
  if(!f.finale)return {story,events};
  story.open=true;
  story.base={sold:count(f.sold),called:count(f.called),earned:count(f.earned),tickets:count(f.tickets),level:count(f.level)||1,day:count(f.day)||1,bank:count(f.bank)};
  events.push({type:'open'});
  if(!story.seen.includes('tin'))events.push({type:'cut',id:'tin'});
  return {story,events};
 }
 const m=currentMission(story);if(!m)return {story:stand(story,f),events};
 if(!missionProgress(m,f,story.base).met)return {story:stand(story,f),events};
 story.done.push(m.id);story.log.push(m.done);story.log=story.log.slice(-12);
 if(m.reward.title)story.title=m.reward.title;
 story.standing=Math.min(100,story.standing+(story.gang?8:2));
 events.push({type:'complete',id:m.id,title:m.title,reward:{...m.reward},line:m.done,customers:m.customers||[],district:m.district||''});
 if(m.cut&&!story.seen.includes(m.cut))events.push({type:'cut',id:m.cut});
 return {story:stand(story,f),events};
}
function stand(story,f){
 const day=count(f.day);
 if(story.gang&&day>story.stoodDay){story.standing=Math.min(100,story.standing+3);story.stoodDay=day;}
 return story;
}
export function markChronicleSeen(prev,id){const story=normalizeChronicle(prev);if(CUTS[id]&&!story.seen.includes(id))story.seen.push(id);return story;}

export function joinGang(prev,id,facts){
 const story=normalizeChronicle(prev),g=GANGS.find(x=>x.id===id);
 if(!g)return {ok:false,reason:'That crew is not in the bay.',story};
 if(!story.open)return {ok:false,reason:'Finish Founders’ Day first. Crews notice a story.',story};
 if(story.gang)return {ok:false,reason:'You already ride with the '+GANGS.find(x=>x.id===story.gang).name+'.',story};
 if(count(facts?.level)<g.level)return {ok:false,reason:'Reach level '+g.level+' to ride with the '+g.name+'.',story};
 story.gang=g.id;story.stoodDay=count(facts?.day);return {ok:true,story,gang:g};
}
export function buyProperty(prev,id,facts){
 const story=normalizeChronicle(prev),p=PROPERTIES.find(x=>x.id===id);
 if(!p)return {ok:false,reason:'No such property.',story};
 if(!story.open)return {ok:false,reason:'The lettings office wants a story first.',story};
 if(story.owned[p.id])return {ok:false,reason:'You already have the keys.',story};
 if(count(facts?.level)<p.level)return {ok:false,reason:'Reach level '+p.level+' for the '+p.name+'.',story};
 if(count(facts?.bank)<p.cost)return {ok:false,reason:'The '+p.name+' needs $'+p.cost.toLocaleString('en-US')+' in the bank.',story};
 story.owned[p.id]=true;return {ok:true,story,property:p};
}
export function frontTake(prev,amount,facts){
 const story=normalizeChronicle(prev),n=count(amount);
 if(!story.owned.venue)return {ok:false,reason:'Buy the soda fountain first.',story,bank:0};
 if(![100,400,1000].includes(n))return {ok:false,reason:'The till takes $100, $400 or $1,000.',story,bank:0};
 if(count(facts?.cash)<n)return {ok:false,reason:'Not enough cash in your pocket.',story,bank:0};
 const bank=Math.round(n*.8);
 return {ok:true,story,spend:n,bank,line:'Fountain takings: $'+n+' in, $'+bank+' to the bank.'};
}
export function worksGrant(prev,facts){
 const story=normalizeChronicle(prev);
 if(!story.owned.works)return {ok:false,story,wrappers:0};
 const day=count(facts?.day);
 if(story.worksDay===day||count(facts?.time)<8*60)return {ok:false,story,wrappers:0};
 story.worksDay=day;return {ok:true,story,wrappers:4};
}

export function openDistricts(story,facts){
 const s=normalizeChronicle(story),f=facts||{},open=new Set(),owned=Object.values(s.owned).filter(Boolean).length;
 if(s.done.includes('c-keys'))open.add('salt-docks');
 if(open.has('salt-docks')&&count(f.level)>=11&&count(f.day)>=22)open.add('tin-terrace');
 if(open.has('tin-terrace')&&count(f.level)>=16&&count(f.day)>=46&&s.owned.works)open.add('hillcrest');
 if(open.has('hillcrest')&&count(f.level)>=20&&count(f.day)>=60&&count(s.standing)>=100&&owned>=3)open.add('neon-row');
 return DISTRICTS.map(d=>({id:d.id,name:d.name,locked:!open.has(d.id)}));
}
export function applyDistricts(plan,registry){
 const set=registry?.setLocked;if(typeof set!=='function')return false;
 let n=0;for(const d of plan)if(set(d.id,!!d.locked))n++;
 return n>0;
}
export function ensureDistrictRegistry(win){
 if(!win)return null;
 if(win.GUMMY_DISTRICTS?.setLocked)return win.GUMMY_DISTRICTS;
 const locked=new Map(DISTRICTS.map(d=>[d.id,true]));
 const api={
  list:()=>DISTRICTS.map(d=>({id:d.id,name:d.name,locked:!!locked.get(d.id)})),
  setLocked:(id,value)=>{if(!locked.has(id))return false;locked.set(id,!!value);return true;},
  at:()=>null,playable:()=>false,blocked:()=>false
 };
 win.GUMMY_DISTRICTS=api;return api;
}
export function unlockNames(events){
 const names=[];for(const e of events||[])if(e.type==='complete'&&e.customers)names.push(...e.customers);
 return names;
}

export function rungMet(r,facts,story){
 const f=facts||{},s=story||{};
 if(count(f.level)<r.level||count(f.day)<r.day)return false;
 if(r.mission&&!(s.done||[]).includes(r.mission))return false;
 if(r.gang&&!s.gang&&!f.gang)return false;
 if(r.property&&!(s.owned||{})[r.property])return false;
 if(r.district&&openDistricts(s,f).find(d=>d.id===r.district)?.locked)return false;
 if(count(r.standing)&&count(s.standing)<r.standing&&count(f.standing)<r.standing)return false;
 if(r.properties&&Object.values(s.owned||{}).filter(Boolean).length<r.properties)return false;
 return true;
}
export function empireNow(story,facts){
 const s=normalizeChronicle(story),met=[],next=[];
 for(const r of RUNGS){(rungMet(r,facts,s)?met:next).push(r.id);}
 return {met,next:next[0]||null,done:met.length===RUNGS.length,targetHours:EMPIRE_HOURS};
}
export function nextRung(story,facts){const id=empireNow(story,facts).next;return RUNGS.find(r=>r.id===id)||null;}

const off=(a,pts)=>{const c=Math.cos(a.yaw||0),s=Math.sin(a.yaw||0);return pts.map(p=>[a.x+p[0]*c-p[2]*s,p[1],a.z+p[0]*s+p[2]*c]);};
const shot=(a,d)=>({...d,cam:off(a,d.cam),look:off(a,d.look)});
const ANCHORS={pier:{x:0,z:80},home:{x:-54,z:61,yaw:Math.PI},kickflip:{x:-92,z:-24}};
const CUTS=Object.freeze({
 tin:{title:'The tin is not just recipes',anchor:'pier',shots:[
  {duration:6,cam:[[-8,3,-6],[-4,2.2,-2]],look:[[0,1.5,2],[1,1.5,3]],fov:[48,42],ease:'inOutSine',fadeIn:.6,fadeOut:.3},
  {duration:6,cam:[[2,1.8,1],[1.2,1.7,2]],look:[[-1,1.5,4],[-1,1.5,4]],fov:[38,34],ease:'inOutSine',fadeOut:.4}],
  beats:[
   {at:.4,until:5.5,kind:'title',title:'THE TIN',line:'After Founders’ Day'},
   {at:0,until:12,kind:'amb',amb:'sea'},
   {at:.2,until:1,kind:'music',music:'tender'},
   {at:1,until:4.5,kind:'sub',who:'GRAMPS (ON THE PHONE)',text:'You did good, kid. The bear did not melt. I am proud, and I am not done.'},
   {at:4.6,until:8.5,kind:'sub',who:'GRAMPS (ON THE PHONE)',text:'The tin under the table has the real note. Candy was banned over a sticky parade.'},
   {at:8.6,until:11.6,kind:'sub',who:'GRAMPS (ON THE PHONE)',text:'Read it at home. And if Lemon Larry offers a truce, count his hands.'}],
  cast:{props:[],actors:[
   {id:'player',look:'player',anchor:'pier',show:[0,12],path:[[0,0,0,0]],acts:[[1,11,'phone']],mood:'friendly'}]}},
 backstory:{title:'Why gummies are banned',anchor:'home',shots:[
  {duration:6,cam:[[2,2,-4],[1,1.8,-2]],look:[[0,1.2,1],[0,1.1,1]],fov:[46,40],ease:'inOutSine',fadeIn:.5},
  {duration:6,cam:[[-2,1.7,2],[-1,1.6,2.4]],look:[[1,1.3,3],[1,1.3,3]],fov:[36,32],ease:'inOutSine',fadeOut:.4}],
  beats:[
   {at:.3,until:5,kind:'cap',title:'THE RECIPE TIN',line:'A note in Gramps’ handwriting'},
   {at:0,until:12,kind:'amb',amb:'town'},
   {at:.2,until:1,kind:'music',music:'flashback'},
   {at:1.2,until:5,kind:'sub',who:'THE NOTE',text:'Thirty years ago the parade gummy bear melted in a heatwave. The mayor was stuck for an hour.'},
   {at:5.2,until:9,kind:'sub',who:'THE NOTE',text:'She signed the Sugar-Free Bay Act that night. Candy became contraband. It was embarrassment, not evil.'},
   {at:9.2,until:11.8,kind:'sub',who:'THE NOTE',text:'A cool breeze keeps a gummy solid. Remember that. —G'}],
  cast:{props:[],actors:[
   {id:'player',look:'player',anchor:'home',show:[0,12],path:[[0,0,-1,0]],acts:[[1,6,'hold'],[6,11,'wave']],mood:'friendly'}]}},
 offer:{title:'A truce, he says',anchor:'kickflip',shots:[
  {duration:6,cam:[[6,2.2,8],[3,1.8,6]],look:[[0,1.4,3],[0,1.4,3]],fov:[46,40],ease:'inOutSine',fadeIn:.4},
  {duration:6,cam:[[1.5,1.6,4],[1,1.55,3.6]],look:[[0,1.45,2],[0,1.45,2]],fov:[34,30],ease:'inOutSine',fadeOut:.4}],
  beats:[
   {at:.2,until:1,kind:'music',music:'rival'},
   {at:0,until:12,kind:'amb',amb:'town'},
   {at:.6,until:4.2,kind:'sub',who:'LEMON LARRY',text:'Truce. Your parade gummy did not melt. Mine would have. I hate that.'},
   {at:4.4,until:8,kind:'sub',who:'LEMON LARRY',text:'Bring a friendship batch to the pier. I will tell the mayor you are a baker, not a problem.'},
   {at:8.2,until:11.6,kind:'sub',who:'LEMON LARRY',text:'Smile for the docks. Trust is a flavour I do not stock.'}],
  cast:{props:[],actors:[
   {id:'larry',look:'lemon larry',anchor:'kickflip',who:['LARRY'],show:[0,12],path:[[0,0,2,.6]],acts:[[.6,4,'fold'],[4.4,8,'point'],[8.2,11,'shrug']],mood:'smirk'},
   {id:'player',look:'player',anchor:'kickflip',show:[0,12],path:[[0,-1.2,0,0]],mood:'friendly'}]}},
 handshake:{title:'Friends, in public',anchor:'pier',shots:[
  {duration:5,cam:[[-4,2,-2],[-2,1.7,0]],look:[[1,1.4,3],[1,1.4,3]],fov:[44,40],ease:'inOutSine',fadeIn:.4},
  {duration:5,cam:[[2,1.7,2],[1.4,1.65,2.4]],look:[[0,1.45,3],[0,1.45,3]],fov:[34,32],ease:'inOutSine',fadeOut:.3}],
  beats:[
   {at:0,until:10,kind:'amb',amb:'sea'},
   {at:.4,until:4,kind:'sub',who:'',text:'Larry shakes your hand where the dock can see it. His other hand stays in his pocket, on a phone.'},
   {at:4.2,until:8,kind:'sub',who:'LEMON LARRY',text:'Tell Hardtack they are harmless, I said. I am saying it. Out loud. For the record.'},
   {at:8.1,until:9.8,kind:'sub',who:'',text:'The phone in his pocket is already lit.'}],
  cast:{props:[],actors:[
   {id:'larry',look:'lemon larry',anchor:'pier',who:['LARRY'],show:[0,10],path:[[0,.4,2,-1]],acts:[[.4,4,'offer'],[4,8,'point']],mood:'smirk'},
   {id:'player',look:'player',anchor:'pier',show:[0,10],path:[[0,-.6,1,1]],mood:'friendly'}]}},
 cross:{title:'The tip-off',anchor:'home',shots:[
  {duration:5,cam:[[-3,2,-6],[-1,1.8,-3]],look:[[0,1.3,0],[0,1.3,0]],fov:[48,42],ease:'outCubic',fadeIn:.3},
  {duration:6,cam:[[1.5,1.7,-1],[1,1.65,-.4]],look:[[0,1.4,1],[0,1.4,1]],fov:[36,32],ease:'inOutSine',fadeOut:.4}],
  beats:[
   {at:0,until:1,kind:'music',music:'squad'},
   {at:0,until:11,kind:'amb',amb:'town'},
   {at:.4,until:4,kind:'sub',who:'INSPECTOR HARDTACK',text:'Anonymous tip. A friendship batch, they said. I do not like anonymous, but I do like tips.'},
   {at:4.2,until:8,kind:'sub',who:'',text:'Larry sold the truce and the handshake. The double-cross fits on one phone call.'},
   {at:8.2,until:10.8,kind:'sub',who:'INSPECTOR HARDTACK',text:'The jars are recipes and jelly. I was promised a scandal. I got a picnic.'}],
  cast:{props:[],actors:[
   {id:'hank',look:'hank hardtack',anchor:'home',who:['HARDTACK'],show:[0,11],path:[[0,-1,-2,0]],acts:[[.4,4,'hold'],[8,10,'shrug']],mood:'stern'},
   {id:'player',look:'player',anchor:'home',show:[0,11],path:[[0,.6,-1,3]],mood:'wide'}]}},
 law:{title:'The Sugar-Free Bay Act',anchor:'pier',shots:[
  {duration:6,cam:[[-6,2.4,-4],[-3,1.9,-1]],look:[[0,1.6,3],[0,1.5,3]],fov:[46,40],ease:'inOutSine',fadeIn:.5},
  {duration:6,cam:[[1.2,1.7,2],[.6,1.65,2.5]],look:[[-1,1.5,3],[-1,1.5,3]],fov:[34,30],ease:'inOutSine',fadeOut:.5}],
  beats:[
   {at:.3,until:5,kind:'title',title:'SUGAR-FREE BAY',line:'Why the law exists'},
   {at:0,until:12,kind:'amb',amb:'sea'},
   {at:.2,until:1,kind:'music',music:'tender'},
   {at:1.2,until:5,kind:'sub',who:'MAYOR PRUDENCE PLUM',text:'I banned candy because a gummy bear sat on me. I was sticky, proud, and wrong.'},
   {at:5.2,until:9,kind:'sub',who:'MAYOR PRUDENCE PLUM',text:'The act is still law. Changing it takes a vote, a cool day, and a town that is not afraid of jelly.'},
   {at:9.2,until:11.6,kind:'sub',who:'MAYOR PRUDENCE PLUM',text:'Bring me an evening on the pier. If nothing melts, I will write that down.'}],
  cast:{props:[],actors:[
   {id:'mayor',look:'mayor prudence',anchor:'pier',who:['MAYOR','PLUM'],show:[0,12],path:[[0,0,3,3]],acts:[[1,5,'wave'],[5,9,'shrug'],[9,11,'point']],mood:'cheery'}]}},
 cleared:{title:'Nothing melted',anchor:'pier',shots:[
  {duration:6,cam:[[-10,4,-8],[-4,2.4,-2]],look:[[0,2,6],[0,2,4]],fov:[50,44],ease:'inOutSine',fadeIn:.6},
  {duration:6,cam:[[1,1.8,2],[.4,1.7,2.6]],look:[[0,1.5,4],[0,1.6,4]],fov:[36,32],ease:'inOutSine',fadeOut:.6}],
  beats:[
   {at:.4,until:5,kind:'cap',title:'LUCKY PIER',line:'After six · a cool breeze'},
   {at:0,until:12,kind:'amb',amb:'sea'},
   {at:.3,until:1,kind:'music',music:'parade'},
   {at:1.2,until:5,kind:'sub',who:'',text:'The batch stays solid. The trick was never secret. It was the weather, and a little care.'},
   {at:5.2,until:9,kind:'sub',who:'INSPECTOR HARDTACK',text:'I am writing “breeze”. Do not make me write “incident” again.'},
   {at:9.2,until:11.6,kind:'sub',who:'GRAMPS (ON THE PHONE)',text:'That is the hour, kid. The rest is years. Or, you know, a long weekend that feels like one.'}],
  cast:{props:[],actors:[
   {id:'hank',look:'hank hardtack',anchor:'pier',show:[0,12],path:[[0,2,4,-1]],acts:[[5,9,'hold']],mood:'stern'},
   {id:'player',look:'player',anchor:'pier',show:[0,12],path:[[0,-1,2,0]],acts:[[1,5,'wave']],mood:'cheery'}]}},
 keys:{title:'The long road',anchor:'home',shots:[
  {duration:6,cam:[[-6,3,-8],[-2,2,-3]],look:[[0,1.4,1],[0,1.3,1]],fov:[48,42],ease:'inOutSine',fadeIn:.5},
  {duration:6,cam:[[1,1.8,-1],[.5,1.7,-.2]],look:[[0,1.4,2],[0,1.4,2]],fov:[36,32],ease:'inOutSine',fadeOut:.6}],
  beats:[
   {at:.4,until:5,kind:'title',title:'SALT DOCKS',line:'The next street opens'},
   {at:0,until:12,kind:'amb',amb:'town'},
   {at:.2,until:1,kind:'music',music:'reveal'},
   {at:1.2,until:5,kind:'sub',who:'GRAMPS (ON THE PHONE)',text:'Salt Docks first. Then a warehouse, a fountain, a bottling line.'},
   {at:5.2,until:9,kind:'sub',who:'GRAMPS (ON THE PHONE)',text:'Crews are clubs. Sour Crew, Pier Posse, Parade Club. Pick one. Race them. Do not brawl.'},
   {at:9.2,until:11.6,kind:'sub',who:'GRAMPS (ON THE PHONE)',text:'Level by level, street by street. I will still be on this phone.'}],
  cast:{props:[],actors:[
   {id:'player',look:'player',anchor:'home',show:[0,12],path:[[0,0,-1,0]],acts:[[1,11,'phone']],mood:'cheery'}]}}
});
export {CUTS as CHRONICLE_CUTS};
export const chronicleCut=id=>CUTS[id]||null;
export function chronicleTimeline(id,anchors={}){
 const cut=CUTS[id];if(!cut)return null;
 const resolve=name=>anchors[name]||ANCHORS[name]||anchors.home||ANCHORS.home;
 return createTimeline(cut.shots.map(d=>shot(resolve(d.anchor||cut.anchor),d)));
}
export function chronicleAt(id,timeline,seconds){
 const cut=CUTS[id];if(!cut||!timeline)return null;
 const t=Math.max(0,Math.min(timeline.duration,Number.isFinite(seconds)?seconds:0));
 const at=timeline.at(t),beats=cut.beats.filter(b=>t>=b.at&&t<b.until),pick=k=>beats.filter(b=>b.kind===k).pop()||null;
 return {...at,time:t,done:Number.isFinite(seconds)&&seconds>=timeline.duration,
  sub:pick('sub'),cap:pick('cap'),card:pick('card'),chyron:pick('chyron'),stamp:pick('stamp'),sfx:beats.filter(b=>b.kind==='sfx').map(b=>b.sfx),
  title:pick('title'),music:beats.filter(b=>b.kind==='music').map(b=>b.music),amb:pick('amb')?.amb||'',
  fireworks:false,letterbox:true,get titleIn(){const b=this.title;return b?Math.max(0,Math.min(1,(t-b.at)/.6,(b.until-t)/.5)):0;}};
}
export function chronicleDuration(id){const c=CUTS[id];return c?c.shots.reduce((t,s)=>t+s.duration,0):0;}

const escHtml=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export function chronicleHTML(story,facts,esc=escHtml){
 const s=normalizeChronicle(story),f=facts||{},m=currentMission(s);
 let h='<div class="overline">BAY CHRONICLE</div>';
 if(!s.open)return h+'<h3>After Founders’ Day</h3><p>Finish the parade. Gramps has another hour of story, then a long road of streets, crews and buildings.</p>';
 if(m){const pr=missionProgress(m,f,s.base);h+='<div class="story-quest"><small>'+esc(m.giver.toUpperCase())+'</small><h3>'+esc(m.title)+'</h3><p>'+esc(m.text)+'</p><p class="story-meta"><b>'+esc(pr.label)+'</b> · +'+m.reward.xp+' XP</p></div>';}
 else h+='<div class="story-quest done"><h3>'+esc(s.title||'Keeper of the Tin')+'</h3><p>The hour is over. The empire track keeps going.</p></div>';
 const rung=nextRung(s,{...f,standing:s.standing,gang:s.gang});
 h+='<h3>The long road · about '+EMPIRE_HOURS+' hours</h3>';
 if(rung)h+='<p>'+esc(rung.text)+' · level '+rung.level+' · day '+rung.day+(rung.hour?' · around hour '+rung.hour:'')+'</p>';
 else h+='<p>Neon Row is open. You took the long way.</p>';
 h+='<h3>Crews</h3>';
 for(const g of GANGS){
  const mine=s.gang===g.id,label=mine?'YOURS':s.gang?'RIDING ELSEWHERE':(count(f.level)>=g.level?'JOIN':'LEVEL '+g.level);
  h+='<div class="item"><div><strong>'+esc(g.name)+'</strong><p>'+esc(g.line)+(mine?' Standing '+s.standing+'.':'')+'</p></div><button class="primary" '+(mine||s.gang?'disabled ':'')+'onclick="action(\'joinGang\',\''+g.id+'\')">'+label+'</button></div>';
 }
 h+='<h3>Properties</h3><p>Deeds use the bank. The fountain’s till can move pocket cash into the bank as shop takings.</p>';
 for(const p of PROPERTIES){
  const have=!!s.owned[p.id];
  h+='<div class="item"><div><strong>'+esc(p.name)+'</strong><p>'+esc(p.purpose)+' · '+esc(p.blurb)+'</p></div><button class="primary" '+(have?'disabled ':'')+'onclick="action(\'buyProperty\',\''+p.id+'\')">'+(have?'OWNED':'$'+p.cost.toLocaleString('en-US'))+'</button></div>';
 }
 if(s.owned.venue)h+='<p><button onclick="action(\'frontTill\',100)">Till $100</button> <button onclick="action(\'frontTill\',400)">Till $400</button> <button onclick="action(\'frontTill\',1000)">Till $1,000</button></p>';
 h+='<div class="story-replays"><small>CHRONICLE CUTS</small>'+Object.values(CUTS).map(c=>{
  const id=Object.keys(CUTS).find(k=>CUTS[k]===c);
  return s.seen.includes(id)?'<button onclick="__story.play(\''+id+'\',true)">▶ '+esc(c.title)+'</button>':'<button disabled>🔒 '+esc(c.title)+'</button>';
 }).join('')+'</div>';
 return h;
}
