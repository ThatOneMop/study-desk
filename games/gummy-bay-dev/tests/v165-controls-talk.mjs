import assert from 'node:assert/strict';import fs from 'node:fs';
import {createSprintLatch,wantsPointerLock,DOUBLE_TAP_WINDOW} from '../dist/input-latch.mjs';
import {TALK_RANGE,TALK_FACING,personName,personMood,MOODS,talkOptions,talkReply,gestureOffsets,GESTURE_TIME,talkPanelHTML,drawPortrait} from '../dist/people-talk.mjs';
// Double-tap W latches sprint until W is released; a slow second tap does not.
let l=createSprintLatch();assert.equal(l.down(0),false);l.up(.08);assert.equal(l.down(.2),true);assert.equal(l.down(.25),true,'auto-repeat keeps the latch');assert.equal(l.up(1),true);assert.equal(l.latched,false);
l=createSprintLatch();l.down(0);l.up(.1);assert.equal(l.down(.1+DOUBLE_TAP_WINDOW+.05),false,'slow tap');
l=createSprintLatch();l.down(0);l.up(.6);assert.equal(l.down(.7),false,'a long first press is not a tap');
// First click captures the mouse; touch, pens, panels and the opt-out never do.
const base={active:true,panel:'',pointerType:'mouse',button:0,locked:false,optOut:false};
assert.equal(wantsPointerLock(base),true);
for(const x of [{pointerType:'touch'},{pointerType:'pen'},{panel:'phone'},{locked:true},{optOut:true},{button:2},{active:false}])assert.equal(wantsPointerLock({...base,...x}),false,JSON.stringify(x));
// People: stable names and moods, sensible replies.
assert.equal(personName(4),personName(4));assert.notEqual(personName(1),personName(2));
for(let id=0;id<30;id++)assert.ok(MOODS.includes(personMood(id,600)));
assert.ok(TALK_RANGE>2&&TALK_RANGE<4&&TALK_FACING>.8);
const opts=talkOptions({packs:0});assert.deepEqual(opts.map(o=>o.id),['greet','cops','pitch','bye']);assert.equal(opts[2].disabled,true);assert.ok(!talkOptions({packs:3})[2].disabled);
const seq=v=>()=>v;
assert.equal(talkReply('pitch',{mood:'keen',packs:2,heat:0},seq(.1)).buy,true);
for(let i=0;i<50;i++){const r=talkReply('pitch',{mood:'grumpy',packs:2,heat:90,tutorial:true},Math.random);assert.ok(!r.snitch,'no snitching in the tutorial');}
assert.equal(talkReply('pitch',{mood:'grumpy',packs:2,heat:90},seq(.01)).buy,true);
assert.equal(talkReply('pitch',{mood:'grumpy',packs:2,heat:90},(()=>{let n=0;return()=>[.99,.1,0][n++]??0;})()).snitch,true);
assert.match(talkReply('cops',{mood:'chatty',cop:{dist:20,dir:'up ahead'}}).line,/up ahead/);
assert.match(talkReply('cops',{mood:'chatty',cop:null}).line,/Haven't seen/);
assert.equal(talkReply('bye',{}).end,true);
// Gestures: each reaction moves something, then settles to rest.
for(const k of Object.keys(GESTURE_TIME)){const g=gestureOffsets(k,GESTURE_TIME[k]*.37);assert.ok(Math.abs(g.headX)+Math.abs(g.headY)+Math.abs(g.headZ)+Math.abs(g.shoulder)+Math.abs(g.lean)+Math.abs(g.bob)>0||g.clip,k);const z=gestureOffsets(k,GESTURE_TIME[k]+.1);assert.ok(!z.clip&&z.headX===0&&z.shoulder===0,k+' settles');}
assert.equal(gestureOffsets('wave',.5).clip,'Wave');
// Panel markup escapes text and numbers the options.
const html=talkPanelHTML({name:'<Kev>',mood:'wary',line:'"hi"',options:opts,portrait:'data:image/png;base64,x'});
assert.ok(html.includes('&lt;Kev&gt;')&&html.includes('&quot;hi&quot;')&&html.includes('data-talk="pitch" disabled')&&html.includes('<span class="key">4</span>'));
const calls=[];const cx=new Proxy({},{get:(t,k)=>k==='fillStyle'?'':(...a)=>calls.push(k),set:()=>true});assert.equal(drawPortrait(cx,{skin:0xd9a066},64),true);assert.ok(calls.length>6);
// Rigged people take gesture offsets; game.js wires everything.
const cc0=fs.readFileSync('dist/cc0-people.mjs','utf8');assert.ok(cc0.includes('applyGesture(entry,g)')&&cc0.includes('unGesture(entry)')&&/Shoulder/.test(cc0));
const src=fs.readFileSync('dist/game.js','utf8');
for(const s of ["people-talk.mjs?v=165","input-latch.mjs?v=165","cc0-people.mjs?v=165","gesture:p.gestureKind?gestureOffsets(",'sprintLatch.down(','keys.control=true','canvas.requestPointerLock','openTalk(talkTarget)','talkPortrait(p)','window.__talk=',"starter=s.day<=1&&!(Number(sold)>1)",'First sales get a warning'])assert.ok(src.includes(s),s);
const css=fs.readFileSync('dist/people-talk.css','utf8');assert.ok(css.includes('.talk-card')&&css.includes('max-height:920px'));
const idx=fs.readFileSync('dist/index.html','utf8');assert.ok(idx.includes('people-talk.css?v=165')&&/game\.js\?v=(16[5-9]|1[7-9]\d)/.test(idx));
console.log('PASS: v165 controls (double-tap W sprint latch, C crouch, first-click mouse capture) and street talk ('+opts.length+' options, '+Object.keys(GESTURE_TIME).length+' reactions, portraits), tutorial sale warning');
