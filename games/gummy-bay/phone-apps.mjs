// Phone messages, contact graph and marketplace rows. Presentation only.
// Accept and Counter call the existing offer() action. Listing calls list().
// Nothing here writes a save, a deal window, a locked contact or a craving.

const fallbackEsc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const swatchOf=value=>/^#[0-9a-fA-F]{6}$/.test(value)?value:'#6d8f78';
const clean=(value,max)=>{
 const text=typeof value==='string'?value.trim():'';
 if(!text)return '';
 return text.length>max?text.slice(0,max-1)+'…':text;
};
const money=value=>Number.isFinite(value)?'$'+Math.round(value):'';

export const DEAL_WINDOWS=Object.freeze([
 Object.freeze({id:'morning',label:'Morning'}),
 Object.freeze({id:'afternoon',label:'Afternoon'}),
 Object.freeze({id:'night',label:'Night'}),
 Object.freeze({id:'late',label:'Late night'})
]);

export function dealWindow(minute){
 const clock=Number.isFinite(minute)?Math.floor(minute):0;
 const m=((clock%1440)+1440)%1440;
 if(m>=360&&m<720)return 'morning';
 if(m>=720&&m<1080)return 'afternoon';
 if(m>=1080&&m<1320)return 'night';
 return 'late';
}

// The handshake accepts any whole-dollar price at or under their max. Above it, they counter.
export function acceptChance(price,fair){
 const ask=Number(price),limit=Number(fair);
 if(!Number.isFinite(ask)||!Number.isFinite(limit))return 0;
 return ask<=limit?100:0;
}

function lastMessage(thread){
 const messages=thread&&Array.isArray(thread.messages)?thread.messages:[];
 return messages.length?messages[messages.length-1]:null;
}

export function buildInbox({contacts=[],threads={},deals=[],strainNames=[]}={}){
 const list=Array.isArray(contacts)?contacts.slice(0,64):[];
 const agreed=Array.isArray(deals)?deals:[];
 return Object.freeze(list.map((contact,index)=>{
  const thread=threads&&typeof threads==='object'?threads[index]:null;
  const last=lastMessage(thread);
  const deal=agreed.find(item=>item&&item.npc===index&&Number.isInteger(item.qty)&&Number.isFinite(item.price));
  const product=typeof strainNames?.[deal?.t]==='string'?strainNames[deal.t]:'';
  const name=clean(contact?.name,40)||'Customer';
  return Object.freeze({
   index,name,initial:name[0]||'?',
   swatch:swatchOf(contact?.swatch),
   preview:clean(last?.text,90)||clean(contact?.line,90)||'No messages yet.',
   unread:!!last&&last.mine===false,
   negotiating:thread?.status==='negotiating'&&Number.isFinite(thread.counter),
   counter:thread?.status==='negotiating'&&Number.isFinite(thread.counter)?Math.round(thread.counter):null,
   deal:deal?deal.qty+' × '+(product||'gummies')+' · '+money(deal.price)+' each':'',
   locked:contact?.locked===true
  });
 }));
}

export function inboxHTML(rows,esc=fallbackEsc){
 const people=Array.isArray(rows)?rows:[];
 const cards=people.map(row=>{
  const dot=row.unread?'<i class="unread-dot" aria-label="Unread"></i>':'';
  const offer=row.negotiating?'<em class="thread-chip">Offer '+esc(money(row.counter))+'</em>':'';
  const deal=row.deal?'<em class="thread-chip">Agreed · '+esc(row.deal)+'</em>':'';
  const lock=row.locked?'<em class="thread-chip">Locked</em>':'';
  const open=row.locked?'':' onclick="menu(\'thread\','+row.index+')"';
  return '<button class="thread-row'+(row.unread?' is-unread':'')+(row.locked?' is-locked':'')+'" type="button"'+open+'><span class="mug" style="background:'+row.swatch+'" aria-hidden="true">'+esc(row.initial)+'</span><span class="thread-copy"><strong>'+esc(row.name)+'</strong><small>'+esc(row.preview)+'</small>'+offer+deal+lock+'</span>'+dot+'</button>';
 }).join('');
 return '<section class="message-inbox" aria-label="Messages"><div class="overline">TEXTS</div><h2>Messages</h2>'+cards+'</section>';
}

export function negotiationView(thread,strainName,minute){
 if(!thread||thread.status!=='negotiating'||!Number.isFinite(thread.counter)||!Number.isFinite(thread.max))return null;
 const theirPrice=Math.round(thread.counter),fair=Math.round(thread.max);
 return Object.freeze({
  product:clean(strainName,48)||'gummies',
  qty:Number.isInteger(thread.qty)&&thread.qty>0?thread.qty:1,
  theirPrice,fair,
  chance:acceptChance(theirPrice,fair),
  windowId:dealWindow(minute)
 });
}

