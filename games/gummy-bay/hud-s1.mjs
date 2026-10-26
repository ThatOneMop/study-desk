// Minimal in-world HUD: 12-hour clock, item hotbar, notifications and the
// end-of-day summary. Presentation only. Nothing here reads or writes a save
// field that does not already exist, so v3 saves load unchanged.

const DAYS=Object.freeze(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']);
const SHORT=Object.freeze(['Mon','Tue','Wed','Thu','Fri','Sat','Sun']);

export function s1Clock(day,time){
 const safeDay=Number.isFinite(day)&&day>=1?Math.min(9999,Math.floor(day)):1;
 const minute=Number.isFinite(time)?Math.max(0,Math.min(1439,Math.floor(time))):0;
 const h24=Math.floor(minute/60),m=minute%60,h12=h24%12===0?12:h24%12,meridiem=h24<12?'AM':'PM';
 const index=(safeDay-1)%7;
 const clock=h12+':'+String(m).padStart(2,'0')+' '+meridiem;
 return Object.freeze({day:safeDay,clock,weekday:DAYS[index],short:SHORT[index],label:clock+' · '+SHORT[index],night:h24>=20||h24<6});
}

const svg=body=>'<svg viewBox="0 0 32 32" aria-hidden="true">'+body+'</svg>';
export const HUD_ICONS=Object.freeze({
 bag:svg('<path d="M10 9a6 6 0 0 1 12 0" fill="none" stroke="#5b4a3a" stroke-width="2.4"/><rect x="6" y="9" width="20" height="19" rx="5" fill="#8a6a4c"/><rect x="9" y="17" width="14" height="8" rx="2" fill="#6f543c"/><rect x="14" y="16" width="4" height="3" rx="1" fill="#d8c08a"/><path d="M8 12h16" stroke="#a5835f" stroke-width="1.5"/>'),
 can:svg('<path d="M6 13l-3-5" stroke="#6f8a94" stroke-width="3" stroke-linecap="round"/><path d="M24 15l5-6" stroke="#7d98a2" stroke-width="3" stroke-linecap="round"/><circle cx="29" cy="9" r="2" fill="#9fb8c1"/><path d="M8 12h15l1 15H7z" fill="#7d98a2"/><path d="M8 12h15l.3 4H7.7z" fill="#9fb8c1"/><path d="M11 12a5 5 0 0 1 9 0" fill="none" stroke="#5c737c" stroke-width="2.2"/>'),
 packs:svg('<path d="M8 5h16l2 23H6z" fill="#e0d3b4"/><path d="M8 5h16v3H8z" fill="#c8b791"/><circle cx="16" cy="17" r="4.2" fill="#e2534b"/><circle cx="13.2" cy="13.4" r="1.8" fill="#e2534b"/><circle cx="18.8" cy="13.4" r="1.8" fill="#e2534b"/><path d="M10 24h12" stroke="#b9a77f" stroke-width="1.5"/>'),
 grow:svg('<path d="M9 19h14l-2 9H11z" fill="#a8683f"/><path d="M8 18h16v3H8z" fill="#c07a4b"/><path d="M16 18V9" stroke="#5f9a46" stroke-width="2"/><path d="M16 12c-6 0-8-4-8-7 5 0 8 3 8 7zM16 10c0-4 3-7 8-7 0 4-3 7-8 7z" fill="#7cbc5a"/>'),
 mix:svg('<path d="M12 3h8M13 3v9L6 25a2.5 2.5 0 0 0 2 4h16a2.5 2.5 0 0 0 2-4L19 12V3" fill="#cfe3ea" stroke="#8aa7b1" stroke-width="1.6"/><path d="M9 20h14l3 5a2.5 2.5 0 0 1-2 4H8a2.5 2.5 0 0 1-2-4z" fill="#b276d6"/><circle cx="14" cy="23" r="1.3" fill="#e2c8f2"/><circle cx="19" cy="25" r="1" fill="#e2c8f2"/>'),
 map:svg('<path d="M3 7l8-3 10 3 8-3v21l-8 3-10-3-8 3z" fill="#d9cfaf"/><path d="M11 4v21M21 7v21" stroke="#b5a983" stroke-width="1.4"/><path d="M6 19c4-4 7 1 10-3s5-5 9-2" fill="none" stroke="#d46b4f" stroke-width="1.8" stroke-dasharray="2.5 2"/><circle cx="24" cy="13" r="2.2" fill="#d46b4f"/>'),
 supplies:svg('<path d="M7 11h18v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" fill="#c9b07a"/><path d="M6 8h20v4H6z" fill="#a98f5c"/><path d="M11 17h10M11 21h10" stroke="#a98f5c" stroke-width="1.6"/><path d="M12 8c1-3 7-3 8 0" fill="none" stroke="#8c7449" stroke-width="1.6"/>'),
 loose:svg('<circle cx="16" cy="19" r="7" fill="#f0a33c"/><circle cx="11" cy="11" r="3.2" fill="#f0a33c"/><circle cx="21" cy="11" r="3.2" fill="#f0a33c"/><circle cx="16" cy="14" r="4.6" fill="#f3b457"/><circle cx="14.3" cy="13.4" r=".9" fill="#7a4a18"/><circle cx="17.7" cy="13.4" r=".9" fill="#7a4a18"/><path d="M12 22c2 2 6 2 8 0" stroke="#d9862a" stroke-width="1.4" fill="none"/>'),
 cash:svg('<rect x="2" y="8" width="28" height="16" rx="2" fill="#3f8f45"/><rect x="4.5" y="10.5" width="23" height="11" rx="1.5" fill="none" stroke="#7fcf7f" stroke-width="1.2"/><circle cx="16" cy="16" r="3.6" fill="#7fcf7f"/><path d="M16 13.8v4.4" stroke="#2f6e34" stroke-width="1.3"/>'),
 card:svg('<rect x="2" y="7" width="28" height="18" rx="3" fill="#2f6fb5"/><path d="M2 12h28" stroke="#1d4f86" stroke-width="3"/><rect x="5" y="17" width="7" height="4" rx="1" fill="#e7c766"/><path d="M15 20h11" stroke="#9cc8f2" stroke-width="1.5"/>'),
 phone:svg('<rect x="9" y="3" width="14" height="26" rx="3" fill="#2b211c"/><rect x="11" y="6.5" width="10" height="17" rx="1" fill="#e9eef0"/><circle cx="16" cy="26.3" r="1.2" fill="#6d5b4f"/>'),
 menu:svg('<path d="M8 10h16M8 16h16M8 22h16" stroke="#e9eef0" stroke-width="2.6" stroke-linecap="round"/>'),
 message:svg('<rect x="3" y="5" width="26" height="18" rx="6" fill="#55c35a"/><path d="M9 22l-2 6 8-5z" fill="#55c35a"/>'),
 police:svg('<path d="M16 3l11 4v8c0 7-5 12-11 14C10 27 5 22 5 15V7z" fill="#3c63d6"/><path d="M16 9l2 4.3 4.6.5-3.4 3.1 1 4.6L16 19.2l-4.2 2.3 1-4.6-3.4-3.1 4.6-.5z" fill="#ffd34d"/>'),
 board:svg('<g transform="rotate(-32 16 16)"><rect x="3" y="12.5" width="26" height="7" rx="3.5" fill="#2a2a2e"/><rect class="deck" x="4" y="12" width="24" height="6.4" rx="3.2" fill="#e8743b"/><path d="M8 15.2h16" stroke="#fff3" stroke-width="1.2" stroke-dasharray="2 2"/><circle cx="9" cy="21" r="2.2" fill="#f4e6c4"/><circle cx="23" cy="21" r="2.2" fill="#f4e6c4"/></g>'),
 star:svg('<path d="M16 3l3.8 8.1 8.7 1-6.4 6 1.7 8.6L16 22.4l-7.8 4.3 1.7-8.6-6.4-6 8.7-1z" fill="#ffd34d"/>')
});

export const HOTBAR_SLOTS=Object.freeze([
 Object.freeze({key:'1',id:'bag',label:'Bag',act:'menu',target:'bag'}),
 Object.freeze({key:'2',id:'can',label:'Watering can',act:'equip',target:'can',elementId:'equipCan'}),
 Object.freeze({key:'3',id:'packs',label:'Packed gummies',act:'equip',target:'packs',elementId:'equipPacks'}),
 Object.freeze({key:'4',id:'grow',label:'Grow journal',act:'menu',target:'journal'}),
 Object.freeze({key:'5',id:'mix',label:'Find the mixing bench',act:'track',target:'mix'}),
 Object.freeze({key:'6',id:'map',label:'Town map',act:'menu',target:'map'}),
 Object.freeze({key:'7',id:'supplies',label:'Gummy supplies',act:'menu',target:'bag'}),
 Object.freeze({key:'8',id:'loose',label:'Loose gummies',act:'menu',target:'bag'}),
 Object.freeze({key:'9',id:'board',label:'Skateboard',act:'equip',target:'board',elementId:'equipBoard'})
]);

export function hotbarSlot(key){return HOTBAR_SLOTS.find(slot=>slot.key===String(key))||null;}

const count=value=>Number.isFinite(value)&&value>0?Math.floor(value):0;
// Counts shown in the bottom-right of each slot. Empty or unowned slots read as dim.
export function hotbarCounts(state={},stock={}){
 state=state&&typeof state==='object'?state:{};stock=stock&&typeof stock==='object'?stock:{};
 return Object.freeze({
  bag:count(stock.carried),
  can:state.can?1:0,
  packs:count(stock.carried),
  grow:Array.isArray(state.plants)?state.plants.filter(p=>p&&p.phase).length:0,
  mix:0,map:0,
  supplies:count(stock.raw),
  loose:count(stock.loose),
  board:Array.isArray(state.boards)?state.boards.length:0
 });
}

export function hotbarHTML(esc=v=>String(v)){
 const slots=HOTBAR_SLOTS.map(slot=>'<button type="button" class="slot" data-slot="'+slot.id+'"'+(slot.elementId?' id="'+slot.elementId+'"':'')+(slot.act==='menu'?' data-panel="'+slot.target+'"':'')+' aria-label="'+esc(slot.label)+' ['+slot.key+']" title="'+esc(slot.label)+' ['+slot.key+']"><i>'+slot.key+'</i>'+HUD_ICONS[slot.id]+'<em></em></button>').join('');
 return '<div class="slots">'+slots+'</div><div class="money"><button type="button" id="cashSlot" class="money-tile cash-tile" data-panel="bag" aria-label="Cash">'+HUD_ICONS.cash+'<b id="cashSlotValue">$0</b></button><button type="button" id="cardSlot" class="money-tile card-tile" data-panel="wallet" aria-label="Online card">'+HUD_ICONS.card+'<b id="cardSlotValue">$0</b></button></div>';
}

// Notification stack: newest on top, at most three, each for about four seconds.
export function pushNotice(list,notice,now,{max=3,life=4000}={}){
 const live=(Array.isArray(list)?list:[]).filter(item=>item&&item.until>now);
 const text=typeof notice?.text==='string'?notice.text.trim().slice(0,180):'';
 if(!text)return live.slice(0,max);
 if(live[0]&&live[0].text===text){live[0]={...live[0],id:(notice.id||'n')+':'+now,until:now+life};return live.slice(0,max);}
 return [{id:(notice.id||'n')+':'+now,app:notice.app||'message',title:notice.title||'Gummy Bay',text,until:now+life}].concat(live).slice(0,max);
}

// A short, readable title for a toast, picked from what the message is about.
export function noticeKind(text){
 const t=String(text||'').toLowerCase();
 if(/police|officer|curfew|search|arrest|wanted|patrol|seiz/.test(t))return Object.freeze({app:'police',title:'Police'});
 if(/text|message|call|jules|reply|says|offer/.test(t))return Object.freeze({app:'message',title:'Messages'});
 if(/sale|earned|paid|\$|cash|card|bank|sold|price/.test(t))return Object.freeze({app:'cash',title:'Money'});
 if(/level|xp|rank|unlock/.test(t))return Object.freeze({app:'star',title:'Progress'});
 return Object.freeze({app:'bag',title:'Gummy Bay'});
}

// End-of-day card. Uses values already on the save; level formula is passed in.
export function sleepSummary(before,after,levelOf=xp=>1+Math.floor(xp/30)){
 const b=before&&typeof before==='object'?before:{},a=after&&typeof after==='object'?after:{};
 const num=v=>Number.isFinite(v)?v:0;
 const earned=Math.round((num(a.cash)+num(a.bank))-(num(b.cash)+num(b.bank)));
 const deals=Math.max(0,Math.round(num(a.sold)-num(b.sold)));
 const xp=Math.max(0,Math.round(num(a.xp)-num(b.xp)));
 const fromLevel=levelOf(num(b.xp)),toLevel=levelOf(num(a.xp));
 return Object.freeze({day:Math.max(1,Math.floor(num(b.day)||1)),earned,deals,xp,level:toLevel,rankUp:toLevel>fromLevel,progress:Math.max(0,Math.min(1,(num(a.xp)%30)/30))});
}

export function sleepCardHTML(view,money=v=>'$'+v){
 if(!view)return '';
 const sign=view.earned>=0?'+':'−';
 return '<div class="sleep-card" role="dialog" aria-label="Day '+view.day+' summary"><small>END OF DAY '+view.day+'</small><h2>Summary</h2><dl><div><dt>Earnings</dt><dd class="'+(view.earned>=0?'pos':'neg')+'">'+sign+money(Math.abs(view.earned))+'</dd></div><div><dt>Deals completed</dt><dd>'+view.deals+'</dd></div><div><dt>Experience</dt><dd>+'+view.xp+' XP</dd></div></dl><div class="rank"><span>Rank '+view.level+'</span><div class="xpbar"><i style="width:'+Math.round(view.progress*100)+'%"></i></div></div>'+(view.rankUp?'<div class="rank-stamp">RANK UP</div>':'')+'<button type="button" class="primary" onclick="dismissSleepCard()">Continue</button></div>';
}

// White line glyphs for the phone's home-screen app tiles (original drawings).
const appSvg=body=>'<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+body+'</svg>';
export const APP_ICONS=Object.freeze({
 phone:appSvg('<path d="M4 5h16v11H9l-5 4z"/>'),
 contacts:appSvg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4-6.5 8-6.5s7 2 8 6.5"/>'),
 listing:appSvg('<path d="M3 12V4h8l10 10-7 7z"/><circle cx="7.5" cy="8.5" r="1.5"/>'),
 deals:appSvg('<path d="M2 6h11v10H2zM13 10h4l4 4v2h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
 wallet:appSvg('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>'),
 map:appSvg('<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>')
});
