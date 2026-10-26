// Lucky Pier prize arcade: ticket economy and prize counter. Pure logic, no DOM.
// Family-friendly by design: tokens are bought with in-game cash at one fixed
// rate, games pay TICKETS by skill only, and nothing converts back into cash.
export const TOKEN_PRICE=5;
export const TOKEN_PACKS=Object.freeze([1,5,10]);
export const MAX_TOKENS=60;
export const MAX_TICKETS=99999;
export const ARCADE_GAMES=Object.freeze([
 {id:'claw',name:'Gummy Grabber',blurb:'Line up the claw, wait for the swing to settle, grab a plushie.',cost:2,cap:40,secs:45,color:'#ff5fb8'},
 {id:'skee',name:'Skee-Bay',blurb:'Aim the lane, time the power meter, sink the 100 pockets.',cost:1,cap:30,secs:45,color:'#43e8ff'},
 {id:'drop',name:'Gummy Drop',blurb:'Time each drop in front of the pusher to shove gummies off the ledge.',cost:1,cap:30,secs:40,color:'#ffd23f'},
 {id:'whack',name:'Whack-a-Bear',blurb:'Bonk the gummy bears. Leave Gramps\u2019 cat alone!',cost:1,cap:30,secs:30,color:'#7dff6a'},
 {id:'hoop',name:'Pier Hoops',blurb:'Set the angle, time the power, swish it. The hoop moves late on.',cost:1,cap:30,secs:40,color:'#ff8a3d'},
]);
export const PRIZES=Object.freeze([
 {id:'snack-fizz',name:'Pier Fizz & pretzel',kind:'snack',cost:40,xp:10,blurb:'+10 XP and full stamina. One per day.'},
 {id:'grip-pink',name:'Bubblegum grip tape',kind:'grip',cost:60,color:0xff8fc8,blurb:'Pink grip for every board.'},
 {id:'grip-mint',name:'Mint grip tape',kind:'grip',cost:60,color:0x7fe6c4,blurb:'Cool mint grip for every board.'},
 {id:'grip-grape',name:'Neon Grape grip tape',kind:'grip',cost:100,color:0x9b6bff,blurb:'Glowy purple grip.'},
 {id:'grip-gold',name:'Glitter Gold grip tape',kind:'grip',cost:220,color:0xf3c241,blurb:'The flex. Sparkly gold grip.'},
 {id:'hat-pier',name:'Lucky Pier cap',kind:'hat',cost:160,color:0x7b3fb5,blurb:'Purple cap with the pier bulb logo. Worn while skating.'},
 {id:'poster-pier',name:'Lucky Pier neon poster',kind:'poster',cost:120,blurb:'Hangs in the RV.'},
 {id:'poster-bear',name:'Surf Bear poster',kind:'poster',cost:150,blurb:'A gummy bear on a wave. Hangs in the RV.'},
 {id:'poster-kick',name:'Kickflip Container poster',kind:'poster',cost:180,blurb:'Skate spot tribute. Hangs in the RV.'},
]);
export const GAME_IDS=ARCADE_GAMES.map(g=>g.id);
export const PRIZE_IDS=PRIZES.map(p=>p.id);
export const gameById=id=>ARCADE_GAMES.find(g=>g.id===id)||null;
export const prizeById=id=>PRIZES.find(p=>p.id===id)||null;
const int=(v,lo,hi)=>Number.isFinite(+v)?Math.max(lo,Math.min(hi,Math.floor(+v))):lo;

export function normalizeArcade(s){
 if(!s||typeof s!=='object')return s;
 const a=s.arcade&&typeof s.arcade==='object'?s.arcade:{};
 const owned=Array.isArray(a.owned)?[...new Set(a.owned.filter(id=>PRIZE_IDS.includes(id)&&prizeById(id).kind!=='snack'))]:[];
 const grip=owned.includes(a.grip)&&prizeById(a.grip)?.kind==='grip'?a.grip:null;
 const best={};for(const id of GAME_IDS)best[id]=int(a.best?.[id],0,MAX_TICKETS);
 s.arcade={tokens:int(a.tokens,0,MAX_TOKENS),tickets:int(a.tickets,0,MAX_TICKETS),earned:int(a.earned,0,1e9),owned,grip,
  hat:a.hat===true&&owned.includes('hat-pier'),snackDay:int(a.snackDay,0,1e9),plays:int(a.plays,0,1e9),best};
 return s;
}

