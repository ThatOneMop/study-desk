import {createTimeline} from './cinematics.mjs?v=132';
// Acts 2 and 3: the mid-game story missions that follow Gramps' notebook (Act 1).
// Original script and cast (research §9): Marge the bait-shop supplier, Lemon Larry and
// the Sour Crew, Inspector Hank Hardtack of the Sugar Squad, Tilly at the Lucky Pier.
// Family friendly: the "crime" is candy, the raid is a cartoon door and a scramble.
// DOM-free: quest data, progression, raid maths, the stash minigame and cutscene timelines.

export const STORY_VERSION=1;
export const ACTS=Object.freeze([
 {id:'act2',title:'Act 2 · Sweet Heat',line:'A supplier, a rival, and a Sugar Squad crackdown.'},
 {id:'act3',title:'Act 3 · Going Big',line:'A bigger base, a crew, and Founders’ Day.'}
]);
const count=v=>Number.isFinite(v)?Math.max(0,Math.floor(v)):0;
// Each quest: goal(facts) -> [have, need]. `where` is a point type the HUD tracker can guide to.
export const QUESTS=Object.freeze([
 {id:'a2-marge',act:'act2',title:'Bait & Tackle',giver:'Marge',where:'craft',hook:'sales',
  text:'Marge buys gelatin “for fishing” and wants to know you are serious. Sell 6 packs in total.',
  goal:f=>[count(f.sold),6],reward:{cash:80,xp:40},done:'Marge: “Six packs. You’ll do, sweetheart. Gelatin’s on me next time.”'},
 {id:'a2-mix',act:'act2',title:'A Recipe of Your Own',giver:'Marge',where:'servo',hook:'mixing',
  text:'The Sour Crew copies plain gummies. Mix one new gummy at the mixing bench so yours taste like nobody else’s.',
  goal:f=>[count(f.mixed),1],reward:{cash:60,xp:60},done:'Marge: “Now that’s a flavour. Larry will be sour about it. Well, sourer.”'},
 {id:'a2-board',act:'act2',title:'Outskate the Sour Crew',giver:'Kenji',where:'kickflip',hook:'skate',
  text:'Lemon Larry’s crew rides the strip on rusty scooters. Get a board at the Kickflip Container and leave them in the dust.',
  goal:f=>[count(f.boards),1],reward:{cash:40,xp:50},done:'Kenji: “Clean push. The Sour Crew just watched you go by and dropped a lemon.”'},
 {id:'a2-raid',act:'act2',title:'The Crackdown',giver:'Inspector Hardtack',where:'home',hook:'police',
  text:'Inspector Hank Hardtack has a warrant for “suspicious sweetness”. Head back to your base and get through the Sugar Squad raid.',
  goal:f=>[count(f.raids),1],reward:{cash:100,xp:80},done:'You kept your cool. Hardtack left with a clipboard and no case. This time.'},
 {id:'a2-move',act:'act2',title:'A Bigger Place',giver:'Cedar Bay Lettings',where:'property',hook:'property',
  text:'Your old base is on the Sugar Squad’s list now. Buy the Harbor workshop or the Hillside house and move the operation.',
  goal:f=>[Math.min(1,count(f.movedSinceRaid)),1],reward:{cash:150,xp:100},done:'New keys, new start. The Sugar Squad is still watching the old address.'},
 {id:'a3-crew',act:'act3',title:'Hire a Crew',giver:'Helping Hand',where:'helpers',hook:'staff',
  text:'Going big needs hands. Hire two helpers at Helping Hand.',
  goal:f=>[count(f.helpers),2],reward:{cash:150,xp:120},done:'Two helpers, matching aprons. It finally feels like a business.'},
 {id:'a3-pier',act:'act3',title:'Pier Regular',giver:'Tilly',where:'arcade',hook:'arcade',
  text:'Tilly runs the Lucky Pier and hears every rumour in town. Win 40 prize tickets and she will tell you what the mayor is planning.',
  goal:f=>[count(f.tickets),40],reward:{cash:0,xp:120},done:'Tilly: “Founders’ Day. The mayor wants a gummy-free parade. Sounds like a challenge to me.”'},
 {id:'a3-empire',act:'act3',title:'Talk of the Town',giver:'Marge',where:'craft',hook:'sales',
  text:'Get the whole bay talking. Reach 30 packs sold in total for Founders’ Day.',
  goal:f=>[count(f.sold),30],reward:{cash:250,xp:150},done:'Marge: “Thirty! Half the bay is smiling and the dentists are worried. Founders’ Day is tonight.”'},
 {id:'a3-finale',act:'act3',title:'Founders’ Day',giver:'Gramps',where:'pier',hook:'finale',
  text:'Bring your best batch to the Founders’ Day fireworks on the pier, after 6 PM.',
  goal:f=>[f.atPier&&count(f.time)>=18*60?1:0,1],reward:{cash:1000,xp:250,title:'Candy Baron of Gummy Bay'},done:'The bay ate well tonight. Gramps is home.'}
]);
export const QUEST_IDS=Object.freeze(QUESTS.map(q=>q.id));
export const questById=id=>QUESTS.find(q=>q.id===id)||null;
// Cutscenes the save can have seen. Each plays when its beat happens and can be replayed from the phone.
export const CUT_IDS=Object.freeze(['act2','raid','act3','finale']);
const CUT_ON_DONE=Object.freeze({'a2-move':'act3','a3-finale':'finale'});

