// Read-only phone contacts. Relationship scores, threads and deals already live
// on the save. This module only describes them.
//
// Systems hook: if state.dealers is an array of {name, area, cut, relationship},
// the contacts app lists the valid entries. It never creates or writes that
// field, so existing v3 saves stay unchanged. Hiring, stock, cuts and payouts
// belong to the simulation. Until then the only person who sells for the player
// is the sales assistant already stored on state.helpers.seller.

export const PHONE_APP_KEYS=Object.freeze({'1':'phone','2':'contacts','3':'listing','4':'deals','5':'wallet','6':'map'});
export const PHONE_HOME_APPS=Object.freeze([
 Object.freeze({key:'1',screen:'phone',name:'Messages',icon:'✉',idle:'Texts and offers'}),
 Object.freeze({key:'2',screen:'contacts',name:'Contacts',icon:'☺',idle:'Relationships'}),
 Object.freeze({key:'3',screen:'listing',name:'Marketplace',icon:'▤',idle:'Set a price'}),
 Object.freeze({key:'4',screen:'deals',name:'Deliveries',icon:'↗',idle:'Agreed orders'}),
 Object.freeze({key:'5',screen:'wallet',name:'Banking',icon:'▣',idle:'Card balance'}),
 Object.freeze({key:'6',screen:'map',name:'Town map',icon:'⌖',idle:'Find your way'})
]);
export const RELATION_BANDS=Object.freeze([
 Object.freeze({min:0,id:'stranger',label:'Stranger'}),
 Object.freeze({min:15,id:'acquaintance',label:'Acquaintance'}),
 Object.freeze({min:40,id:'regular',label:'Regular'}),
 Object.freeze({min:70,id:'trusted',label:'Trusted'}),
 Object.freeze({min:90,id:'loyal',label:'Loyal'})
]);
const SATISFACTION=Object.freeze({
 stranger:Object.freeze({meet:'They do not know your work yet. A kept meetup is how this starts.',waiting:'They are waiting on a first delivery. Show up with the agreed packs.',haggle:'They are cautious. Stay near their counter if you want this to close.',delivered:'A first sale done properly. They will remember the price and the timing.'}),
 acquaintance:Object.freeze({meet:'They have seen you around. Fair dealing is what they are measuring.',waiting:'They set money aside. Arrive with the full order.',haggle:'They will counter once. Accepting their number keeps the conversation easy.',delivered:'That sale landed. They are more willing to hear the next text.'}),
 regular:Object.freeze({meet:'A regular face. They expect the flavour and the count you promised.',waiting:'They are ready for the handover. Do not short the order.',haggle:'They know your prices. A small step toward their number usually settles it.',delivered:'Another clean sale. This is becoming a habit for them.'}),
 trusted:Object.freeze({meet:'They trust the handshake. Bring exactly what you agreed.',waiting:'They walked out to meet you. The order should be in your bag.',haggle:'They will stretch a little, then stop. Their counter is as far as they mean to go.',delivered:'They are glad they dealt with you. The relationship holds.'}),
 loyal:Object.freeze({meet:'They talk you up. Missing this meetup would sting.',waiting:'A loyal customer is waiting. Deliver the agreed packs.',haggle:'They already like buying from you. Do not push past a fair counter.',delivered:'They will be back. Keep the quality where they expect it.'})
});

