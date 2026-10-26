import assert from 'node:assert/strict';
import {TOKEN_PRICE,TOKEN_PACKS,MAX_TOKENS,ARCADE_GAMES,PRIZES,normalizeArcade,buyTokens,startPlay,finishPlay,ticketsForScore,redeemPrize,equipGrip,toggleHat,gripColor,ownedPosters} from '../dist/arcade-core.mjs';
import {createGame,stepGame,EMPTY_INPUT,skeeLanding,launchHoop,stepHoop,createHoop} from '../dist/arcade-games.mjs';
import {ARCADE_CUES,playArcadeCue} from '../dist/arcade-audio.mjs';
import fs from 'node:fs';

// ---- Economy: fixed token rate, tickets only, no loop back to cash ----
const wallet=start=>{const w={cash:start,spent:0};w.spend=n=>{if(w.cash<n)return false;w.cash-=n;w.spent+=n;return true;};return w;};
let s=normalizeArcade({});
assert.deepEqual(s.arcade.owned,[]);assert.equal(s.arcade.tokens,0);assert.equal(s.arcade.tickets,0);
const w=wallet(100);
for(const n of TOKEN_PACKS){const before=w.cash;const r=buyTokens(s,n,w.spend);assert.ok(r.ok);assert.equal(before-w.cash,n*TOKEN_PRICE,'every pack is the same fixed rate');}
assert.equal(TOKEN_PRICE,5);
assert.equal(buyTokens(s,7,w.spend).ok,false,'only listed packs');
assert.equal(buyTokens(s,-5,w.spend).ok,false,'no negative packs');
const poor=wallet(4);assert.equal(buyTokens(s,1,poor.spend).ok,false);assert.equal(poor.cash,4);
s.arcade.tokens=MAX_TOKENS;const capW=wallet(1000);assert.equal(buyTokens(s,1,capW.spend).ok,false,'token cup caps');assert.equal(capW.cash,1000,'no charge when the cup is full');
s.arcade.tokens=16;
// one session pays once; replaying the result does nothing
const r1=startPlay(s,'skee');assert.ok(r1.ok);assert.equal(s.arcade.tokens,15);
assert.equal(finishPlay(s,r1.session,999).tickets,30,'per-play cap');
assert.equal(finishPlay(s,r1.session,999).tickets,0,'a finished session never pays twice');
assert.equal(s.arcade.tickets,30);
assert.equal(finishPlay(s,{game:'skee',open:true},5).ok,true);// a forged session is still capped
for(const v of [NaN,-50,'x',Infinity,-Infinity])assert.ok(ticketsForScore('hoop',v)>=0&&ticketsForScore('hoop',v)<=30);
for(const g of ARCADE_GAMES){assert.ok(g.cost>=1);assert.ok(g.cap<=g.cost*40,'payout per token stays bounded');assert.ok(g.secs>=20&&g.secs<=60,g.id+' lasts 20-60 s');}
s.arcade.tokens=0;assert.equal(startPlay(s,'claw').ok,false,'no token, no play');
// Prizes: no refunds or resale, snack once per day, nothing returns cash
s=normalizeArcade({arcade:{tickets:1000}});
const snack=PRIZES.find(p=>p.kind==='snack');
assert.ok(redeemPrize(s,snack.id,3).ok);assert.equal(redeemPrize(s,snack.id,3).ok,false,'one snack per day');assert.ok(redeemPrize(s,snack.id,4).ok);
assert.ok(redeemPrize(s,'grip-pink',4).ok);const t=s.arcade.tickets;assert.equal(redeemPrize(s,'grip-pink',4).ok,false);assert.equal(s.arcade.tickets,t,'no double charge');
assert.equal(gripColor(s),0xff8fc8);assert.ok(equipGrip(s,null));assert.equal(gripColor(s),null);assert.equal(equipGrip(s,'grip-gold'),false,'cannot equip unowned');
assert.equal(toggleHat(s),false);s.arcade.tickets=500;assert.ok(redeemPrize(s,'hat-pier').ok);assert.equal(s.arcade.hat,true);assert.ok(toggleHat(s));assert.equal(s.arcade.hat,false);
assert.ok(redeemPrize(s,'poster-bear').ok);assert.deepEqual(ownedPosters(s),['poster-bear']);
const src=fs.readFileSync(new URL('../dist/arcade-core.mjs',import.meta.url),'utf8');
assert.doesNotMatch(src,/\.cash\s*[+]=|bank\s*[+]=/,'arcade never pays cash');
assert.doesNotMatch(src,/Math\.random/,'no chance in the economy');
for(const p of PRIZES)assert.ok(!('cash' in p)&&!('refund' in p));
// Exploit loop: perfect play forever only ever drains cash; tickets never become money.
{const st=normalizeArcade({});const wl=wallet(500);let rounds=0;while(buyTokens(st,1,wl.spend).ok){const r=startPlay(st,'whack');finishPlay(st,r.session,1e6);rounds++;}
 assert.equal(wl.cash,0);assert.equal(rounds,100);assert.equal(st.arcade.tickets,3000);}

