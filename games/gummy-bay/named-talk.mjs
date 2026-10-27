// v174: talk to the people you know by name. Press E at a named customer, a shopkeeper or one of your
// Sweet Network dealers and you get the same face-to-face talk card as street strangers, with their own
// lines, a friendly "fan" level (how much they like your gummies and you, nothing else) and options that
// fit who they are: a deal, a sample, a look at the shop, or a word about their part of town.
const pick=(list,seed)=>list[((seed%list.length)+list.length)%list.length];
export const FAN_LEVELS=Object.freeze(['New face','Acquaintance','Friendly','Fan','Big fan','Superfan']);
// 0..5 from relationship (0..100) and how many times you have chatted / traded.
export function fanLevel({relation=0,chats=0,trades=0}={}){
 const pts=Math.max(0,Math.min(100,relation))+Math.min(20,chats*2)+Math.min(30,trades*3);
 return pts>=110?5:pts>=80?4:pts>=55?3:pts>=30?2:pts>=10?1:0;
}
export const fanLabel=n=>FAN_LEVELS[Math.max(0,Math.min(5,n|0))];
// Shopkeepers and staff behind a counter. Keys match the point type.
export const KEEPERS=Object.freeze({
 dealer:{name:'Milo',role:'Seed dealer',shop:'Show me the seeds',lines:['Pine Pops are sprouting nicely this week. Patience pays.','Soil’s fresh in. Smells like rain, doesn’t it?','You water twice, you harvest happy. Old garden rule.','Don’t tell Hank, but my tomatoes beat his every year.']},
 hardware:{name:'Hank',role:'Hardware',shop:'What’s on the shelves?',lines:['Tents, cans, trimmers. If it bolts together, I sell it.','Measure twice, buy once. That’s the Hank promise.','Got a new bench vice in. Beauty, isn’t she?','You keep that tent zipped, mate. Mould loves a gap.']},
 store:{name:'Priya',role:'Corner store',shop:'I need packaging',lines:['Baggies, jars, labels. Pretty packs sell themselves.','The jar lids click now. Very satisfying, I checked.','Busy morning! Everyone wants snacks for the beach.','Stack ’em neat and customers trust you more.']},
 reception:{name:'Dot',role:'Palm Court Motel',shop:'About the room…',lines:['Room 04 has the best breeze. Don’t tell the others.','Checkout’s at ten, but I’m flexible for regulars.','The ice machine is moody. Kick it gently.']},
 property:{name:'Graham',role:'Cedar Bay Lettings',shop:'Show me homes',lines:['Hillside house has a view to die for. Figuratively.','Bigger home, bigger workshop. Simple maths.','Every tenant gets a free welcome mat. Very plush.']},
 helpers:{name:'Tess',role:'Helping Hand',shop:'Who can I hire?',lines:['Good helpers are worth every cent. Ask me how I know.','My crew shows up on time. Mostly.','Need hands at the bench? I’ve got just the person.']},
 servo:{name:'Kev',role:'Coastway servo',shop:'Mixing ingredients',lines:['Fuel, ice, mixers. Life’s essentials.','The slushie machine is my true love.','Some folk mix lime into everything. Brave.']}
});
const CUSTOMER_LINES=[
 ['Oh, hi. Do I know you?','Hello there. Can I help?','Hm? Oh, hey.'],
 ['Hey, you again! How’s things?','Good to see you around.','Oh hey, nice day for it.'],
 ['Hey friend! Got anything good lately?','There’s my gummy person!','Hey you. Been thinking about those flavours.'],
 ['My favourite gummy maker! What’s new?','I told my mates about you. All good things.','You always make my day, you know.'],
 ['Hey legend! I saved you a spot on the bench.','Best gummies in Gummy Bay, I swear.','You’re basically family now.'],
 ['My hero! I’d follow your gummies anywhere.','I made a playlist for when I eat your gummies. True story.','If you ever open a shop, I’m first in line.']
];
export function namedLine(kind,{seed=0,fan=0,own=''}={}){
 if(kind==='customer'){const tier=CUSTOMER_LINES[Math.max(0,Math.min(5,fan|0))];return seed%4===3&&own?own:pick(tier,seed);}
 if(kind==='netdealer')return seed%3===0&&own?own:pick(['Sales are ticking along, boss.','Kept my head down today. Smooth as caramel.','People keep asking for the sour ones.','Quiet street, busy pockets. Good combo.'],seed);
 const k=KEEPERS[kind];return k?pick(k.lines,seed):'Hello!';
}
export function areaLine({district='',heat=0,police=0,customers=0,seed=0}={}){
 const where=district?district+' is ':'Around here is ';
 const vibe=heat>=60?'crawling with Sugar Squad today. Lie low.':police>0?'quiet, but a Sugar Squad car did a lap earlier.':pick(['pretty chill today.','buzzing. Good weather for it.','sleepy. Everyone’s at the beach.'],seed);
 const ppl=customers>1?' I know '+customers+' people nearby with a sweet tooth.':customers===1?' One of my neighbours loves a gummy.':'';
 return where+vibe+ppl;
}
// The numbered options shown on the card, business first so a quick E then 1 still opens the deal.
export function namedOptions(kind,{deal=false,canSample=false,packs=0,locked=false,shop=''}={}){
 if(kind==='customer')return [
  {id:'biz',label:deal?'About our deal…':locked?'What would you buy?':'Talk business'},
  {id:'sample',label:'Offer a free sample',disabled:!canSample||packs<1},
  {id:'chat',label:'How’s it going?'},
  {id:'area',label:'What’s your area like?'},
  {id:'bye',label:'See you later'}];
 if(kind==='netdealer')return [{id:'biz',label:'Check the books'},{id:'chat',label:'How’s business?'},{id:'area',label:'How’s the turf?'},{id:'bye',label:'Stay safe'}];
 return [{id:'biz',label:shop||'Show me what you’ve got'},{id:'chat',label:'How’s your day?'},{id:'area',label:'Anything happening nearby?'},{id:'bye',label:'Thanks, bye'}];
}
export const NAMED_KINDS=Object.freeze(['customer','netdealer',...Object.keys(KEEPERS)]);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function namedCardHTML({name,role='',fan=0,line='',options=[],portrait=''}){
 return '<div class="talk-card named-talk"><div class="talk-face">'+(portrait?'<img alt="" src="'+esc(portrait)+'">':'')+'</div><div class="talk-body"><b>'+esc(name)+'</b><small>'+esc(role)+'</small><span class="talk-fan" data-fan="'+(fan|0)+'">'+'♥'.repeat(Math.max(0,Math.min(5,fan|0)))+'<i>'+'♡'.repeat(5-Math.max(0,Math.min(5,fan|0)))+'</i> '+esc(fanLabel(fan))+'</span><p>'+esc(line)+'</p><ol class="talk-options">'+
  options.map((o,i)=>'<li><button data-named="'+esc(o.id)+'"'+(o.disabled?' disabled':'')+'><span class="key">'+(i+1)+'</span>'+esc(o.label)+'</button></li>').join('')+'</ol></div></div>';
}
