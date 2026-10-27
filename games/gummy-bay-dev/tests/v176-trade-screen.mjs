import assert from 'node:assert/strict';import fs from 'node:fs';
import {TRADE_MOODS,tradeRange,tradeStart,tradeTotal,tradeChance,chanceWord,customerAnswer,answerLine,tradeHTML,handoffHTML,HANDOFF_TONES,meetHTML} from '../dist/trade-screen.mjs';
assert.deepEqual(tradeRange(30),{min:15,max:60,step:1,fair:30});assert.equal(tradeStart(29.6),30);assert.equal(tradeTotal(28,3),84);
// Chance: 100 at or below fair, falls with price, penalty after a failed round.
assert.equal(tradeChance({price:30,fair:30}),100);assert.equal(tradeChance({price:20,fair:30}),100);
const c1=tradeChance({price:36,fair:30}),c2=tradeChance({price:45,fair:30});assert.ok(c1>c2&&c1<100,'chance falls '+c1+' '+c2);
assert.equal(tradeChance({price:36,fair:30},()=>70),70);assert.equal(tradeChance({price:36,fair:30,penalty:12},()=>70),58);
assert.equal(chanceWord(100),'Sure thing');assert.equal(chanceWord(5),'No chance');
// Customer answers.
assert.equal(customerAnswer({price:28,fair:30,chance:100,roll:.99}).kind,'accept');
assert.equal(customerAnswer({price:40,fair:30,chance:50,roll:.2}).kind,'accept');
const ctr=customerAnswer({price:40,fair:30,chance:10,roll:.9});assert.equal(ctr.kind,'counter');assert.ok(ctr.price>=30&&ctr.price<40,'counter between '+ctr.price);
assert.equal(customerAnswer({price:40,fair:30,chance:10,round:2,roll:.9}).kind,'decline');assert.equal(customerAnswer({price:70,fair:30,chance:0,roll:.9}).kind,'decline');
assert.match(answerLine({kind:'counter',price:33}),/\$33/);
// Markup.
const m={who:'Leanne',kind:'street',products:[{t:0,name:'Pine Pop',have:3,fair:24,color:'#93c35b'},{t:1,name:'Purple Cloud',have:1,fair:45}],pick:0,qty:2,maxQty:3,price:30,chance:40,answer:null};
const h=tradeHTML(m);for(const re of [/data-trade-pick="0"/,/data-trade-pick="1"/,/is-picked/,/data-trade="qty-"/,/data-trade="qty\+"/,/data-trade="price-"/,/data-trade="price\+"/,/type="range" id="tradePrice"/,/class="trade-fair"/,/Fair \$24/,/Accept chance/,/40%/,/Total <b>\$60/,/data-trade="offer"/,/data-trade="walk"/])assert.match(h,re);
const hc=tradeHTML({...m,answer:{kind:'counter',price:27,line:'Bit steep. I’ll do $27 each.'}});assert.match(hc,/data-trade="take">Accept \$27/);assert.match(hc,/data-trade="offer">Counter \$30/);assert.match(hc,/Decline/);
assert.match(tradeHTML({...m,answer:{kind:'decline',price:0,line:'No way.'}}),/is-no/);
assert.match(tradeHTML({...m,answer:{kind:'accept',price:30,line:'Deal.'}}),/trade is-done/);
assert.match(tradeHTML({...m,products:[]}),/No packs/);
assert.match(tradeHTML({...m,locked:{product:true,qty:true}}),/data-trade-pick="1" disabled/);
const ho=handoffHTML(120);assert.match(ho,/cash-handoff/);assert.match(ho,/\+\$120/);assert.ok((ho.match(/<i /g)||[]).length>=3);
assert.ok(HANDOFF_TONES.length>=3);assert.ok(TRADE_MOODS.keen>TRADE_MOODS.grumpy);
const mt=meetHTML({name:'Pine Pop',qty:2,price:31});assert.match(mt,/MEETUP/);assert.match(mt,/Hand over · \$62/);assert.match(meetHTML({name:'x',qty:1,price:5,ready:false,reason:'Too far'}),/disabled title="Too far"/);
// Wiring.
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/trade-screen\.mjs\?v=176/);
for(const re of [/const tradeSale=talkStreetSale;/,/talkStreetSale=function\(p\)\{\s*if\(bypass/,/function tradePhone\(i\)/,/const tradeMenu=menu;menu=function/,/const tradeAct=doAction;doAction=function/,/window\.__tradeQa=/,/action\('text',i\)/,/action\('offer',i,/])assert.match(game,re);
const css=fs.readFileSync(new URL('../dist/people-talk.css',import.meta.url),'utf8');for(const re of [/\.trade-card\.is-picked/,/@keyframes cashFly/,/#modal\.trading \.talk-options/,/body #overlay\.phone #tradeBox/])assert.match(css,re);
const idx=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');assert.match(idx,/game\.js\?v=1\d\d/);assert.match(idx,/people-talk\.css\?v=17\d/);
console.log('v176 trade screen ok');
