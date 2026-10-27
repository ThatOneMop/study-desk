// v175: relationship status. Every customer you know (named locals and street regulars) sits on one of five
// levels, shown as a labelled bar: Hostile, Unfriendly, Neutral, Friendly, Loyal. Good deals, samples and
// chats push it up; bad product, ripoffs and getting caught pull it down. The level sets what they pay,
// how often they text you, and whether they refer friends. Pure helpers; game.js does the wiring.
export const STANDINGS=['Hostile','Unfriendly','Neutral','Friendly','Loyal'];
export const STANDING_AT=[0,20,40,60,80];
export const STANDING_START=45;
// Named locals: the old relationship score (0–100) plus a grudge from bad experiences.
export function standingScore(relation=0,grudge=0){
 const r=Math.max(0,Math.min(100,Number(relation)||0)),g=Math.max(0,Number(grudge)||0);
 return Math.max(0,Math.min(100,Math.round(STANDING_START+r*.55-g)));
}
export function standingOf(score){
 const v=Math.max(0,Math.min(100,Number.isFinite(score)?score:STANDING_START));let level=0;
 for(let i=0;i<STANDING_AT.length;i++)if(v>=STANDING_AT[i])level=i;
 const lo=STANDING_AT[level],hi=STANDING_AT[level+1]??101;
 return {score:Math.round(v),level,label:STANDINGS[level],fill:Math.round(v),within:Math.min(1,(v-lo)/(hi-lo))};
}
// What a level does: price paid, how often they order, daily referral chance.
export const STANDING_PRICE=[.8,.9,1,1.08,1.15];
export const STANDING_ORDERS=[.25,.6,1,1.35,1.7];
export const STANDING_REFERRAL=[0,0,.02,.06,.12];
export function standingEffects(level){
 const l=Math.max(0,Math.min(4,level|0));
 return {price:STANDING_PRICE[l],orders:STANDING_ORDERS[l],referral:STANDING_REFERRAL[l],buys:l>0};
}
// Events. Positive events on named locals go through the relationship score; negative ones add grudge so a
// local can fall below Neutral. Street people keep a single score.
export const STANDING_EVENTS={chat:2,sample:6,fairDeal:3,goodDeal:5,ripoff:-10,badProduct:-7,caught:-15,snitched:-10};
export function dealVerdict({price,fair,enjoyment=.5}={}){
 const out=[];if(!(fair>0)||!(price>0))return out;
 const r=price/fair;
 if(r<=.95)out.push('goodDeal');else if(r<=1.12)out.push('fairDeal');else if(r>1.25)out.push('ripoff');
 if(enjoyment<.3)out.push('badProduct');
 return out;
}
export function grudgeFor(kind){const v=STANDING_EVENTS[kind]||0;return v<0?-v:0;}
// Grudges fade: four points a day.
export function grudgeTick(grudge,days=1){return Math.max(0,(Number(grudge)||0)-4*Math.max(0,days));}
// Street regulars (regulars.mjs entries) gain a score the first time we read them.
export function migrateStanding(e){
 if(!e||typeof e!=='object')return STANDING_START;
 if(Number.isFinite(e.std))return e.std;
 const n=Math.max(0,(e.n||0)-1),b=e.bought||0;
 e.std=Math.min(STANDING_START+30,STANDING_START+Math.min(15,n*3)+Math.min(15,b*5));return e.std;
}
export function streetStanding(e,kind){
 const now=migrateStanding(e),d=STANDING_EVENTS[kind]||0;
 e.std=Math.max(0,Math.min(100,now+d));return standingOf(e.std);
}
// Order frequency: a stable daily roll per customer. Returns true if this customer skips asking today.
export function skipsOrderToday(level,day,i){
 const f=standingEffects(level).orders;if(f>=1)return false;
 let h=((day|0)*73856093)^((i|0)*19349663);h=(h^(h>>>13))*1274126177;h=((h^(h>>>16))>>>0)%1000/1000;
 return h>f;
}
// How much sooner a happy customer asks again (minutes off the gap).
export function askSooner(level){const f=standingEffects(level).orders;return f>1?Math.round((f-1)*240):0;}
export function standingBarHTML(st,{compact=false}={}){
 const s=st&&Number.isFinite(st.score)?st:standingOf(STANDING_START);
 const ticks=STANDING_AT.slice(1).map(v=>'<i style="left:'+v+'%"></i>').join('');
 return '<div class="rel-status rel-l'+s.level+(compact?' is-compact':'')+'" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+s.score+'" aria-label="Relationship: '+s.label+'">'
  +'<span class="rel-label">'+s.label+'</span><span class="rel-bar"><b style="width:'+s.fill+'%"></b>'+ticks+'</span></div>';
}
export function standingChangeText(name,before,after){
 if(!before||!after||before.level===after.level)return '';
 return name+(after.level>before.level?' warms up · now ':' cools off · now ')+after.label;
}
