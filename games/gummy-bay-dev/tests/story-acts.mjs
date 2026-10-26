import assert from 'node:assert/strict';
import {ACTS,QUESTS,QUEST_IDS,CUT_IDS,CUTS,CARDS,freshStory,normalizeStory,stepStory,markSeen,currentQuest,questProgress,currentAct,storyComplete,
 raidDue,raidShare,applyRaid,recordRaid,createStashGame,cutTimeline,cutDuration,storyCutAt,storyCardHtml,MAX_RAID_LOSS} from '../dist/story-acts.mjs';

// Data: two acts, every quest hooks a different system and pays something.
assert.deepEqual(ACTS.map(a=>a.id),['act2','act3']);
assert.equal(new Set(QUEST_IDS).size,QUESTS.length,'quest ids unique');
for(const hook of ['sales','mixing','skate','police','property','staff','arcade','finale'])assert.ok(QUESTS.some(q=>q.hook===hook),'hook '+hook);
for(const q of QUESTS){assert.ok(q.text.length>20&&q.title&&q.giver,q.id);assert.ok(q.reward.xp>0,q.id+' gives xp');assert.equal(q.goal({}).length,2);}
assert.equal(QUESTS.find(q=>q.id==='a3-pier').reward.cash,0,'arcade tickets never convert to cash');
const text=JSON.stringify(QUESTS)+JSON.stringify(CUTS)+JSON.stringify(CARDS);
assert.doesNotMatch(text,/\b(drug|weed|cocaine|meth|gun|shoot|kill|blood|damn|hell)\b/i,'family friendly');
assert.doesNotMatch(text,/schedule\s*i\b|hyland/i,'original script');

// Progression: closed until the first sale and the call home, then sequential.
let st=freshStory();const facts={sold:0,called:0,mixed:0,boards:0,raids:0,movedSinceRaid:0,helpers:0,tickets:0,time:600,atPier:false};
let r=stepStory(st,facts);assert.equal(r.story.open,false);assert.deepEqual(r.events,[]);
r=stepStory(st,{...facts,sold:1,called:1});assert.equal(r.story.open,false,'needs the call home too');
r=stepStory(st,{...facts,sold:1,called:2});st=r.story;
assert.equal(st.open,true);assert.deepEqual(r.events.map(e=>e.type+':'+(e.id||e.act)),['open:act2','cut:act2']);
assert.equal(currentQuest(st).id,'a2-marge');assert.equal(currentAct(st).id,'act2');
assert.deepEqual(questProgress(currentQuest(st),{...facts,sold:4}),{have:4,need:6,met:false,label:'4 / 6'});
st=markSeen(st,'act2');assert.deepEqual(st.seen,['act2']);
// Not met: nothing happens. Met: exactly one quest completes per step, even if later goals are met too.
r=stepStory(st,{...facts,sold:5,called:2});assert.deepEqual(r.events,[]);
const rich={sold:40,called:2,mixed:3,boards:1,raids:0,movedSinceRaid:0,helpers:3,tickets:99,time:1200,atPier:true};
r=stepStory(st,rich);assert.deepEqual(r.events.map(e=>e.type),['complete']);assert.equal(r.events[0].reward.cash,80);st=r.story;
r=stepStory(st,rich);assert.equal(r.events[0].id,'a2-mix');st=r.story;
r=stepStory(st,rich);assert.equal(r.events[0].id,'a2-board');st=r.story;
assert.equal(currentQuest(st).id,'a2-raid');
r=stepStory(st,rich);assert.deepEqual(r.events,[],'the raid has to actually happen');
// Raid triggers: the story raid fires at your base only.
assert.equal(raidDue(st,{atBase:false,heat:0,day:1}),null);
assert.equal(raidDue(st,{atBase:true,heat:0,day:1}),'story');
st=recordRaid(st,{day:3,home:0});assert.equal(st.raids,1);assert.equal(st.raidHome,0);
assert.equal(raidDue(st,{atBase:true,heat:10,day:3}),null,'story raid only once');
r=stepStory(st,{...rich,raids:st.raids});assert.equal(r.events[0].id,'a2-raid');st=r.story;
r=stepStory(st,{...rich,raids:1,movedSinceRaid:0});assert.deepEqual(r.events,[],'must move after the raid');
r=stepStory(st,{...rich,raids:1,movedSinceRaid:1});
assert.deepEqual(r.events.map(e=>e.type+':'+(e.id||e.act)),['complete:a2-move','cut:act3','open:act3']);st=markSeen(r.story,'act3');
for(const id of ['a3-crew','a3-pier','a3-empire']){r=stepStory(st,{...rich,raids:1,movedSinceRaid:1,atPier:false});assert.equal(r.events[0].id,id);st=r.story;}
r=stepStory(st,{...rich,raids:1,movedSinceRaid:1,atPier:true,time:17*60});assert.deepEqual(r.events,[],'finale waits for the evening');
r=stepStory(st,{...rich,raids:1,movedSinceRaid:1,atPier:true,time:19*60});
assert.deepEqual(r.events.map(e=>e.type+':'+(e.id||'')),['complete:a3-finale','cut:finale']);assert.equal(r.events[0].reward.cash,1000);
st=r.story;assert.equal(storyComplete(st),true);assert.equal(st.title,'Candy Baron of Gummy Bay');assert.equal(currentQuest(st),null);
assert.deepEqual(stepStory(st,rich).events,[],'free play continues quietly');
// Heat raids: >= 90 heat at base, not day 1, once per day.
assert.equal(raidDue(st,{atBase:true,heat:95,day:3}),null,'already raided today');
assert.equal(raidDue(st,{atBase:true,heat:95,day:4}),'heat');
assert.equal(raidDue(freshStory(),{atBase:true,heat:99,day:1}),null,'day 1 is protected');
assert.equal(raidDue(st,{atBase:true,heat:89,day:9}),null);