export function freshStory(){return {v:STORY_VERSION,open:false,done:[],seen:[],raids:0,lastRaidDay:0,raidHome:-1,title:'',log:[]};}
export function normalizeStory(raw){
 const s=freshStory();if(!raw||typeof raw!=='object')return s;
 s.open=raw.open===true;
 // Done quests are kept in canonical order and as a prefix: missions are sequential.
 const done=new Set(Array.isArray(raw.done)?raw.done:[]);for(const id of QUEST_IDS){if(!done.has(id))break;s.done.push(id);}
 if(s.done.length)s.open=true;
 s.seen=CUT_IDS.filter(id=>Array.isArray(raw.seen)&&raw.seen.includes(id));
 s.raids=Math.min(999,count(raw.raids));s.lastRaidDay=Math.min(1e6,count(raw.lastRaidDay));
 s.raidHome=[0,1,2].includes(raw.raidHome)?raw.raidHome:-1;
 s.title=typeof raw.title==='string'&&s.done.includes('a3-finale')?raw.title.slice(0,60):'';
 s.log=Array.isArray(raw.log)?raw.log.filter(e=>typeof e==='string').slice(-12).map(e=>e.slice(0,160)):[];
 return s;
}
export function currentQuest(story){if(!story?.open)return null;return QUESTS.find(q=>!story.done.includes(q.id))||null;}
export function questProgress(q,facts){if(!q)return null;const [have,need]=q.goal(facts||{});return {have:Math.min(have,need),need,met:have>=need,label:need>1?Math.min(have,need)+' / '+need:(have>=need?'Done':'To do')};}
export function storyComplete(story){return !!story?.done?.includes('a3-finale');}
export function currentAct(story){const q=currentQuest(story);if(q)return ACTS.find(a=>a.id===q.act);return storyComplete(story)?ACTS[1]:null;}
// Act 2 opens once the notebook's first sale and the call home are done.
export const actTwoReady=f=>count(f.sold)>=1&&count(f.called)>=2;

// One step of story logic. Pure: returns a new story and the events the game should act on.
// Events: {type:'open'|'cut'|'complete', ...}. At most one quest completes per step.
export function stepStory(prev,facts){
 const story=normalizeStory(prev),events=[];const f=facts||{};
 if(!story.open){
  if(!actTwoReady(f))return {story,events};
  story.open=true;events.push({type:'open',act:'act2'});
  if(!story.seen.includes('act2'))events.push({type:'cut',id:'act2'});
  return {story,events};
 }
 const q=currentQuest(story);if(!q)return {story,events};
 if(!questProgress(q,f).met)return {story,events};
 story.done.push(q.id);story.log.push(q.done);story.log=story.log.slice(-12);
 if(q.reward.title)story.title=q.reward.title;
 events.push({type:'complete',id:q.id,title:q.title,reward:{...q.reward},line:q.done});
 const cut=CUT_ON_DONE[q.id];if(cut&&!story.seen.includes(cut))events.push({type:'cut',id:cut});
 const next=currentQuest(story);if(next&&next.act!==q.act)events.push({type:'open',act:next.act});
 return {story,events};
}
export function markSeen(prev,id){const story=normalizeStory(prev);if(CUT_IDS.includes(id)&&!story.seen.includes(id))story.seen.push(id);return story;}