export function dealBubbleHTML(index,view,esc=fallbackEsc){
 if(!view||!Number.isInteger(index)||index<0)return '';
 const windows=DEAL_WINDOWS.map(item=>'<button type="button" class="window-pick'+(item.id===view.windowId?' on':'')+'" disabled aria-current="'+(item.id===view.windowId?'true':'false')+'">'+esc(item.label)+'</button>').join('');
 return '<section class="deal-bubble" aria-label="Their offer"><p><strong>'+esc(view.product)+'</strong> · '+view.qty+' · they can do <b>'+esc(money(view.theirPrice))+'</b> each.</p><p>Fair price '+esc(money(view.fair))+'. Chance they accept '+esc(money(view.theirPrice))+': <b>'+view.chance+'%</b>.</p><div class="deal-windows" aria-label="Meetup window">'+windows+'</div><p class="note">The window follows the clock. Choosing one does not reschedule the meetup.</p><div class="order-actions"><button class="primary" type="button" onclick="action(\'offer\','+index+','+view.theirPrice+')">Accept</button><button class="ghost" type="button" onclick="openCounterSheet('+index+')">Counter</button><button class="ghost" type="button" disabled title="A live offer cannot be declined yet. Cancel is available after you agree.">Reject</button></div></section>';
}

export function counterSheetHTML(index,view,esc=fallbackEsc){
 if(!view||!Number.isInteger(index)||index<0)return '';
 const windows=DEAL_WINDOWS.map(item=>'<button type="button" class="window-pick'+(item.id===view.windowId?' on':'')+'" disabled>'+esc(item.label)+'</button>').join('');
 return '<form class="counter-sheet" onsubmit="return false"><div class="overline">COUNTER</div><h3>Your price</h3><label>Product <select disabled><option>'+esc(view.product)+'</option></select></label><label>Quantity <input type="number" min="1" max="40" value="'+view.qty+'" disabled></label><p class="note">Product and quantity stay on the text you already sent.</p><label>Price $ / gummy <input id="counterPrice" type="number" min="1" max="9999" value="'+view.theirPrice+'" data-fair="'+view.fair+'" oninput="previewCounterChance()"></label><p>Fair price <b>'+esc(money(view.fair))+'</b>. Chance they accept this price: <b id="counterChance">'+view.chance+'%</b>.</p><div class="deal-windows">'+windows+'</div><div class="order-actions"><button class="primary" type="button" onclick="action(\'offer\','+index+',Number(document.getElementById(\'counterPrice\').value))">Send counter</button><button class="ghost" type="button" onclick="closeCounterSheet()">Back</button></div></form>';
}

function hearts(score){
 const safe=Number.isFinite(score)?Math.max(0,Math.min(100,Math.round(score))):0;
 const filled=Math.max(0,Math.min(5,Math.round(safe/20)));
 return Object.freeze({filled,glyph:'♥'.repeat(filled)+'♡'.repeat(5-filled),score:safe});
}

export function contactGraphModel({people=[],selected=0}={}){
 const list=Array.isArray(people)?people.slice(0,64):[];
 const focus=list.some(person=>person.index===selected)?selected:(list[0]?.index??0);
 const nodes=list.map((person,slot)=>{
  const turn=list.length?(-Math.PI/2)+(slot/list.length)*Math.PI*2:0;
  const loyalty=hearts(person.score);
  return Object.freeze({
   index:person.index,name:clean(person.name,40)||'Customer',initial:(clean(person.name,40)||'?')[0],
   swatch:swatchOf(person.swatch),locked:person.locked===true,
   x:50+Math.cos(turn)*36,y:50+Math.sin(turn)*(list.length>10?41:36),
   loyalty,selected:person.index===focus,
   craving:person.craving&&Number.isFinite(person.craving.level)?Object.freeze({name:clean(person.craving.name,48)||'a gummy',level:Math.max(0,Math.min(100,Math.round(person.craving.level)))}):null,
   effects:Array.isArray(person.effects)?Object.freeze(person.effects.slice(0,3).map(item=>clean(item,24)).filter(Boolean)):null,
   standards:clean(person.standards,120)||'Standards are not recorded for this customer.',
   district:clean(person.district,80)||'District unknown'
  });
 });
 return Object.freeze({nodes:Object.freeze(nodes),focus});
}