const clampScore=value=>{
 const n=Number.isFinite(value)?Math.floor(value):0;
 return Math.max(0,Math.min(100,n));
};
export function relationBand(value){
 const score=clampScore(value);
 let band=RELATION_BANDS[0];
 for(const next of RELATION_BANDS)if(score>=next.min)band=next;
 return Object.freeze({score,id:band.id,label:band.label});
}
function text(value,max){
 const clean=typeof value==='string'?value.trim():'';
 if(!clean)return '';
 return clean.length>max?clean.slice(0,max-1)+'…':clean;
}
function money(value){
 if(!Number.isFinite(value))return '';
 const rounded=Math.round(value*100)/100;
 return '$'+rounded.toLocaleString('en-US',{maximumFractionDigits:2});
}
function readDeal(deals,index,strainNames){
 if(!Array.isArray(deals))return null;
 const deal=deals.find(item=>item&&item.npc===index);
 if(!deal||!Number.isInteger(deal.qty)||deal.qty<1||!Number.isFinite(deal.price))return null;
 const name=typeof strainNames?.[deal.t]==='string'&&strainNames[deal.t]?strainNames[deal.t]:'gummies';
 return Object.freeze({qty:deal.qty,name,price:deal.price,label:deal.qty+' × '+name+' · '+money(deal.price)+' each'});
}
function readDealers(raw){
 if(!Array.isArray(raw))return Object.freeze([]);
 const dealers=[];
 for(const item of raw){
  if(!item||typeof item!=='object'||Array.isArray(item))continue;
  const name=text(item.name,40);
  if(!name)continue;
  const area=text(item.area,40);
  const cut=Number.isFinite(item.cut)?Math.max(0,Math.min(100,Math.round(item.cut))):null;
  const relationship=Number.isFinite(item.relationship)?relationBand(item.relationship):null;
  dealers.push(Object.freeze({name,area,cut,relationship}));
  if(dealers.length>=12)break;
 }
 return Object.freeze(dealers);
}
export function buildContactBook({state={},contacts=[],strainNames=[]}={}){
 const relations=state&&typeof state.relations==='object'&&state.relations?state.relations:{};
 const threads=state&&typeof state.threads==='object'&&state.threads?state.threads:{};
 const list=Array.isArray(contacts)?contacts.slice(0,64):[];
 const customers=list.map((contact,index)=>{
  const thread=threads[index];
  const messages=thread&&Array.isArray(thread.messages)?thread.messages:[];
  const last=messages.length?messages[messages.length-1]:null;
  const band=relationBand(relations[index]);
  const name=text(contact?.name,40)||'Customer';
  return Object.freeze({
   index,name,initial:name[0]||'?',
   role:text(contact?.role,48),
   favourite:text(contact?.favourite,40),
   line:text(last?.text,140)||text(contact?.line,140),
   band,deal:readDeal(state.deals,index,strainNames),
   negotiating:thread?.status==='negotiating',
   locked:contact?.locked===true
  });
 });
 const hired=!!state?.helpers?.seller;
 const route=state?.staffConfig?.seller?.route==='timer'?'timer':'walk';
 const assistant=Object.freeze({
  hired,route:hired?route:'unhired',
  summary:!hired?'Nobody sells for you yet. The Helping Hand can hire a sales assistant.':route==='timer'?'Your sales assistant is on the background timer, selling unreserved packs at 90% of market value.':'Your sales assistant walks agreed orders to the customer.'
 });
 return Object.freeze({customers:Object.freeze(customers),dealers:readDealers(state?.dealers),assistant});
}
export function satisfactionContext({surface='meet',negotiating=false,hasDeal=false,hasReceipt=false}={}){
 if(surface==='thread'&&negotiating)return 'haggle';
 if(hasDeal)return 'waiting';
 if(hasReceipt)return 'delivered';
 return 'meet';
}
export function satisfactionView(score,context='meet'){
 const band=relationBand(score);
 const copy=SATISFACTION[band.id]||SATISFACTION.stranger;
 return Object.freeze({...band,context:copy[context]?context:'meet',text:copy[context]||copy.meet});
}
const fallbackEsc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export function satisfactionHTML(view,esc=fallbackEsc){
 const safe=view&&view.label?view:satisfactionView(0,'meet');
 return '<section class="satisfaction-strip" data-band="'+esc(safe.id)+'"><strong>'+esc(safe.label)+' · '+safe.score+'/100</strong><div class="relation-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+safe.score+'" aria-label="Relationship '+safe.score+' of 100, '+esc(safe.label)+'"><i style="width:'+safe.score+'%"></i></div><p>'+esc(safe.text)+'</p></section>';
}
export function contactBookHTML(book,esc=fallbackEsc){
 const customers=Array.isArray(book?.customers)?book.customers:[];
 const dealers=Array.isArray(book?.dealers)?book.dealers:[];
 const assistant=book?.assistant||{summary:'Nobody sells for you yet. The Helping Hand can hire a sales assistant.'};
 const people=customers.map(person=>{
  const deal=person.deal?'<p class="phone-deal-chip">Agreed · '+esc(person.deal.label)+'</p>':'';
  const talking=person.negotiating?'<p class="phone-deal-chip">Negotiating a price</p>':'';
  const favourite=person.favourite?'<small>Likes '+esc(person.favourite)+'</small>':'';
  return '<article class="phone-contact" data-band="'+esc(person.band.id)+'"><header class="contact-heading"><span class="contact-initial" aria-hidden="true">'+esc(person.initial)+'</span><div><strong>'+esc(person.name)+'</strong><small>'+esc(person.role||'Customer')+'</small>'+favourite+'</div><b>'+person.band.score+'</b></header><div class="relation-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+person.band.score+'" aria-label="'+esc(person.name)+' relationship '+person.band.score+' of 100, '+esc(person.band.label)+'"><i style="width:'+person.band.score+'%"></i></div><p class="relation-band">'+esc(person.band.label)+'</p><p>'+esc(person.line||'No messages yet.')+'</p>'+deal+talking+'<div class="order-actions">'+(person.locked?'<button class="primary" disabled title="Hand them a sample in person to unlock">🔒 Locked</button>':'<button class="primary" onclick="menu(\'thread\','+person.index+')">Message</button>')+'<button class="ghost" onclick="trackCustomer('+person.index+')">Find</button></div></article>';
 }).join('');
 const dealerCards=dealers.map(dealer=>{
  const where=dealer.area?'<small>'+esc(dealer.area)+'</small>':'';
  const cut=dealer.cut===null?'':'<p>Keeps '+dealer.cut+'% of a sale.</p>';
  const bond=dealer.relationship?'<p class="relation-band">'+esc(dealer.relationship.label)+' · '+dealer.relationship.score+'/100</p>':'';
  return '<article class="phone-contact" data-band="'+(dealer.relationship?esc(dealer.relationship.id):'stranger')+'"><header class="contact-heading"><span class="contact-initial" aria-hidden="true">'+esc(dealer.name[0]||'?')+'</span><div><strong>'+esc(dealer.name)+'</strong>'+where+'</div></header>'+cut+bond+'</article>';
 }).join('');
 const dealerNote=dealers.length?'':'<p>Street dealers you supply for a cut are not part of the bay yet.</p>';
 return '<div class="overline">PEOPLE YOU KNOW</div><h2>Contacts</h2><p class="phone-contacts-lead">Relationships rise when you deliver on time or hand over a sample. They slip if you miss a meetup.</p><div class="phone-contact-list">'+people+'</div><section class="phone-dealers"><h3>Selling for you</h3><p>'+esc(assistant.summary)+'</p>'+dealerNote+dealerCards+'<p class="phone-keyhint">Keys 1–6 switch apps · Backspace home · Esc puts the phone away</p></section>';
}
