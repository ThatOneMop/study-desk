// v167: Messages app restyle. A plain white texting screen: contact portrait and name centred at the top,
// your bubbles green on the right, theirs light grey on the left, and a compose bar at the bottom.
// Pure helpers plus one DOM pass over the already-rendered thread (game logic and handlers untouched).
const HAIR=[0x2a1d14,0x4a3020,0x7a5230,0xc9a25a,0x1b1b1f,0x8c8c88,0xa8432c,0x5b3b2a];
const fallbackEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function nameHash(name){let h=2166136261;for(const ch of String(name||''))h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;return h;}
export function contactPalette(contact={}){
 const h=nameHash(contact.name);
 return Object.freeze({outfit:Number.isFinite(contact.color)?contact.color:0x4a6d96,skin:Number.isFinite(contact.skin)?contact.skin:0xd9a066,hair:HAIR[h%HAIR.length]});
}
export function smsHeadHTML({name='',sub='',avatar='',back="menu('phone')"}={},esc=fallbackEsc){
 const pic=avatar?'<img class="sms-avatar" src="'+esc(avatar)+'" alt="">':'<span class="sms-avatar sms-initial" aria-hidden="true">'+esc(String(name||'?')[0])+'</span>';
 return '<header class="sms-head"><button type="button" class="sms-back" aria-label="Back to messages" onclick="'+back+'">‹</button>'+pic+'<strong class="sms-name">'+esc(name)+'</strong>'+(sub?'<small class="sms-sub">'+esc(sub)+'</small>':'')+'</header>';
}
export function smsComposeHTML({placeholder='Text message',action='',label='Send',disabled=false}={},esc=fallbackEsc){
 return '<div class="sms-compose"><span class="sms-field">'+esc(placeholder)+'</span><button type="button" class="sms-send" aria-label="'+esc(label)+'"'+(action?' onclick="'+action+'"':'')+(disabled?' disabled':'')+'>↑</button></div>';
}
// Restructure the rendered thread in place. Returns a small summary for tests and shots.
export function restyleThread(modal,{name='',sub='',avatar=''}={},esc=fallbackEsc){
 if(!modal||typeof modal.querySelector!=='function')return null;
 modal.classList?.add('sms-screen');
 const old=modal.querySelector('.phoneheader');if(old)old.remove();
 if(!modal.querySelector('.sms-head')){
  const status=modal.querySelector('.device-status');
  const html=smsHeadHTML({name,sub,avatar},esc);
  if(status)status.insertAdjacentHTML('afterend',html);else modal.insertAdjacentHTML('afterbegin',html);
 }
 const head=modal.querySelector('.sms-head');
 const bubbles=[...modal.querySelectorAll('.message')];
 let log=modal.querySelector('.sms-log');
 if(!log&&bubbles.length){
  log=document.createElement('div');log.className='sms-log';log.setAttribute('role','log');
  log.innerHTML='<p class="sms-stamp">Today</p>';
  head.after(log);for(const b of bubbles)log.appendChild(b);
 }
 // The "Send your current listing" row becomes the compose bar.
 let compose=false;
 for(const item of modal.querySelectorAll('.item')){
  const btn=item.querySelector('button');const act=btn?.getAttribute('onclick')||'';
  if(!/action\('text'/.test(act))continue;
  const desc=item.querySelector('p')?.textContent||'';
  item.outerHTML=smsComposeHTML({placeholder:btn.disabled?desc:'Text listing: '+desc,action:act,label:btn.textContent||'Send',disabled:btn.disabled},esc);
  compose=true;break;
 }
 // Their live offer and your counter sit straight under the conversation; profile notes go below the compose bar.
 let anchor=log||head;
 for(const el of modal.querySelectorAll('.deal-bubble,.counter-sheet')){anchor.after(el);anchor=el;}
 const nav=modal.querySelector('.device-keys');
 for(const el of modal.querySelectorAll('.appeal-board,.customerCard')){if(nav)nav.before(el);else modal.appendChild(el);el.classList.add('sms-about');}
 return {bubbles:bubbles.length,mine:bubbles.filter(b=>b.classList.contains('mine')).length,compose,head:!!head};
}
export function portraitInbox(modal,avatars=[]){
 if(!modal||typeof modal.querySelectorAll!=='function')return 0;let n=0;
 const inbox=modal.querySelector('.message-inbox'),status=modal.querySelector('.device-status');
 if(inbox){modal.classList?.add('sms-screen','sms-inbox');if(status&&status.nextElementSibling!==inbox)status.after(inbox);}
 modal.querySelectorAll('.message-inbox .thread-row').forEach((row,i)=>{const mug=row.querySelector('.mug');const src=avatars[i];if(!mug||!src)return;mug.style.backgroundImage='url("'+src+'")';mug.classList.add('has-portrait');mug.textContent='';n++;});
 return n;
}