// ---- Saves: round trip, junk rejected ----
{const st=normalizeArcade({arcade:{tokens:5,tickets:120,owned:['grip-mint','poster-pier','snack-fizz','bogus'],grip:'grip-mint',hat:true,snackDay:2,best:{claw:12,nope:3}}});
 const back=normalizeArcade(JSON.parse(JSON.stringify(st)));
 assert.deepEqual(back.arcade.owned,['grip-mint','poster-pier'],'snack and junk never persist as owned');
 assert.equal(back.arcade.grip,'grip-mint');assert.equal(back.arcade.hat,false,'hat only if owned');assert.equal(back.arcade.best.claw,12);assert.equal(back.arcade.best.nope,undefined);
 const bad=normalizeArcade({arcade:{tokens:1e9,tickets:-4,grip:'grip-gold',owned:'x'}});assert.equal(bad.arcade.tokens,MAX_TOKENS);assert.equal(bad.arcade.tickets,0);assert.equal(bad.arcade.grip,null);}

// ---- Every game boots, finishes in 20-60 s, and pays by skill ----
const dt=1/60;
function run(id,policy,seed){const st=createGame(id,seed);assert.ok(st&&st.id===id,id+' boots');let prev=false,i=0;
 while(!st.done&&i<70*60){const inp=policy(st)||{};const down=!!inp.down;stepGame(st,dt,{...inp,pressed:inp.pressed??(down&&!prev),released:inp.released??(!down&&prev),down});prev=down;i++;}
 assert.ok(st.done,id+' ends');assert.ok(st.t<=60.01,id+' ends within 60 s');return st;}
const idle=()=>({});
const skilled={
 claw:st=>{if(st.phase!=='aim')return{};const p=st.plush.filter(p=>p.state==='pile').sort((a,b)=>b.value-a.value)[0];if(!p)return{};return{px:p.x,released:Math.abs(st.clawX-p.x)<.004&&Math.abs(st.sway)<.004&&Math.abs(st.swayV)<.02};},
 skee:st=>{const want=(1-.12-.3)/.78;if(st.phase!=='aim')return{};if(!st.charging)return{px:.3,down:true};return{down:Math.abs(st.power-want)>.03};},
 drop:st=>{const full=st.lanes.map((l,i)=>[l.length?l[l.length-1].y:2,i]).sort((a,b)=>a[0]-b[0])[0][1];return{pressed:st.lane===full&&Math.abs(st.dropX-(.2+full*.1))<.02};},
 whack:st=>{const u=st.up.find(u=>!u.hit&&u.kind!=='cat'&&u.age>.15);return{hole:u?u.hole:-1};},
 hoop:st=>{if(st.phase!=='aim')return{};if(!st.charging){if(Math.abs(st.angle-1)>.02)return{left:st.angle<1,right:st.angle>1};return{down:true};}return{down:Math.abs(st.power-.62)>.03};},
};
for(const g of ARCADE_GAMES){
 const lazy=run(g.id,idle);assert.ok(lazy.t>=19.9,g.id+' idle run lasts at least 20 s');assert.equal(ticketsForScore(g.id,lazy.score),0,g.id+' pays nothing for no skill');
 const good=run(g.id,skilled[g.id]);const tix=ticketsForScore(g.id,good.score);assert.ok(tix>=15,g.id+' rewards skill ('+tix+')');assert.ok(good.t>=20,g.id+' skilled run still lasts 20 s+ ('+good.t.toFixed(1)+')');
 // deterministic: same inputs, same score (no hidden odds)
 assert.equal(run(g.id,skilled[g.id]).score,good.score,g.id+' is deterministic');
}
// skee and hoop physics sanity
assert.ok(skeeLanding(.5,1).y<skeeLanding(.5,0).y);
{let makes=0;for(let a=.9;a<=1.1;a+=.05)for(let p=.5;p<=.75;p+=.05){const st=createHoop();st.ball=launchHoop(a,p);st.phase='fly';for(let i=0;i<200&&st.ball;i++)stepHoop(st,dt,EMPTY_INPUT);if(st.makes)makes++;}assert.ok(makes>=8,'a learnable sweet spot exists');}
// family-friendly copy: tickets, not betting
const ui=fs.readFileSync(new URL('../dist/arcade-ui.mjs',import.meta.url),'utf8')+fs.readFileSync(new URL('../dist/arcade-core.mjs',import.meta.url),'utf8');
assert.doesNotMatch(ui,/\b(bet|wager|odds|casino|jackpot odds|gambl)/i);
// audio cues exist and fail quietly without a context
for(const k of ['coin','start','prize','ticket','whack','swish','jackpot'])assert.ok(ARCADE_CUES.includes(k));
assert.equal(playArcadeCue(null,'coin'),false);
console.log('PASS: arcade economy (fixed $'+TOKEN_PRICE+' tokens, capped one-shot payouts, no cash loop, daily snack), saves, and all five cabinets boot, run 20-60 s and pay by skill.');