// Save/load: JSON round trip is lossless; junk is repaired; done stays a sequential prefix.
const back=normalizeStory(JSON.parse(JSON.stringify(st)));assert.deepEqual(back,st);
assert.deepEqual(normalizeStory(null),freshStory());assert.deepEqual(normalizeStory('x'),freshStory());
const odd=normalizeStory({open:'yes',done:['a2-mix','a2-marge','nope','a2-raid'],seen:['raid','bogus','act2'],raids:-4,title:'Cheater',raidHome:7,log:[1,'ok']});
assert.deepEqual(odd.done,['a2-marge','a2-mix'],'gaps are not skipped');assert.equal(odd.open,true);
assert.deepEqual(odd.seen,['act2','raid']);assert.equal(odd.raids,0);assert.equal(odd.title,'','titles need the finale');assert.equal(odd.raidHome,-1);assert.deepEqual(odd.log,['ok']);
// Older saves without story: a game already past the first sale opens Act 2 on its next step.
assert.equal(stepStory(undefined,{sold:12,called:2}).story.open,true);

// Raid loss: hide scales with score, flee is flat, never more than half; cash untouched.
assert.equal(raidShare('hide',1),0);assert.equal(raidShare('hide',0),MAX_RAID_LOSS);assert.equal(raidShare('hide',.5),.25);
assert.equal(raidShare('flee',1),.3);assert.equal(raidShare('hide',NaN),.5);assert.equal(raidShare('hide',-3),.5);
for(const [choice,score] of [['hide',0],['hide',.4],['flee',0],['hide',1]]){
 const out=applyRaid({packs:[10,3,1,0],storedPacks:[7],heat:96},{choice,score});
 [10,3,1,0].forEach((n,i)=>{assert.ok(out.packs[i]>=Math.ceil(n/2),choice+score+' cap');assert.ok(out.packs[i]<=n);});
 assert.ok(out.storedPacks[0]>=4);assert.equal(out.heat,35,'heat cools after a raid');
}
assert.equal(applyRaid({packs:[10]},{choice:'hide',score:0}).lost,5);assert.equal(applyRaid({},{}).lost,0);

// Stash minigame: deterministic, lanes are hittable only while a jar shows, score = saved share.
const g=createStashGame({seed:7});assert.equal(g.jars.length,8);
assert.ok(g.jars.every(j=>j.lane>=0&&j.lane<4&&j.until<=g.duration+1));
assert.equal(g.hit(g.jars[0].lane,0),-1,'too early');
assert.equal(g.hit(g.jars[0].lane,g.jars[0].at+.1),0);assert.equal(g.hit(g.jars[0].lane,g.jars[0].at+.1),-1,'once');
for(const j of g.jars.slice(1,4))g.hit(j.lane,j.at+.05);
assert.equal(g.saved,4);assert.equal(g.score(),.5);assert.equal(g.done(1),false);assert.equal(g.done(6),true);
const perfect=createStashGame({seed:7});for(const j of perfect.jars)perfect.hit(j.lane,j.at+.01);assert.equal(perfect.score(),1);assert.equal(perfect.done(2),true);
assert.deepEqual(createStashGame({seed:3}).jars,createStashGame({seed:3}).jars);

// Cutscenes: every one samples cleanly across its whole length, letterboxed, with captions.
for(const id of CUT_IDS){
 const tl=cutTimeline(id,{home:{x:-54,z:61,yaw:1.2}});assert.ok(tl,id);
 assert.ok(Math.abs(tl.duration-cutDuration(id))<1e-9);assert.ok(tl.duration>=8&&tl.duration<=35,id+' length');
 let subs=0;for(let t=0;t<=tl.duration+.5;t+=.25){const a=storyCutAt(id,tl,t);
  for(const k of ['x','y','z','lookX','lookY','lookZ','fov'])assert.ok(Number.isFinite(a.pose[k]),id+' '+k+'@'+t);
  assert.ok(a.pose.fov>20&&a.pose.fov<80);assert.ok(a.fade>=0&&a.fade<=1);assert.equal(a.letterbox,true);if(a.sub)subs++;
  if(a.card)assert.match(storyCardHtml(a.card.card),/<svg/);}
 assert.ok(subs>8,id+' has dialogue');assert.equal(storyCutAt(id,tl,tl.duration+1).done,true);assert.equal(storyCutAt(id,tl,0).done,false);
}
assert.ok(storyCutAt('raid',cutTimeline('raid',{home:{x:0,z:0}}),6.5).stamp.text==='RAID!');
assert.equal(storyCutAt('nope',null,1),null);assert.equal(cutTimeline('nope'),null);
// The raid films the player's own base: the anchor moves the camera.
const p1=storyCutAt('raid',cutTimeline('raid',{home:{x:0,z:0}}),1).pose,p2=storyCutAt('raid',cutTimeline('raid',{home:{x:50,z:50}}),1).pose;
assert.ok(Math.abs(p2.x-p1.x-50)<1e-9&&Math.abs(p2.z-p1.z-50)<1e-9);
for(const id of Object.keys(CARDS))assert.match(storyCardHtml(id),new RegExp(CARDS[id].name.replace(/[.]/g,'\\.')));
assert.equal(storyCardHtml('<x>'),'');
console.log('story-acts: ok');
