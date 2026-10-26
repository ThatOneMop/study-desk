// Shop counter. Purchase buttons already call action(). This module only
// rewrites the markup so a price is reviewed before that call, and describes
// the one-step refund bar. It does not spend money or change inventory.

export const SHOP_PANELS=Object.freeze(['hardware','dealer','store','servo']);
const ICONS=Object.freeze({
 buyTent:'⌂',buyCan:'◡',lights:'✶',irrigation:'≈',bench:'▣',buyMixer:'◎',
 buyTrimmers:'✂',buyPackStation:'▤',seed:'✧',soil:'▢',wrappers:'▥',lemonade:'○',ingredient:'✦'
});
const strip=html=>String(html??'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const esc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

export function shopIcon(action){return ICONS[action]||'▣';}
export function parseActionArgs(raw){
 if(typeof raw!=='string'||!raw.trim())return [];
 const parts=[];
 const re=/(-?\d+(?:\.\d+)?)|'([^']*)'/g;
 let match;while((match=re.exec(raw)))parts.push(match[2]!==undefined?match[2]:Number(match[1]));
 return parts;
}
export function moneyValue(label){
 const match=strip(label).match(/^\$([\d,]+(?:\.\d+)?)$/);
 if(!match)return null;
 const value=Number(match[1].replace(/,/g,''));
 return Number.isFinite(value)?value:null;
}
export function armShopMarkup(html){
 if(typeof html!=='string'||!html.includes('class="item"'))return {html:typeof html==='string'?html:'',offers:[]};
 const offers=[];
 const next=html.replace(/<div class="item"><div><strong>([\s\S]*?)<\/strong><p>([\s\S]*?)<\/p><\/div><button class="primary"([^>]*)>([\s\S]*?)<\/button><\/div>/g,(full,title,detail,attrs,label)=>{
  const amount=moneyValue(label);
  if(amount===null)return full;
  const call=/onclick="action\('([A-Za-z0-9_]+)'([^"]*)\)"/.exec(attrs);
  if(!call)return full;
  const name=strip(title),info=strip(detail),price=strip(label),icon=shopIcon(call[1]);
  const face=`<span class="shop-ico" aria-hidden="true">${icon}</span><span class="shop-name">${esc(name)}</span><span class="shop-price">${esc(price)}</span>`;
  const disabled=/(^|\s)disabled(\s|=|$)/.test(attrs);
  if(disabled)return `<div class="item"><div><strong>${title}</strong><p>${detail}</p></div><button class="primary shop-buy"${attrs}>${face}</button></div>`;
  const index=offers.length;
  offers.push(Object.freeze({action:call[1],args:parseActionArgs(call[2]||''),name,detail:info,price,amount,icon}));
  const armed=attrs.replace(/onclick="[^"]*"/,`onclick="openShopConfirm(${index})"`);
  return `<div class="item"><div><strong>${title}</strong><p>${detail}</p></div><button class="primary shop-buy" aria-label="Review ${esc(name)} for ${esc(price)}"${armed}>${face}</button></div>`;
 });
 return {html:next,offers};
}
export function shopConfirmHTML(offer={},purse={}){
 const cash=Number.isFinite(purse.cash)?purse.cash:0;
 const bank=Number.isFinite(purse.bank)?purse.bank:0;
 const payment=purse.payment==='card'?'card':'cash';
 const pile=payment==='card'?bank:cash;
 const amount=Number.isFinite(offer.amount)?offer.amount:0;
 const left=Math.round((pile-amount)*100)/100;
 const afford=left>=0;
 const money=value=>'$'+Number(value).toLocaleString('en-US',{maximumFractionDigits:2});
 const caution=offer.caution?`<p class="note">${esc(offer.caution)}</p>`:'';
 return `<section class="shop-cart" role="dialog" aria-label="Confirm purchase"><div class="overline">CART · ONE ITEM</div><h2><span class="shop-ico" aria-hidden="true">${esc(offer.icon||'▣')}</span> ${esc(offer.name||'Item')}</h2><p>${esc(offer.detail||'')}</p><p class="shop-cart-price"><strong>${esc(offer.price||'')}</strong></p><p>Wallet ${money(cash)} · Card ${money(bank)} · Paying with ${payment}.</p><p>${afford?`Left after this: <strong>${money(left)}</strong>.`:`Short ${money(-left)} on ${payment}. Nothing has been charged.`}</p>${caution}<div class="order-actions"><button class="primary" onclick="acceptShopConfirm()" ${afford?'':'disabled'}>Buy now</button><button class="ghost" onclick="closeShopConfirm()">Back to the shelf</button></div></section>`;
}
export function shopRefundHTML(offer={},guest=false){
 const undo=guest?'':'<button class="ghost" onclick="refundShopPurchase()">Refund</button>';
 return `<div id="shopRefund" class="shop-refund" role="status"><span>Bought ${esc(offer.name||'item')} · ${esc(offer.price||'')}. You can undo this purchase.</span>${undo}<button class="ghost" onclick="dismissShopRefund()">Keep it</button></div>`;
}
