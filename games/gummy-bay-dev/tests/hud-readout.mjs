import assert from 'node:assert/strict';
import {weekdayClock,compassView,policeBanner,phoneBadges,curfewCue,revealTownPlaces} from '../dist/hud-readout.mjs';

assert.equal(weekdayClock(1,540).label,'Day 1 · Mon 09:00');
assert.equal(weekdayClock(1,540).weekday,'Monday');
assert.equal(weekdayClock(8,0).short,'Mon');
assert.equal(weekdayClock(3,1439).clock,'23:59');
assert.equal(weekdayClock(-2,Infinity).label,'Day 1 · Mon 00:00');

const north=compassView({yaw:0,x:0,z:0,markers:[{label:'Payphone',icon:'◆',x:0,z:-40}]});
assert.equal(north.cardinal,'N');
assert.equal(north.markers[0].metres,40);
assert.ok(Math.abs(north.markers[0].offset)<2,'north marker stays centred when facing north');
const east=compassView({yaw:0,x:0,z:0,markers:[{label:'Shop',x:25,z:0}]});
assert.ok(east.markers[0].offset>80&&east.markers[0].offset<100,'east marker sits to the right');
const turned=compassView({yaw:-Math.PI/2,x:0,z:0,markers:[{label:'Shop',x:25,z:0}]});
assert.ok(Math.abs(turned.markers[0].offset)<2,'facing east centres an eastern marker');
assert.equal(compassView({yaw:0,x:0,z:0,markers:[null,{x:'no'},{label:'Ok',x:1,z:1},{label:'Two',x:2,z:2},{label:'Three',x:3,z:3},{label:'Four',x:4,z:4},{label:'Five',x:5,z:5}]}).markers.length,4);

assert.deepEqual(policeBanner({heat:0,stage:'clear'}),{visible:false,id:'clear',label:'',countdown:null});
assert.equal(policeBanner({heat:40}).label,'POLICE CALLED');
assert.equal(policeBanner({stage:'stop'}).label,'POLICE CALLED');
assert.equal(policeBanner({stage:'pursuit'}).label,'WANTED');
assert.equal(policeBanner({stage:'pursuit',armed:true}).label,'WANTED - ARMED');
assert.equal(policeBanner({stage:'pursuit',armed:'yes'}).label,'WANTED');
const arrest=policeBanner({stage:'search',searchRemaining:2,duration:4});
assert.equal(arrest.label,'UNDER ARREST');
assert.equal(arrest.countdown,.5);
assert.equal(policeBanner({stage:'search'}).countdown,1);
assert.equal(policeBanner({heat:90,stage:'search'}).id,'arrest');

const badges=phoneBadges({threads:{0:{messages:[{mine:false,text:'hi'}]},1:{messages:[{mine:true,text:'yo'}]}},deals:[{},{}],listing:{qty:1}});
assert.deepEqual(badges,{phone:1,deals:2,listing:1,contacts:0,wallet:0,map:0});
assert.equal(phoneBadges(null).phone,0);
assert.equal(curfewCue(1,1230).text.includes('20:30'),true);
assert.equal(curfewCue(1,240),null);
assert.equal(curfewCue(2,241).id,'sleep');
assert.equal(curfewCue(2,900),null);
const town='<h2>Map</h2><canvas id="townOverview" width="560" height="260"></canvas><p>Guide</p><div class="item"><div><strong>Hank</strong><p>West</p></div><button class="primary">Track</button></div>';
const revealed=revealTownPlaces(town);
assert.ok(revealed.includes('class="town-places"'));
assert.ok(revealed.indexOf('class="town-places"')<revealed.indexOf('Hank'));
assert.ok(revealed.indexOf('</canvas>')<revealed.indexOf('class="town-places"'));
assert.equal(revealTownPlaces(revealed),revealed);
assert.equal(revealTownPlaces('<p>No drawing</p>'),'<p>No drawing</p>');
console.log('PASS: weekday clock, compass offsets, police banner, phone badges and town-map list.');