// ---- Raids ----
// Story raid: once, when "The Crackdown" is active and you are home. Heat raid: heat >= 90 at
// your base, at most once per day and never on day 1 (the protected first day).
export const RAID_HEAT=90,MAX_RAID_LOSS=.5,FLEE_LOSS=.3;
export function raidDue(prev,f){
 const story=normalizeStory(prev);if(!f?.atBase)return null;
 if(currentQuest(story)?.id==='a2-raid'&&story.raids===0)return 'story';
 if(count(f.heat)>=RAID_HEAT&&count(f.day)>=2&&count(f.day)>story.lastRaidDay)return 'heat';
 return null;
}
// Lost share of the stock at the base: hiding scales with the minigame score, fleeing is a flat
// 30%. Never more than half of any stack. Cash, bank and equipment are untouched.
export function raidShare(choice,score){
 if(choice==='flee')return FLEE_LOSS;
 const sc=Number.isFinite(score)?Math.max(0,Math.min(1,score)):0;
 return Math.min(MAX_RAID_LOSS,MAX_RAID_LOSS*(1-sc));
}
export function applyRaid(stock,{choice='hide',score=0}={}){
 const share=raidShare(choice,score);let lost=0;const cut=list=>(Array.isArray(list)?list:[]).map(v=>{const n=count(v),l=Math.floor(n*share);lost+=l;return n-l;});
 const packs=cut(stock?.packs),storedPacks=cut(stock?.storedPacks);
 return {packs,storedPacks,lost,share,heat:Math.min(count(stock?.heat),35)};
}
export function recordRaid(prev,{day=1,home=0}={}){const story=normalizeStory(prev);story.raids=Math.min(999,story.raids+1);story.lastRaidDay=count(day);story.raidHome=[0,1,2].includes(home)?home:0;return story;}

// "Hide the stash": 8 jars pop up in 4 lanes over 6 s; tap a jar (or press its lane key 1-4)
// while it is showing to drop it in the vent. Deterministic for a seed so it can be tested.
export function createStashGame({jars=8,duration=6,seed=7}={}){
 let r=(seed>>>0)||1;const rnd=()=>((r=(r*1664525+1013904223)>>>0)/4294967296);
 const n=Math.max(1,Math.min(16,count(jars))),span=duration/(n+1),list=[];let lastLane=-1;
 for(let i=0;i<n;i++){let lane=Math.floor(rnd()*4);if(lane===lastLane)lane=(lane+1)%4;lastLane=lane;const at=.35+i*span;list.push({i,lane,at,until:at+Math.max(.9,span*1.6),saved:false});}
 return {duration,jars:list,
  live(t){return list.filter(j=>!j.saved&&t>=j.at&&t<j.until);},
  hit(lane,t){const j=list.find(j=>!j.saved&&j.lane===lane&&t>=j.at&&t<j.until);if(!j)return -1;j.saved=true;return j.i;},
  get saved(){return list.filter(j=>j.saved).length;},
  score(){return list.filter(j=>j.saved).length/list.length;},
  done(t){return t>=duration||list.every(j=>j.saved);}};
}

