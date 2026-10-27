import assert from 'node:assert/strict';import fs from 'node:fs';
import {STANDINGS,standingScore,standingOf,standingEffects,dealVerdict,grudgeFor,grudgeTick,migrateStanding,streetStanding,skipsOrderToday,askSooner,standingBarHTML,standingChangeText} from '../dist/relationship-status.mjs';
assert.deepEqual(STANDINGS,['Hostile','Unfriendly','Neutral','Friendly','Loyal']);
// New locals start Neutral; relationship pushes up to Loyal; grudge can drop them to Hostile.
assert.equal(standingOf(standingScore(0)).label,'Neutral');
assert.equal(standingOf(standingScore(30)).label,'Friendly');
assert.equal(standingOf(standingScore(70)).label,'Loyal');
assert.equal(standingOf(standingScore(0,10)).label,'Unfriendly');
assert.equal(standingOf(standingScore(0,40)).label,'Hostile');
// Effects: price, order rate, referrals.
assert.ok(standingEffects(0).price<1&&standingEffects(4).price>1&&standingEffects(2).price===1);
assert.ok(standingEffects(0).orders<standingEffects(2).orders&&standingEffects(2).orders<standingEffects(4).orders);
assert.equal(standingEffects(1).referral,0);assert.ok(standingEffects(4).referral>standingEffects(3).referral);
assert.equal(standingEffects(0).buys,false);
// Deal verdicts.
assert.deepEqual(dealVerdict({price:25,fair:30}),['goodDeal']);
assert.deepEqual(dealVerdict({price:31,fair:30}),['fairDeal']);
assert.deepEqual(dealVerdict({price:45,fair:30,enjoyment:.1}),['ripoff','badProduct']);
assert.ok(grudgeFor('caught')>grudgeFor('ripoff'));assert.equal(grudgeFor('goodDeal'),0);
assert.equal(grudgeTick(10,2),2);assert.equal(grudgeTick(3,5),0);
// regulars.mjs migration: chats and purchases become a starting score above Neutral.
const old={name:'Jo',n:4,first:1,last:3,bought:2};assert.ok(migrateStanding(old)>45);assert.equal(old.std,migrateStanding(old));
const fresh={name:'Al',n:1,first:1,last:1,bought:0};assert.equal(standingOf(migrateStanding(fresh)).label,'Neutral');
assert.equal(streetStanding(fresh,'caught').label,'Unfriendly');streetStanding(fresh,'snitched');assert.equal(streetStanding(fresh,'snitched').label,'Hostile');
// Order frequency: Hostile skips most days; Neutral never; Loyal asks sooner.
let skips=0;for(let d=1;d<=200;d++)if(skipsOrderToday(0,d,3))skips++;assert.ok(skips>100&&skips<190,'hostile skips '+skips);
for(let d=1;d<=50;d++)assert.equal(skipsOrderToday(2,d,3),false);
assert.equal(askSooner(2),0);assert.ok(askSooner(4)>askSooner(3));
// Bar markup.
const bar=standingBarHTML(standingOf(85));assert.match(bar,/rel-status rel-l4/);assert.match(bar,/Loyal/);assert.match(bar,/width:85%/);assert.match(bar,/role="meter"/);
assert.match(standingChangeText('Jo',standingOf(50),standingOf(65)),/warms up · now Friendly/);assert.equal(standingChangeText('Jo',standingOf(50),standingOf(55)),'');
// Wiring.
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/relationship-status\.mjs\?v=175/);
for(const re of [/const relFair=rosterFair;rosterFair=function/,/const relAct=doAction;doAction=function/,/const relAsks=postCravingAsks;postCravingAsks=function/,/const relRender=talkRender;talkRender=function/,/const relSale=talkStreetSale;talkStreetSale=function/,/relStandingDecor\(box,nt\.type,nt\.i\)/,/window\.__relQa=/])assert.match(game,re);
const css=fs.readFileSync(new URL('../dist/people-talk.css',import.meta.url),'utf8');assert.match(css,/\.rel-status \.rel-bar/);assert.match(css,/\.rel-l4\{--rel:/);
const idx=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');assert.match(idx,/game\.js\?v=17\d/);
console.log('v175 relationship status ok');
