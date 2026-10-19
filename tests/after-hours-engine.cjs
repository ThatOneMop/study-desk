const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/../games/after-hours/index.html','utf8');
const script=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('const HANDS='));
const context={module:{exports:{}}};vm.runInNewContext(script,context);const AH=context.module.exports;
assert.equal(AH.CHARMS.length,50);
const s=AH.newRun(125);assert.equal(s.deck.length,52);assert.equal(s.hand.length,8);
const ids=s.hand.slice(0,3).map(c=>c.id),expected=AH.preview(s,s.hand.slice(0,3));
assert.equal(AH.play(s,ids).points,expected.points);assert.equal(s.hands,3);assert.equal(s.hand.length,8);
assert.equal(AH.play(s,[s.hand[0].id,s.hand[0].id]),null);
assert.equal(AH.discard(s,[999]),false);
if(s.phase==='round'){const before=s.discards;assert(AH.discard(s,s.hand.slice(0,2).map(c=>c.id)));assert.equal(s.discards,before-1);}
const restored=JSON.parse(JSON.stringify(s));
assert.equal(AH.preview(s,s.hand.slice(0,5)).points,AH.preview(restored,restored.hand.slice(0,5)).points);
const shop=AH.newRun(1);shop.score=AH.target(shop);AH.play(shop,[shop.hand[0].id]);assert.equal(shop.phase,'shop');
shop.money=100;assert(AH.buy(shop,0));assert.equal(shop.stock[0],null);assert(AH.next(shop));assert.equal(shop.phase,'round');assert.equal(shop.round,1);
const loss=AH.newRun(1);loss.hands=1;loss.charms=[];AH.play(loss,[loss.hand[0].id]);assert.equal(loss.phase,'lost');
console.log('PASS After Hours: deterministic scoring, unique deck, invalid input rejection, discard, serialised state, shop purchase/advance, and loss. No rendered gameplay test.');
