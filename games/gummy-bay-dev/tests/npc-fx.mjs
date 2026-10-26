import assert from 'node:assert/strict';
import {EFFECTS} from '../dist/mix-core.mjs';
import {FX_KINDS,EFFECT_FX,FX_MAX_KINDS,FX_MIN_MINUTES,FX_MAX_MINUTES,fxKinds,fxMinutes,startFx,fxActive,fxStrength,fxFrame,fxLine,chooseReaction,reactionLine,reactionPose,REACT_RANGE,REACT_SECONDS,crowdFriendly,idleBeat,satisfactionScore,satisfactionTier,customerFeedback,customerDislike} from '../dist/npc-fx.mjs';
import {createJointSet,proceduralJoints} from '../dist/people-kit.mjs';
import {createStreetCrowd} from '../dist/street-crowd.mjs';
import * as THREE from '../dist/vendor/three.module.min.js';

// Mapping: every mix effect has one cartoon look, and every look is defined.
for(const e of EFFECTS){assert.ok(EFFECT_FX[e.id],'mapped '+e.id);assert.ok(FX_KINDS[EFFECT_FX[e.id]],'kind exists for '+e.id);}
assert.equal(Object.keys(EFFECT_FX).length,EFFECTS.length,'no stray mappings');
const want={spry:'bouncy',sunny:'giggly',sparking:'sparkly',tiny:'tiny',looming:'big',luminous:'glowy',still:'slowmo',zippy:'zoomies',buoyant:'floaty',bright:'rainbow',drowsy:'sleepy',lanky:'lanky'};
for(const [id,kind] of Object.entries(want))assert.equal(EFFECT_FX[id],kind,id+' shows as '+kind);
for(const kind of ['bouncy','giggly','sparkly','tiny','big','glowy','slowmo','zoomies','floaty','rainbow','sleepy'])assert.ok(Object.values(EFFECT_FX).includes(kind),kind+' is reachable from a mix');
// Family-friendly copy: no drug slang in any line.
const banned=/\b(high|stoned|baked|trip|tripping|buzzed|wasted|drunk|weed|dope|blazed|munchies)\b/i;
for(const kind of Object.values(FX_KINDS))for(const line of kind.lines)assert.ok(!banned.test(line),'clean line: '+line);
// Strongest first, duplicates collapse, at most three looks.
assert.deepEqual(fxKinds(['sunny','tiny','luminous']),['tiny','glowy','giggly']);
assert.deepEqual(fxKinds(['zippy','restless','brisk']),['zoomies'],'three zoomies effects show once');
assert.ok(fxKinds(EFFECTS.map(e=>e.id)).length===FX_MAX_KINDS);
assert.deepEqual(fxKinds(['nope']),[]);assert.equal(startFx([],600),null);assert.equal(startFx(['nope'],600),null);
// Durations: 2–4 game hours, stronger mixes last longer.
assert.equal(fxMinutes(['still']),FX_MIN_MINUTES+8);
assert.ok(fxMinutes(['tiny','shambling','looming','lanky','buoyant'])<=FX_MAX_MINUTES);
assert.ok(fxMinutes(['tiny','luminous'])>fxMinutes(['sunny']));
for(const e of EFFECTS){const m=fxMinutes([e.id]);assert.ok(m>=FX_MIN_MINUTES&&m<=FX_MAX_MINUTES,e.id+' '+m);}
const entry=startFx(['tiny','luminous','sunny'],1000);
assert.equal(entry.until-entry.start,fxMinutes(['tiny','luminous','sunny']));
assert.ok(!fxActive(entry,999)&&fxActive(entry,1000)&&!fxActive(entry,entry.until));
assert.equal(fxStrength(entry,1000),0,'ramps in from zero');
assert.equal(fxStrength(entry,1060),1,'full strength mid-way');
assert.ok(fxStrength(entry,entry.until-5)<.5,'fades over the last minutes');
// Frame: tiny shrinks, glowy glows and tints, giggly talks; low thins particles.
const f=fxFrame(entry,1060,2,0),low=fxFrame(entry,1060,2,0,{low:true});
assert.ok(Math.abs(f.scale[1]-.6)<1e-9&&f.glow>0&&f.tint&&f.particles.length===2);
assert.ok(low.particles.every((p,i)=>p.rate<f.particles[i].rate),'low quality emits fewer particles');
assert.equal(fxFrame(entry,entry.until+1,0,0).on,false);
const bouncy=startFx(['spry'],0),hops=[...Array(20)].map((_,i)=>fxFrame(bouncy,60,i*.1,0).lift);
assert.ok(Math.max(...hops)>.15&&Math.min(...hops)<.05,'bouncy hops');
assert.ok(fxFrame(startFx(['buoyant'],0),60,0,0).lift>.2,'floaty hovers');
assert.ok(fxFrame(startFx(['zippy'],0),60,0,0).orbit.radius>.5,'zoomies lap');
assert.ok(fxFrame(startFx(['still'],0),60,0,0).animRate<.5,'slow-mo');
assert.ok(fxFrame(startFx(['looming'],0),60,0,0).scale[0]>1.2,'big');
const rb=[0,1,2].map(t=>fxFrame(startFx(['bright'],0),60,t,0).tint.color);assert.ok(new Set(rb).size===3,'rainbow cycles');
const sleepy=fxFrame(startFx(['drowsy'],0),60,0,0);assert.ok(sleepy.particles.some(p=>p.style==='z'),'sleepy Zs');
const both=fxFrame(startFx(['tiny','looming'],0),60,0,0);assert.ok(both.scale[0]>=.5&&both.scale[0]<=1.5);
assert.ok(fxLine(entry,0,0).length>0);
// Reactions: priority and ranges.
assert.equal(chooseReaction({distance:3,chase:true,friendly:true}),'flee');
assert.equal(chooseReaction({distance:REACT_RANGE.flee+1,chase:true}),'idle');
assert.equal(chooseReaction({distance:30,scuffle:{age:1,distance:2}}),'cower');
assert.equal(chooseReaction({distance:30,scuffle:{age:1,distance:8}}),'backoff');
assert.equal(chooseReaction({distance:30,scuffle:{age:7,distance:2}}),'idle','old scuffles fade');
assert.equal(chooseReaction({distance:30,trick:{age:1,distance:10}}),'point');
assert.equal(chooseReaction({distance:3,friendly:true}),'wave');
assert.equal(chooseReaction({distance:3,friendly:true,waved:true}),'look','one wave per approach');
assert.equal(chooseReaction({distance:3}),'look');
assert.equal(chooseReaction({distance:3,calling:true,chase:true}),'call');
assert.equal(chooseReaction({}),'idle');
for(const k of ['flee','cower','backoff','call','point','wave'])assert.ok(reactionLine(k,1)&&REACT_SECONDS[k]>0);
assert.ok(reactionPose('wave',0).armR.x<-2,'wave raises the arm');
assert.ok(reactionPose('cower').crouch>0&&reactionPose('cower').armL,'cower crouches');
assert.ok(crowdFriendly(3)&&!crowdFriendly(1)&&crowdFriendly(1,50));
const beats=[...Array(32)].flatMap((_,id)=>[...Array(60)].map((_,t)=>idleBeat(id,t*5))).filter(Boolean);
assert.ok(beats.length>40&&new Set(beats.map(b=>b.kind)).size>=5,'idle variety');
// Person kit: a raised arm moves the hand above the head; head turns.
const root=new THREE.Matrix4(),j1=proceduralJoints(createJointSet(),root,{}),handDown=new THREE.Vector3().setFromMatrixPosition(j1.foreR).y;
const j2=proceduralJoints(createJointSet(),root,reactionPose('wave',0)),handUp=new THREE.Vector3().setFromMatrixPosition(j2.foreR).y;
assert.ok(handUp>handDown+.4,'wave lifts the forearm '+handDown.toFixed(2)+'→'+handUp.toFixed(2));
const hips=new THREE.Vector3().setFromMatrixPosition(proceduralJoints(createJointSet(),root,reactionPose('cower')).hips).y;assert.ok(hips<.7,'cower crouches');
// Street crowd: flee moves away from the threat; look keeps walking.
const crowd=createStreetCrowd({scene:{add(){}},time:600});
const p=crowd.people[0],x0=p.x,z0=p.z;
p.react={kind:'flee',until:10,x:x0+1,z:z0,pose:null};
for(let i=0;i<20;i++)crowd.update({dt:.05,now:i*.05,time:600});
assert.ok(p.x<x0-1,'fled away from the threat');
p.react={kind:'cower',until:20,x:p.x+2,z:p.z,pose:reactionPose('cower')};const cx=p.x;crowd.update({dt:.05,now:11,time:600});assert.equal(p.x,cx,'cowering holds still');assert.equal(p.activity,'cower');
// Satisfaction: favourite effects delight, disliked ones annoy.
assert.equal(satisfactionTier(satisfactionScore(['zesty','sunny'],{favourite:'zesty'})),'delighted');
assert.equal(satisfactionTier(satisfactionScore(['sunny','keen'],{favourite:'zesty'})),'happy');
assert.equal(satisfactionTier(satisfactionScore(['still'],{favourite:'zesty'})),'okay');
assert.equal(satisfactionTier(satisfactionScore(['bitter','pungent'],{favourite:'zesty',dislike:'bitter'})),'grumpy');
const fb=customerFeedback(['zesty'],{favourite:'zesty',index:0});assert.ok(fb.text.includes('zesty')&&fb.relation>0&&fb.emote);
const bad=customerFeedback(['bitter','woozy'],{favourite:'zesty',dislike:'bitter',index:1});assert.equal(bad.tier,'grumpy');assert.ok(bad.relation<0&&bad.text.includes('bitter'));
assert.ok(['wary','pungent','woozy','bitter','restless','jittery','scattered','volatile'].includes(customerDislike(5)));
console.log('PASS: NPC gummy effects map all 34 mix effects to cartoon looks with 2–4 h durations and fades; reactions (flee, cower, back off, call, point, wave, look, idle beats) trigger by priority; crowd flees and cowers; satisfaction tiers drive emote, text and relationship.');
