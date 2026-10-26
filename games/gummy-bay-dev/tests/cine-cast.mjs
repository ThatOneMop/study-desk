import assert from 'node:assert/strict';
import fs from 'node:fs';
import {VOICES,voiceFor,blipSchedule,blipsFor,mouthOpen,GESTURES,placeLocal,yawLocal,resolveCast,castAt,propsAt,PROP_KINDS,propPartCount,cameraDrift,STINGERS} from '../dist/cine-cast.mjs';
import {CUTS,CUT_ANCHORS,storyCutAt,cutTimeline} from '../dist/story-acts.mjs';
import {ACT1_CAST,ACT1_DURATION} from '../dist/story-act1.mjs';
// v149 cutscene acting kit: deterministic, seekable, DOM-free.
// Voices: every speaker gets a synthesised blip voice; blips are deterministic and fit their subtitle.
for(const [who,key] of [['GRAMPS GUS','gramps'],['GRAMPS (ON THE PHONE)','gramps'],['MAYOR PRUDENCE PLUM','mayor'],['INSPECTOR HARDTACK','hank'],['MARGE','marge'],['LEMON LARRY','larry'],['BAY BUGLE RADIO','radio'],['THE NOTE','note']])assert.equal(voiceFor(who),key,who);
assert.equal(voiceFor(''),null);
const b1=blipSchedule('Sugar Squad! Step away from the gummies, Gus!','hank',2.6),b2=blipSchedule('Sugar Squad! Step away from the gummies, Gus!','hank',2.6);
assert.deepEqual(b1,b2,'deterministic');assert.ok(b1.length>=8);assert.ok(b1.at(-1).at+b1.at(-1).dur<=2.6,'fits the line');
assert.ok(b1.every(b=>b.hz>40&&b.hz<1200));assert.equal(blipsFor('x','THE NOTE',1).length,0,'the note is silent');
assert.ok(mouthOpen(b1,b1[0].at+.01)===true&&mouthOpen(b1,99)===false);
// Anchors: local offsets rotate with the anchor, like story-acts off().
assert.deepEqual(placeLocal({x:10,z:5,yaw:0},1,2),[11,7]);
const [rx,rz]=placeLocal({x:0,z:0,yaw:Math.PI},1,2);assert.ok(Math.abs(rx+1)<1e-9&&Math.abs(rz+2)<1e-9);
assert.ok(Math.abs(yawLocal({yaw:.5},1)-.5)<1e-9);
// Cast sampling: walking, stopping, facing, speaking, listeners turning, hiding.
const cast=resolveCast({actors:[{id:'a',look:'gramps',who:['GRAMPS'],show:[0,10],path:[[0,0,0],[2,0,4,Math.PI]],acts:[[3,5,'wave']]},{id:'b',look:'folk:3',show:[[0,2],[6,8]],path:[[0,3,4,0]]}],props:[{kind:'van',show:[0,10],path:[[0,0,-5,0],[1,0,0,0]],bounce:1},{kind:'bear',x:0,z:0,melt:[2,4]}]});
const at=(t,sp)=>castAt(cast,t,sp);
assert.ok(at(1)[0].speed>1.5&&at(1)[0].pose.swing!==0,'walks along the path');
assert.ok(Math.abs(at(1)[0].yaw)<.05,'faces where it walks (+z)');
assert.ok(at(4)[0].speed<.01&&Math.abs(Math.abs(at(4)[0].yaw)-Math.PI)<.05,'stops and turns to its mark');
assert.ok(at(4)[0].pose.armR||at(4)[0].pose.armL,'gestures while acting');
const line={who:'GRAMPS GUS',text:'One for you, one for you and one for the road!',at:3.5,until:6};
assert.ok(at(4,line)[0].speaking&&Array.from({length:50},(_,i)=>at(3.5+i*.05,line)[0].face).includes('talk'),'lip-flap while speaking');
assert.equal(at(3,null).length,1,'b hidden between its show windows');assert.equal(at(7).length,2);assert.equal(at(11).length,0);
const listener=castAt(cast,7,{...line,at:6.5,until:9}).find(a=>a.id==='b');assert.ok(listener.pose.turn!==0,'listeners turn toward the speaker');
for(const a of at(4))for(const k of ['x','y','z','yaw','speed'])assert.ok(Number.isFinite(a[k]),k);
const pr=propsAt(cast,.5);assert.equal(pr.length,2);assert.ok(pr[0].z<0&&pr[0].z>-5);assert.ok(propsAt(cast,3)[1].melt>.3&&propsAt(cast,3)[1].melt<.7,'bear melts over its window');
for(const [k,parts] of Object.entries(PROP_KINDS)){assert.ok(parts.length>0&&propPartCount(k)===parts.length,k);for(const p of parts)assert.ok(['s','r','g'].includes(p.m)&&p.s.every(v=>v>0),k);}
assert.ok(Object.values(PROP_KINDS).reduce((n,p)=>n+p.length,0)<320,'all props fit one stage');
for(const [k,g] of Object.entries(GESTURES))assert.ok(typeof g==='function'||typeof g==='object',k);
const d=cameraDrift(3,.05);assert.ok(Math.abs(d.x)<.08&&Math.abs(d.y)<.05);{const z=cameraDrift(3,0);assert.ok(Math.abs(z.x)+Math.abs(z.y)+Math.abs(z.z)===0);}
// Every cutscene's cast resolves; nobody uses an unknown gesture or prop; casts fit the stage.
const anchors={...CUT_ANCHORS,home:{x:-25,z:48.5,yaw:Math.PI}};
for(const [id,cut] of Object.entries(CUTS)){
 assert.ok(cut.cast&&cut.cast.actors.length>=3,id+' has a cast');const c=resolveCast(cut.cast,anchors),tl=cutTimeline(id,anchors);
 for(const a of cut.cast.actors)for(const [,,g] of a.acts||[])assert.ok(GESTURES[g],id+' gesture '+g);
 for(const p of cut.cast.props||[])assert.ok(PROP_KINDS[p.kind],id+' prop '+p.kind);
 let most=0,parts=0;for(let t=0;t<=tl.duration;t+=.25){const s=storyCutAt(id,tl,t),list=castAt(c,t,s.sub);most=Math.max(most,list.length);parts=Math.max(parts,propsAt(c,t).reduce((n,p)=>n+propPartCount(p.kind),0));for(const a of list)assert.ok(Number.isFinite(a.x+a.z+a.yaw),id+' finite at '+t);}
 assert.ok(most<=14,id+' cast fits 14 people ('+most+')');assert.ok(parts<=320,id+' props fit');
 for(const m of cut.beats.filter(b=>b.kind==='music'))assert.ok(STINGERS[m.music],id+' stinger '+m.music);
 assert.ok(cut.beats.some(b=>b.kind==='amb'),id+' ambience');
}
{let most=0;const c=resolveCast(ACT1_CAST);for(let t=0;t<=ACT1_DURATION;t+=.25)most=Math.max(most,castAt(c,t).length);assert.ok(most<=14,'Act 1 fits 14 people ('+most+')');}
// Speakers on screen lip-sync: Marge, Larry, Hank (raid), the mayor and Gramps (finale).
for(const [id,t,actor] of [['act2',9,'marge'],['act2',17,'larry'],['raid',4.5,'hank'],['finale',13,'mayor'],['finale',26,'gramps']]){const tl=cutTimeline(id,anchors),s=storyCutAt(id,tl,t),a=castAt(resolveCast(CUTS[id].cast,anchors),t,s.sub).find(x=>x.id===actor);assert.ok(a&&a.speaking,id+' '+actor+' speaks at '+t);}
// Wiring: one stage for all cutscenes, audio stops on skip, quiet flashback.
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.ok(game.includes('createCineStage({THREE,scene,capacity:14,propCapacity:320})'));
assert.ok(game.includes('function cineFxEnd(fx){try{fx?.audio?.stop();}'),'skipping silences the cutscene bus');
assert.ok(/cineFxEnd\(intro\.fx\)/.test(game)&&/cineFxEnd\(c\.fx\)/.test(game),'Act 1 and story cuts both clean up');
assert.ok(game.includes('cineQuiet=at.quiet'),'the 1996 flashback hides today\'s crowds');
const stage=fs.readFileSync(new URL('../dist/cine-stage.mjs',import.meta.url),'utf8');assert.ok(!/https?:\/\//.test(stage.replace(/w3\.org/g,'')),'no external assets');
console.log('PASS: cutscene acting kit: deterministic blip voices for '+Object.keys(VOICES).length+' speakers, '+Object.keys(GESTURES).length+' gestures, '+Object.keys(PROP_KINDS).length+' instanced prop kinds, seekable walk/turn/lip-sync/listen cast sampling, every cut cast within 14 people and 320 prop parts, and game wiring.');