// ---- Cutscenes ----
// Shots are data, like Act 1, but placed relative to an anchor (the base door, the pier...)
// so the raid always films the player's own base. Offsets are [dx,y,dz].
// Anchors may carry yaw (radians): local -z is "out the front" after rotation.
const off=(a,pts)=>{const c=Math.cos(a.yaw||0),s=Math.sin(a.yaw||0);return pts.map(p=>[a.x+p[0]*c-p[2]*s,p[1],a.z+p[0]*s+p[2]*c]);};
const shot=(a,d)=>({...d,cam:off(a,d.cam),look:off(a,d.look)});
export const CUT_ANCHORS=Object.freeze({pier:{x:0,z:80},kickflip:{x:-92,z:-24},strip:{x:-30,z:-90},townhall:{x:0,z:0}});
const HP=Math.PI/2;
// v149: every cut is staged in-engine. `cast` holds people-kit actors and instanced props
// (anchor-local coordinates; see cine-cast.mjs resolveCast) that act each line, with
// lip-flap, gestures and moods; music/amb beats drive the synthesised score and ambience.
export const CUTS=Object.freeze({
 act2:{title:'Act 2 · Sweet Heat',anchor:'pier',shots:[
   {duration:7,cam:[[-26,9,-16],[-18,6,-10],[-11,4,-6]],look:[[0,1.5,6],[1,1.5,6],[2,1.4,6]],fov:[52,46],ease:'inOutSine',fadeIn:1,fadeOut:.3},
   {duration:8,cam:[[-1.6,1.8,2.2],[-1.3,1.74,2.9]],look:[[.8,1.5,6.2],[.8,1.52,6.2]],fov:[40,34],ease:'inOutSine',fadeIn:.3,fadeOut:.3,drift:.025},
   {duration:4.5,anchor:'kickflip',cam:[[6.8,2.4,11],[4.4,2.0,9.2]],look:[[.6,1.4,5],[.7,1.45,5.2]],fov:[46,42],ease:'inOutSine',fadeIn:.3,drift:.03},
   {duration:4.5,anchor:'kickflip',cam:[[2.7,1.62,7.6],[2.3,1.6,7.1]],look:[[.8,1.55,5.0],[.8,1.56,5.1]],fov:[36,31],ease:'inOutSine',fadeOut:.3,drift:.02},
   {duration:6,anchor:'strip',cam:[[-7.5,2.2,.4],[1,2,1]],look:[[-5,1.4,6],[3.5,1.4,6]],fov:[46,44],ease:'linear',fadeIn:.3,fadeOut:.8,drift:.04}],
  beats:[
   {at:.5,until:6.4,kind:'title',title:'GUMMY BAY',line:'Act 2 · Sweet Heat'},
   {at:.3,until:1,kind:'music',music:'reveal'},
   {at:0,until:15,kind:'amb',amb:'sea'},
   {at:1.2,until:6.6,kind:'sub',who:'',text:'Word gets around a small town. Especially word about gummies.'},
   {at:7.2,until:10.8,kind:'card',card:'marge'},
   {at:7.6,until:11,kind:'sub',who:'MARGE',text:'Bait and tackle, love. Worms, hooks, and gelatin. Strictly for fishing.'},
   {at:11.1,until:14.6,kind:'sub',who:'MARGE',text:'Sell six packs and I’ll keep you stocked. Fish do love a gummy.'},
   {at:15,until:18.6,kind:'card',card:'larry'},
   {at:15,until:15.6,kind:'sfx',sfx:'stamp'},
   {at:15,until:15.8,kind:'music',music:'rival'},
   {at:15,until:30,kind:'amb',amb:'town'},
   {at:15.8,until:19.4,kind:'sub',who:'LEMON LARRY',text:'New kid? Cute. This is Sour Crew turf. Our gummies make people pucker.'},
   {at:19.5,until:23.4,kind:'sub',who:'LEMON LARRY',text:'Yours make people smile. Disgusting. Stay off the strip.'},
   {at:24,until:24.8,kind:'music',music:'squad'},
   {at:24,until:29.6,kind:'sub',who:'BAY BUGLE RADIO',text:'And Inspector Hank Hardtack promises a “crackdown on suspicious sweetness” this week.'},
   {at:24,until:29.6,kind:'chyron',head:'SUGAR SQUAD',text:'Inspector Hardtack: “Every lollipop leaves a trail”'}],
  cast:{props:[
    {kind:'baitcart',anchor:'pier',x:2.3,z:7,yaw:-2.3,show:[0,15]},
    {kind:'crates',anchor:'pier',x:3.2,z:5.2,yaw:.3,show:[0,15]},
    {kind:'clipboard',anchor:'strip',show:[24,30],y:1.05,path:[[24,-8.7,6.5,HP],[30,3.3,6.5,HP]]}],
   actors:[
    {id:'player',look:'player',anchor:'pier',show:[0,15],path:[[0,-1.2,-8],[6.2,-.6,4.0,.57]],mood:'friendly',moods:[[0,'friendly'],[11.2,'cheery']]},
    {id:'marge',look:'marge',anchor:'pier',who:['MARGE'],show:[0,15],path:[[0,.8,6.2,-2.57]],acts:[[3,6.4,'wave'],[7.6,9.5,'offer'],[9.5,11,'shrug'],[11.1,14.6,'point']],moods:[[0,'friendly'],[9.4,'smirk'],[11.1,'cheery']]},
    {id:'tilly',look:'tilly',anchor:'pier',show:[0,15],path:[[0,1.6,14.2,0]],acts:[[0,15,'hold']],mood:'sleepy'},
    {id:'larry',look:'lemon larry',anchor:'kickflip',who:['LARRY'],show:[15,24],path:[[15,.6,4.4,.62],[16.2,.6,4.4],[17.1,1.1,5.2,.62]],acts:[[15,15.8,'fold'],[15.8,17.8,'point'],[19.6,21.6,'shrug'],[21.6,24,'fold']],moods:[[15,'smirk'],[19.5,'grumpy']]},
    {id:'crew1',look:'crew:3',anchor:'kickflip',show:[15,24],path:[[15,-.9,4.6,.5]],acts:[[15,24,'fold']],mood:'smirk'},
    {id:'crew2',look:'crew:8',anchor:'kickflip',show:[15,24],path:[[15,2.5,4.0,.85]],acts:[[15,20,'fold'],[20,24,'shrug']],moods:[[15,'grumpy'],[20,'smirk']]},
    {id:'hank',look:'hank hardtack',anchor:'strip',show:[24,30],path:[[24,-9,6.2,HP],[30,3,6.2,HP]],acts:[[24,30,'hold']],mood:'stern'},
    {id:'officer1',look:'police:4',anchor:'strip',show:[24,30],path:[[24,-11,5.5,HP],[30,1,5.5,HP]],mood:'stern'},
    {id:'officer2',look:'police:11',anchor:'strip',show:[24,30],path:[[24,-11.6,6.9,HP],[30,.4,6.9,HP]],mood:'grumpy'}]}},
 raid:{title:'Raid!',anchor:'home',shots:[
   {duration:3.2,cam:[[-15,4.6,-20],[-12,3.8,-17],[-10,3.2,-14]],look:[[-2,1.3,-7],[0,1.3,-4],[0,1.3,-1]],fov:[50,44],ease:'outCubic',fadeIn:.3},
   {duration:2.6,cam:[[2.5,1.7,-.9],[2.1,1.65,-1.1]],look:[[-.3,1.5,-2.8],[-.3,1.5,-2.2]],fov:[46,40],ease:'inOutSine',door:true,drift:.04},
   {duration:2.4,cam:[[0,6.4,-15],[0,6,-14],[0,5.6,-13]],look:[[0,1.3,0],[0,1.3,0],[0,1.3,0]],fov:[46,42],ease:'linear',fadeOut:.3,door:true}],
  beats:[
   {at:0,until:.8,kind:'music',music:'squad'},
   {at:0,until:8.2,kind:'amb',amb:'town'},
   {at:.2,until:3.2,kind:'sub',who:'',text:'Sirens. Two Sugar Squad vans skid up outside.'},
   {at:.1,until:8,kind:'sfx',sfx:'siren'},
   {at:3.2,until:5.8,kind:'sub',who:'INSPECTOR HARDTACK',text:'SUGAR SQUAD! Nobody move a single sprinkle!'},
   {at:3.9,until:4.3,kind:'sfx',sfx:'bonk'},
   {at:4,until:8.2,kind:'card',card:'hank'},
   {at:5.9,until:8.2,kind:'stamp',text:'RAID!'},
   {at:5.9,until:6.4,kind:'sfx',sfx:'stamp'}],
  cast:{props:[
    {kind:'van',anchor:'home',show:[0,8.2],bounce:1,path:[[0,-8.1,-11.7,.57],[1.1,-4.8,-6.6,.57]]},
    {kind:'van',anchor:'home',show:[0,8.2],bounce:1,path:[[0,7.6,-13.6,-.45],[1.2,4.9,-8.2,-.45]]}],
   actors:[
    {id:'hank',look:'hank hardtack',anchor:'home',who:['HARDTACK'],show:[1.1,8.2],path:[[1.1,-3.3,-6.0],[3.1,-.3,-1.7,0],[5.9,-.3,-1.7,0],[8.2,-.1,-.4]],acts:[[3.1,3.9,'bang'],[3.95,5.8,'megaphone'],[5.8,8.2,'point']],mood:'stern',moods:[[1.1,'stern'],[3.95,'wide'],[4.5,'stern']]},
    {id:'officer1',look:'police:6',anchor:'home',show:[1.2,8.2],path:[[1.2,3.3,-7.4],[3.5,1.5,-2.5,-.3],[5.9,1.5,-2.5],[8.2,.7,.6]],acts:[[3.5,5.9,'fold']],mood:'stern'},
    {id:'officer2',look:'police:12',anchor:'home',show:[1.3,8.2],path:[[1.3,-5.7,-5.4],[3.6,-1.9,-2.7,.45],[6.2,-1.9,-2.7],[8.2,-1.0,.2]],acts:[[3.6,6.2,'hold']],mood:'grumpy'}]}},
 act3:{title:'Act 3 · Going Big',anchor:'home',shots:[
   {duration:6,cam:[[-26,18,-30],[-16,14,-24],[-8,10,-18]],look:[[0,1,0],[0,1,0],[0,1,0]],fov:[54,48],ease:'inOutSine',fadeIn:1,fadeOut:.3},
   {duration:6.8,cam:[[4.4,1.8,-7.6],[3.1,1.72,-6.5]],look:[[1.2,1.55,-3.2],[1.2,1.55,-3.2]],fov:[40,34],ease:'inOutSine',fadeIn:.3,fadeOut:.8,drift:.025}],
  beats:[
   {at:.6,until:5.8,kind:'title',title:'GUMMY BAY',line:'Act 3 · Going Big'},
   {at:.3,until:1,kind:'music',music:'tender'},
   {at:0,until:12.8,kind:'amb',amb:'town'},
   {at:1,until:5.8,kind:'sub',who:'',text:'New keys. More room. Space for tents, a crew, and a lot more gummies.'},
   {at:6.2,until:9.6,kind:'sub',who:'GRAMPS (ON THE PHONE)',text:'A real base! I’m proud of you, kid. Now don’t let it go to your head.',phone:true},
   {at:9.7,until:12.8,kind:'sub',who:'GRAMPS (ON THE PHONE)',text:'Founders’ Day is coming. Hire some help. And say hi to Tilly at the pier for me.',phone:true}],
  cast:{props:[
    {kind:'crates',anchor:'home',x:-2.6,z:-3.4,yaw:.4,show:[0,12.8]},
    {kind:'crates',anchor:'home',x:3.4,z:-4.6,yaw:-.7,show:[0,12.8]}],
   actors:[
    {id:'helper1',look:'crew:14',anchor:'home',show:[0,6],path:[[0,-6,-13],[6,-1.6,-1.4]],acts:[[0,6,'carry']],mood:'cheery'},
    {id:'helper2',look:'folk:61',anchor:'home',show:[0,6],path:[[.6,-8.6,-11],[6,1.2,-1.6]],acts:[[0,6,'carry']],mood:'friendly'},
    {id:'player',look:'player',anchor:'home',show:[0,12.8],path:[[0,1.2,-3.2,2.57]],acts:[[.5,5.8,'wave'],[5.8,12.8,'phone']],moods:[[0,'friendly'],[6.4,'cheery'],[9.8,'smirk'],[11,'cheery']]}]}},
 finale:{title:'Founders’ Day',anchor:'pier',shots:[
   {duration:7,cam:[[-30,8,-30],[-20,7,-22],[-12,6,-16]],look:[[0,4,10],[0,5,10],[0,6,10]],fov:[52,48],ease:'inOutSine',fadeIn:1,fadeOut:.3,fireworks:true},
   {duration:4.6,cam:[[.9,1.2,-4.4],[.6,1.3,-3]],look:[[0,3.2,12],[0,3.3,10]],fov:[50,46],ease:'inOutSine',fadeIn:.3,drift:.03},
   {duration:4.4,cam:[[.3,1.8,1.6],[-.3,1.75,2.3]],look:[[-2.6,1.65,3.4],[-2.6,1.65,3.4]],fov:[38,33],ease:'inOutSine',drift:.02},
   {duration:4.2,cam:[[8,3,-14],[5,3.3,-12.5]],look:[[0,7,14],[0,9,14]],fov:[46,54],ease:'inOutSine',fireworks:true},
   {duration:3.8,cam:[[.7,1.7,6.6],[1.05,1.68,7.2]],look:[[3.2,1.62,8.5],[3.2,1.62,8.5]],fov:[38,34],ease:'inOutSine',fadeOut:.3,drift:.02},
   {duration:7,cam:[[-6,2,-8],[-4,2.2,-7],[-2,2.4,-6]],look:[[0,1.8,2],[0,2,2],[0,2.4,2]],fov:[44,40],ease:'inOutSine',fadeIn:.3,fadeOut:1.2,fireworks:true}],
  beats:[
   {at:.6,until:6.6,kind:'title',title:'FOUNDERS’ DAY',line:'Lucky Pier · 8:00 PM'},
   {at:.3,until:1,kind:'music',music:'parade'},
   {at:0,until:31,kind:'amb',amb:'crowd'},
   {at:1,until:6.6,kind:'sub',who:'BAY BUGLE RADIO',text:'Live from the pier, where the Founders’ Day parade has a… surprise float?'},
   {at:7,until:10.6,kind:'card',card:'float'},
   {at:7.4,until:11.6,kind:'sub',who:'',text:'A giant gummy bear rolls down the pier. In the cool sea breeze, it does not melt.'},
   {at:11.7,until:15.8,kind:'sub',who:'MAYOR PRUDENCE PLUM',text:'Is that… raspberry? Oh, that is delicious. Oh no. Oh, that is VERY delicious.'},
   {at:16,until:16.8,kind:'music',music:'parade'},
   {at:16.2,until:20,kind:'sub',who:'BAY BUGLE RADIO',text:'Breaking: the mayor calls a vote on the Sugar-Free Bay Act. The crowd is chanting “Gramps!”'},
   {at:16.2,until:24,kind:'chyron',head:'BREAKING',text:'Mayor Plum: “We may have been a little hasty”'},
   {at:20.2,until:24,kind:'sub',who:'',text:'Inspector Hardtack eats a gummy. He has never looked so confused, or so happy.'},
   {at:24,until:24.8,kind:'music',music:'reveal'},
   {at:24.4,until:28,kind:'card',card:'gramps'},
   {at:24.6,until:27.8,kind:'sub',who:'GRAMPS GUS',text:'Out on good behaviour, kid. You kept the lights on.'},
   {at:27.9,until:31,kind:'sub',who:'GRAMPS GUS',text:'Now, about Lemon Larry and that big house on the hill… Another time.'},
   {at:28.2,until:28.9,kind:'music',music:'tender'},
   {at:25,until:31,kind:'cap',title:'THE END?',line:'Candy Baron of Gummy Bay · free play continues'}],
  cast:{props:[{kind:'lectern',anchor:'pier',x:-2.0,z:3.4,yaw:HP,show:[0,31]}],
   actors:[
    {id:'mayor',look:'mayor prudence',anchor:'pier',who:['MAYOR','PLUM'],show:[0,31],path:[[0,-2.7,3.4,HP]],acts:[[1,6.6,'wave'],[11.7,14.2,'eat'],[14.2,16,'cheer'],[16.2,20,'wave']],moods:[[0,'cheery'],[11.7,'wide'],[13.4,'cheery']]},
    {id:'hank',look:'hank hardtack',anchor:'pier',show:[0,31],path:[[0,3.4,8.5,-HP]],acts:[[0,20.2,'fold'],[20.4,22.6,'eat'],[22.6,24,'cheer']],moods:[[0,'stern'],[20.4,'wide'],[22.4,'cheery']]},
    {id:'tilly',look:'tilly',anchor:'pier',show:[0,31],path:[[0,2.6,11.2,-2.4]],acts:[[0,31,'cheer']],mood:'cheery'},
    ...[[-3.7,-.5,6],[-3.6,1.6,17],[-3.8,6.8,29],[3.7,.5,33],[3.6,3.2,41],[3.8,5.6,52]].map(([x,z,n],i)=>({id:'crowd'+i,look:(i%3===1?'kid:':'folk:')+n,anchor:'pier',show:[0,31],path:[[0,x,z,x<0?HP:-HP]],
     acts:[[.4+i*.2,7,i%2?'clap':'cheer'],[16+i*.15,24,'cheer'],[24.2,31,i%2?'wave':'clap']],mood:'cheery'})),
    {id:'gramps',look:'gramps',anchor:'pier',who:['GRAMPS'],show:[24,31],path:[[24,.2,8.2],[27.6,-.9,-1.2,-2.7]],acts:[[25,29.6,'wave'],[29.6,31,'cheer']],mood:'cheery'}]}}
});
// Resolve the shots of a cutscene against real anchors (home = the player's base door).
export function cutTimeline(id,anchors={}){
 const cut=CUTS[id];if(!cut)return null;
 const resolve=name=>anchors[name]||CUT_ANCHORS[name]||anchors.home||{x:0,z:0};
 const defs=cut.shots.map(d=>shot(resolve(d.anchor||cut.anchor),d));
 return createTimeline(defs);
}
export function cutDuration(id){return CUTS[id]?CUTS[id].shots.reduce((t,s)=>t+s.duration,0):0;}
export function storyCutAt(id,timeline,seconds){
 const cut=CUTS[id];if(!cut||!timeline)return null;
 const t=Math.max(0,Math.min(timeline.duration,Number.isFinite(seconds)?seconds:0));
 const at=timeline.at(t),beats=cut.beats.filter(b=>t>=b.at&&t<b.until),pick=k=>beats.filter(b=>b.kind===k).pop()||null;
 return {...at,time:t,done:Number.isFinite(seconds)&&seconds>=timeline.duration,
  sub:pick('sub'),cap:pick('cap'),card:pick('card'),chyron:pick('chyron'),stamp:pick('stamp'),sfx:beats.filter(b=>b.kind==='sfx').map(b=>b.sfx),
  title:pick('title'),music:beats.filter(b=>b.kind==='music').map(b=>b.music),amb:pick('amb')?.amb||'',
  fireworks:!!at.shot.fireworks,letterbox:true,get titleIn(){const b=this.title;return b?Math.max(0,Math.min(1,(t-b.at)/.6,(b.until-t)/.5)):0;}};
}