// spend(n) is the host's cash/card spender; it returns false when funds are short.
export function buyTokens(s,n,spend){
 normalizeArcade(s);const a=s.arcade;
 if(!TOKEN_PACKS.includes(n))return {ok:false,reason:'Pick a token pack.'};
 if(a.tokens+n>MAX_TOKENS)return {ok:false,reason:'Token cup is full ('+MAX_TOKENS+' max).'};
 const price=n*TOKEN_PRICE;
 if(typeof spend!=='function'||!spend(price))return {ok:false,reason:'funds'};
 a.tokens+=n;return {ok:true,tokens:a.tokens,price};
}

// One token payment opens exactly one session; a session pays out once.
let nextSession=1;
export function startPlay(s,id){
 normalizeArcade(s);const g=gameById(id);if(!g)return {ok:false,reason:'Unknown game.'};
 if(s.arcade.tokens<g.cost)return {ok:false,reason:'Need '+g.cost+' token'+(g.cost>1?'s':'')+'. Buy some at the token machine.'};
 s.arcade.tokens-=g.cost;s.arcade.plays++;
 return {ok:true,session:{id:nextSession++,game:id,paid:g.cost,open:true}};
}
export function ticketsForScore(id,score){
 const g=gameById(id);if(!g)return 0;const n=Number.isFinite(+score)?Math.floor(+score):0;
 return Math.max(0,Math.min(g.cap,n));
}
export function finishPlay(s,session,score){
 normalizeArcade(s);
 if(!session||!session.open||!gameById(session.game))return {ok:false,tickets:0};
 session.open=false;
 const tickets=ticketsForScore(session.game,score);
 s.arcade.tickets=Math.min(MAX_TICKETS,s.arcade.tickets+tickets);s.arcade.earned+=tickets;
 const best=s.arcade.best[session.game]||0,record=tickets>best;if(record)s.arcade.best[session.game]=tickets;
 return {ok:true,tickets,record,total:s.arcade.tickets};
}

// Redeem at the counter. Prizes never refund or sell back.
export function redeemPrize(s,id,day=1){
 normalizeArcade(s);const p=prizeById(id),a=s.arcade;if(!p)return {ok:false,reason:'Unknown prize.'};
 if(p.kind==='snack'){
  if(a.snackDay>=day)return {ok:false,reason:'One Pier Fizz per day. Come back tomorrow.'};
  if(a.tickets<p.cost)return {ok:false,reason:'Need '+(p.cost-a.tickets)+' more tickets.'};
  a.tickets-=p.cost;a.snackDay=day;return {ok:true,prize:p,xp:p.xp};
 }
 if(a.owned.includes(id))return {ok:false,reason:'Already won.',owned:true};
 if(a.tickets<p.cost)return {ok:false,reason:'Need '+(p.cost-a.tickets)+' more tickets.'};
 a.tickets-=p.cost;a.owned.push(id);
 if(p.kind==='grip')a.grip=id;if(p.kind==='hat')a.hat=true;
 return {ok:true,prize:p};
}
export function equipGrip(s,id){normalizeArcade(s);if(id===null){s.arcade.grip=null;return true;}if(!s.arcade.owned.includes(id)||prizeById(id)?.kind!=='grip')return false;s.arcade.grip=id;return true;}
export function toggleHat(s){normalizeArcade(s);if(!s.arcade.owned.includes('hat-pier'))return false;s.arcade.hat=!s.arcade.hat;return true;}
export function gripColor(s){const id=s?.arcade?.grip;return id&&s.arcade.owned?.includes(id)?prizeById(id)?.color??null:null;}
export function ownedPosters(s){return (s?.arcade?.owned||[]).filter(id=>prizeById(id)?.kind==='poster');}
