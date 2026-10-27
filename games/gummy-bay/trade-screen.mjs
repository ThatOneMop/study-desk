// v176: trading screen. One deal/offer card for street sales, phone deals and meetups: pick a product card,
// set the quantity, slide the price against the customer's fair price, see the live accept chance, then
// handle their counteroffer (accept, counter or decline). Pure helpers plus markup; game.js wires it up.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const TRADE_MOODS={keen:1.1,chatty:1,wary:.92,grumpy:.85};
// Price range for the slider: half the fair price up to double, at least $1.
export function tradeRange(fair){const f=Math.max(1,Math.round(fair||1));return {min:Math.max(1,Math.round(f*.5)),max:Math.max(2,Math.round(f*2)),step:1,fair:f};}
export function tradeStart(fair){return Math.max(1,Math.round(fair||1));}
export function tradeTotal(price,qty){return Math.max(0,Math.round(price||0))*Math.max(0,qty|0);}
// Chance shown on the meter. chanceFn handles prices above fair (haggleChance in game.js).
export function tradeChance({price,fair,qty=1,penalty=0},chanceFn){
 if(!(price>0)||!(fair>0))return 0;if(price<=fair)return 100;
 const c=typeof chanceFn==='function'?chanceFn(price,fair,qty):Math.round(100*clamp(1-(price/fair-1)*2,0,1));
 return clamp(Math.round(c-penalty),0,100);
}
export function chanceWord(c){return c>=100?'Sure thing':c>=70?'Likely':c>=40?'Maybe':c>=15?'Unlikely':'No chance';}
// Customer answer to an offer. roll is 0..1. Returns {kind:'accept'|'counter'|'decline', price}.
export function customerAnswer({price,fair,chance,round=0,roll=.5}){
 if(price<=fair||roll*100<chance)return {kind:'accept',price:Math.round(price)};
 if(round>=2||price>fair*1.9)return {kind:'decline',price:0};
 const meet=Math.round(fair+(price-fair)*(round?0.15:0.35));
 return {kind:'counter',price:Math.max(Math.round(fair),Math.min(Math.round(price)-1,meet))};
}
export const ANSWER_LINES={
 accept:['Deal.','Yeah, alright. Deal.','Done. Hand it over.'],
 counter:['Bit steep. I’ll do $P each.','Nah. $P each, take it or leave it.','How about $P each?'],
 decline:['Forget it. Too rich for me.','No way. I’m out.','Not at that price, mate.']
};
export function answerLine(ans,seed=0){const set=ANSWER_LINES[ans.kind]||ANSWER_LINES.accept;return set[Math.abs(seed|0)%set.length].replace('$P','$'+ans.price);}
const money=v=>'$'+Math.round(v).toLocaleString('en-AU');
const escD=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// model: {who, kind:'street'|'phone'|'meet', products:[{t,name,have,fair,quality,color}], pick, qty, maxQty, price,
//         chance, answer:{kind,price,line}|null, locked:{product,qty}, note}
export function tradeHTML(m,esc=escD){
 const p=m.products.find(x=>x.t===m.pick)||m.products[0];if(!p)return '<div class="trade"><p class="note">No packs on you to sell.</p></div>';
 const r=tradeRange(p.fair),pos=v=>clamp((v-r.min)/(r.max-r.min),0,1)*100,ch=m.chance??100,lock=m.locked||{};
 const cards=m.products.map(x=>'<button class="trade-card'+(x.t===p.t?' is-picked':'')+'" data-trade-pick="'+x.t+'"'+(lock.product&&x.t!==p.t?' disabled':'')+' style="--swatch:'+esc(x.color||'#f2b84b')+'"><i class="trade-jar"></i><b>'+esc(x.name)+'</b><small>'+x.have+' on you</small><em>Fair '+money(x.fair)+'</em></button>').join('');
 const head='<div class="trade-head"><span>'+esc(m.kind==='phone'?'PHONE DEAL':m.kind==='meet'?'MEETUP':'STREET DEAL')+'</span><small>Green line = their fair price</small></div>';
 if(m.answer?.kind==='accept')return '<div class="trade is-done" data-kind="'+esc(m.kind)+'">'+head+'<p class="trade-say is-yes"><b>'+esc(m.who)+':</b> '+esc(m.answer.line)+'</p><div class="trade-total">'+m.qty+' × '+esc(p.name)+' · <b>'+money(tradeTotal(m.answer.price,m.qty))+'</b></div></div>';
 const qty='<div class="trade-row"><label>Quantity</label><div class="trade-step"><button data-trade="qty-"'+(lock.qty||m.qty<=1?' disabled':'')+'>−</button><output>'+m.qty+'</output><button data-trade="qty+"'+(lock.qty||m.qty>=m.maxQty?' disabled':'')+'>+</button></div></div>';
 const price='<div class="trade-row trade-price"><label>Price each</label><div class="trade-step"><button data-trade="price-">−</button><output>'+money(m.price)+'</output><button data-trade="price+">+</button></div>'
  +'<div class="trade-slide"><input type="range" id="tradePrice" min="'+r.min+'" max="'+r.max+'" step="1" value="'+m.price+'" aria-label="Price each"><span class="trade-fair" style="left:'+pos(p.fair)+'%" title="Their fair price"><b>Fair '+money(p.fair)+'</b></span></div></div>';
 const meter='<div class="trade-chance c'+(ch>=70?'hi':ch>=40?'mid':'lo')+'"><span>Accept chance</span><span class="trade-meter"><b style="width:'+ch+'%"></b></span><strong>'+ch+'%</strong><small>'+chanceWord(ch)+'</small></div>';
 const total='<div class="trade-total">Total <b>'+money(tradeTotal(m.price,m.qty))+'</b></div>';
 let actions='<div class="trade-actions"><button class="trade-go" data-trade="offer">Offer '+money(tradeTotal(m.price,m.qty))+'</button><button data-trade="walk">Walk away</button></div>';
 if(m.answer?.kind==='counter')actions='<p class="trade-say"><b>'+esc(m.who)+':</b> '+esc(m.answer.line)+'</p><div class="trade-actions"><button class="trade-go" data-trade="take">Accept '+money(m.answer.price)+'</button><button data-trade="offer">Counter '+money(m.price)+'</button><button data-trade="walk">Decline</button></div>';
 if(m.answer?.kind==='decline')actions='<p class="trade-say is-no"><b>'+esc(m.who)+':</b> '+esc(m.answer.line)+'</p><div class="trade-actions"><button data-trade="walk">Close</button></div>';
 if(m.answer?.kind==='accept')actions='<p class="trade-say is-yes"><b>'+esc(m.who)+':</b> '+esc(m.answer.line)+'</p>';
 return '<div class="trade" data-kind="'+esc(m.kind)+'">'+head+'<div class="trade-cards">'+cards+'</div>'+qty+price+meter+total+(m.note?'<p class="note">'+esc(m.note)+'</p>':'')+actions+'</div>';
}
// Cash handoff: notes fly out, a "+$X" pops. Returns markup for an overlay that removes itself (CSS animation).
export function handoffHTML(amount,{notes=0}={}){
 const n=clamp(notes||Math.ceil(Math.log2(Math.max(2,amount))),3,9);let h='';
 for(let i=0;i<n;i++)h+='<i style="--d:'+(i*60)+'ms;--x:'+((i%3)-1)*18+'px;--r:'+(((i*37)%30)-15)+'deg"></i>';
 return '<div class="cash-handoff" aria-live="polite"><div class="cash-notes">'+h+'</div><b>+'+money(amount)+'</b></div>';
}
// Tones for the cash cue: a rustle, then a two-note "ka-ching".
export const HANDOFF_TONES=[[220,.05,.025,0],[260,.05,.025,70],[1320,.08,.04,180],[1760,.14,.04,260]];
// Meetup card: the agreed deal as a locked product card with a hand-over button (it presses the existing
// deliver button, so every check on the handoff still applies).
export function meetHTML({name,qty,price,color='',ready=true,reason=''},esc=escD){
 return '<div class="trade trade-meet is-done" data-kind="meet"><div class="trade-head"><span>MEETUP</span><small>Agreed by text</small></div><div class="trade-cards"><div class="trade-card is-picked" style="--swatch:'+esc(color||'#f2b84b')+'"><i class="trade-jar"></i><b>'+esc(name)+'</b><small>'+qty+' × '+money(price)+'</small></div><div class="trade-total">Cash on handoff <b>'+money(tradeTotal(price,qty))+'</b></div></div>'
  +'<div class="trade-actions"><button class="trade-go" data-trade-meet'+(ready?'':' disabled title="'+esc(reason)+'"')+'>Hand over · '+money(tradeTotal(price,qty))+'</button></div></div>';
}