// ---- Name cards (original procedural SVG, comedy freeze-frame style) ----
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const face=(skin,hair,extra='')=>`<circle cx="100" cy="92" r="46" fill="${skin}" stroke="#2b1d14" stroke-width="4"/>${hair}<circle cx="84" cy="90" r="5" fill="#2b1d14"/><circle cx="116" cy="90" r="5" fill="#2b1d14"/>${extra}`;
export const CARDS=Object.freeze({
 marge:{name:'MARGE',role:'Bait & tackle · supplier',quip:'Sells gelatin “for fishing”. Has never fished.',bg:'#2f6f8f',
  art:face('#f0c9a5','<path d="M56 80 q44 -62 88 0 q-10 -28 -44 -30 q-34 2 -44 30z" fill="#e8e3da" stroke="#2b1d14" stroke-width="3"/><circle cx="100" cy="38" r="14" fill="#e8e3da" stroke="#2b1d14" stroke-width="3"/>','<path d="M86 112 q14 10 28 0" stroke="#2b1d14" stroke-width="4" fill="none"/><rect x="66" y="84" width="28" height="14" rx="7" fill="none" stroke="#2b1d14" stroke-width="3"/><rect x="106" y="84" width="28" height="14" rx="7" fill="none" stroke="#2b1d14" stroke-width="3"/><path d="M60 146 q40 -14 80 0 v24 h-80z" fill="#e0b13a" stroke="#2b1d14" stroke-width="3"/>')},
 larry:{name:'LEMON LARRY',role:'Leader of the Sour Crew',quip:'Has not smiled since 2009. Allergic to fun.',bg:'#9bbf1f',
  art:face('#f6e05a','<path d="M54 74 h92 l-8 -14 h-76z" fill="#6fb52c" stroke="#2b1d14" stroke-width="3"/><path d="M140 66 l22 -6 l-6 14z" fill="#6fb52c" stroke="#2b1d14" stroke-width="3"/>','<path d="M84 118 q16 -8 32 0" stroke="#2b1d14" stroke-width="4" fill="none"/><path d="M74 80 l18 4 M126 80 l-18 4" stroke="#2b1d14" stroke-width="4"/><path d="M60 146 q40 -14 80 0 v24 h-80z" fill="#3c4a24" stroke="#2b1d14" stroke-width="3"/>')},
 hank:{name:'INSP. HANK HARDTACK',role:'Sugar Squad · Candy Crimes',quip:'Has confiscated 1.2 million lollipops. Licked none.',bg:'#2a3f6e',
  art:face('#e7bf98','<path d="M52 72 h96 v-16 q-48 -26 -96 0z" fill="#1d2a4a" stroke="#2b1d14" stroke-width="3"/><rect x="52" y="66" width="96" height="8" fill="#f2c230"/>','<path d="M80 114 h40" stroke="#2b1d14" stroke-width="4"/><path d="M76 104 q24 -8 48 0" stroke="#6b4a2e" stroke-width="7" fill="none"/><path d="M60 146 q40 -14 80 0 v24 h-80z" fill="#8a8f96" stroke="#2b1d14" stroke-width="3"/>')},
 float:{name:'THE GREAT GUMMY FLOAT',role:'Founders’ Day · Lucky Pier',quip:'40,000 gummies. One cool sea breeze. Zero melting.',bg:'#c2414d',
  art:'<circle cx="70" cy="52" r="16" fill="#ee6269" stroke="#7a1f26" stroke-width="4"/><circle cx="130" cy="52" r="16" fill="#ee6269" stroke="#7a1f26" stroke-width="4"/><ellipse cx="100" cy="78" rx="44" ry="38" fill="#ee6269" stroke="#7a1f26" stroke-width="4"/><circle cx="86" cy="74" r="5" fill="#4a1218"/><circle cx="114" cy="74" r="5" fill="#4a1218"/><path d="M86 92 q14 12 28 0" stroke="#4a1218" stroke-width="4" fill="none"/><ellipse cx="100" cy="138" rx="52" ry="34" fill="#e8555d" stroke="#7a1f26" stroke-width="4"/><rect x="40" y="166" width="120" height="14" rx="4" fill="#a98b62" stroke="#5a4630" stroke-width="3"/>'},
 gramps:{name:'GRAMPS GUS',role:'Legend · finally home',quip:'Back on the pier. Still has the recipe tin.',bg:'#7a5230',
  art:face('#e9c3a0','<path d="M58 70 q42 -40 84 0" fill="#f4f1ea" stroke="#2b1d14" stroke-width="3"/>','<path d="M76 110 q24 22 48 0 q-24 34 -48 0z" fill="#f4f1ea" stroke="#2b1d14" stroke-width="3"/><path d="M60 146 q40 -14 80 0 v24 h-80z" fill="#b84a3a" stroke="#2b1d14" stroke-width="3"/>')}
});
export function storyCardHtml(id){
 const c=CARDS[id];if(!c)return '';
 return `<figure class="story-card ${esc(id)}" style="--card:${c.bg}"><svg viewBox="0 0 200 180" role="img" aria-label="${esc(c.name)}">${c.art}</svg><figcaption><strong>${esc(c.name)}</strong><span>${esc(c.role)}</span><em>${esc(c.quip)}</em></figcaption></figure>`;
}

// v143: a story beat never interrupts live play. Returns the reason to wait, or ''.
export function storyHold({chase='clear',search=false,driving=false,skateSpeed=0,arcade=false,station=false,placing=false}={}){
 if(chase&&chase!=='clear')return 'chase';
 if(search)return 'search';
 if(driving)return 'driving';
 if(Number.isFinite(skateSpeed)&&skateSpeed>1)return 'skating';
 if(arcade)return 'arcade';
 if(station)return 'station';
 if(placing)return 'placing';
 return '';
}