export function contactGraphHTML(model,esc=fallbackEsc){
 const nodes=Array.isArray(model?.nodes)?model.nodes:[];
 const lines=nodes.map(node=>'<line x1="50" y1="50" x2="'+node.x.toFixed(1)+'" y2="'+node.y.toFixed(1)+'"></line>').join('');
 const marks=nodes.map(node=>{
  const style='left:'+node.x.toFixed(1)+'%;top:'+node.y.toFixed(1)+'%';
  if(node.locked)return '<button type="button" class="graph-node is-locked'+(node.selected?' on':'')+'" style="'+style+'" title="Locked" onclick="showContactCard('+node.index+')"><b aria-hidden="true">'+esc(node.initial)+'</b><i aria-label="Locked">🔒</i></button>';
  return '<button type="button" class="graph-node'+(node.selected?' on':'')+'" style="'+style+';background:'+node.swatch+'" onclick="showContactCard('+node.index+')" aria-pressed="'+(node.selected?'true':'false')+'"><b aria-hidden="true">'+esc(node.initial)+'</b><small>'+esc(node.name)+'</small></button>';
 }).join('');
 const detail=nodes.find(node=>node.index===model.focus)||nodes[0];
 const card=detail?(()=>{
  const craving=detail.craving?'<div class="craving-bar" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+detail.craving.level+'" aria-label="Craving for '+esc(detail.craving.name)+' '+detail.craving.level+' of 100"><i style="width:'+detail.craving.level+'%"></i><span>'+esc(detail.craving.name)+' · '+detail.craving.level+'</span></div>':'<p>No craving recorded.</p>';
  const effects=detail.effects&&detail.effects.length?'<p class="effect-chips">'+detail.effects.map(effect=>'<em>'+esc(effect)+'</em>').join('')+'</p><p class="note">Preferred effects. Matching them raises what they pay.</p>':'<p>Preferred effects show after the first deal.</p>';
  return '<article class="contact-detail"><header><span class="mug" style="background:'+detail.swatch+'" aria-hidden="true">'+esc(detail.initial)+'</span><div><h3>'+esc(detail.name)+(detail.locked?' 🔒':'')+'</h3><p>'+esc(detail.district)+'</p></div></header><p class="loyalty" aria-label="Loyalty '+detail.loyalty.filled+' of 5 hearts">'+detail.loyalty.glyph+'</p>'+craving+effects+'<p>'+esc(detail.standards)+'</p></article>';
 })():'';
 const lockedNote=nodes.some(node=>node.locked)?'':'<p class="note">Nobody in the book is locked.</p>';
 return '<section class="contact-graph" aria-label="Contact graph"><div class="overline">WHO KNOWS WHOM</div><div class="graph-board"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><circle cx="50" cy="50" r="4"></circle>'+lines+'</svg><span class="graph-you">You</span>'+marks+'</div>'+lockedNote+card+'</section>';
}

export function productRowsHTML(rows,esc=fallbackEsc){
 const items=Array.isArray(rows)?rows:[];
 const cards=items.map(row=>{
  const effects=(Array.isArray(row.effects)?row.effects:[]).slice(0,4).map(effect=>'<em>'+esc(clean(effect,24)||'Plain')+'</em>').join('');
  const listed=row.listed===true;
  const packed=Number.isFinite(row.packed)?Math.max(0,Math.round(row.packed)):0;
  const price=Number.isFinite(row.price)?Math.round(row.price):1;
  const qty=Number.isInteger(row.qty)&&row.qty>0?row.qty:1;
  const index=Number.isInteger(row.index)&&row.index>=0?row.index:0;
  return '<article class="product-row'+(listed?' is-listed':'')+'"><span class="product-ico" style="background:'+swatchOf(row.swatch)+'" aria-hidden="true">'+esc((row.name||'?')[0])+'</span><div class="product-copy"><strong>'+esc(clean(row.name,48)||'Product')+'</strong><span class="effect-chips">'+effects+'</span><small>Market '+esc(money(row.market))+' · '+packed+' packed</small><details><summary>Recipe</summary><p>'+esc(clean(row.recipe,180)||'No recipe recorded.')+'</p></details></div><label>$ <input id="prodPrice'+index+'" type="number" min="1" max="9999" value="'+price+'"></label><label>Qty <input id="prodQty'+index+'" type="number" min="1" max="40" value="'+qty+'"></label><button class="primary list-toggle" type="button" aria-pressed="'+(listed?'true':'false')+'" onclick="action(\'list\','+index+',Number(document.getElementById(\'prodQty'+index+'\').value),Number(document.getElementById(\'prodPrice'+index+'\').value))">'+(listed?'Listed':'List')+'</button></article>';
 }).join('');
 return '<section class="product-catalog" aria-label="Products"><div class="overline">YOUR STOCK</div><h3>Products</h3><p class="note">List saves this price with the existing marketplace action. Listing another product replaces it. There is no separate unlist.</p>'+cards+'</section>';
}
