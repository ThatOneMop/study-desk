'use strict';
/* Inkline: original, deterministic turn-based card exploration. No dependencies. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Inkline=api})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 const clone=o=>JSON.parse(JSON.stringify(o)),W=6,START=30,EXIT=5;
 const cards={
  nib:{name:'Nib',cost:1,kind:'line',range:1,text:'Move one square, straight.'},
  dash:{name:'Longhand',cost:1,kind:'line',range:2,text:'Move up to two squares, straight. Shelves block the line.'},
  fold:{name:'Fold',cost:2,kind:'fold',range:1,text:'Move one diagonal. Slip between shelves.'},
  siphon:{name:'Inkwell',cost:0,kind:'ink',text:'Stay here. Recover three ink.'},
  quill:{name:'Quill',cost:0,kind:'line',range:1,text:'Move one square, straight. Free ink cost.'},
  glide:{name:'Flourish',cost:1,kind:'line',range:3,text:'Move up to three squares, straight.'},
  mend:{name:'Bind',cost:1,kind:'heal',text:'Stay here. Restore three binding.'},
  leap:{name:'Margin note',cost:2,kind:'leap',range:2,text:'Jump to a square within two steps. Ignore shelves en route.'}
 };
 const chapters=[
  {name:'The Returned Letter',story:'Someone has been returning letters to an address that no longer exists. This first wing has no ink blots. Collect the pages, then the exit.',walls:[8,9,14,20,26],pages:[24,13,16,4],wells:[18,10],blots:[],limit:22,par:14,color:'#9ee5d0'},
  {name:'Atlas of Quiet Rooms',story:'The mapmaker drew rooms that only appear when nobody is speaking.',walls:[7,8,19,20,21,27],pages:[25,12,15,11],wells:[24,16],blots:[13,22,29,3],limit:20,par:10,color:'#e6c18b'},
  {name:'The Rain Catalogue',story:'A thousand years of rain, indexed by the things it almost washed away.',walls:[10,13,14,22,25,26],pages:[24,18,16,3],wells:[12,17],blots:[6,15,21,28,4],limit:22,par:12,color:'#a6cdeb'},
  {name:'Margins of a Giant',story:'A giant wrote a tiny apology. It takes a whole wing to contain it.',walls:[7,9,14,19,21,28],pages:[31,12,16,2],wells:[24,11],blots:[13,15,23,27,4],limit:23,par:13,color:'#d7b4e8'},
  {name:'The Unwritten Sea',story:'The final book contains a sea. Bring its scattered pages back to shore.',walls:[8,10,13,20,22,25],pages:[24,6,15,11],wells:[18,16],blots:[7,14,21,27,4],limit:21,par:11,color:'#ecc5b9'}
 ];
 // Keep the original closing times so earlier version-one routes remain resumable.
 chapters.forEach((c,i)=>c.limit=[28,30,30,30,32][i]);
 const costs={reservoir:3,binding:3},baseDeck=['nib','dash','nib','fold','dash','siphon'];
 const int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
 const maxInk=o=>7+2*o.profile.upgrades.reservoir,maxHealth=o=>6+2*o.profile.upgrades.binding;
 function fresh(index,profile){return{scoring:2,index,pos:START,ink:5+2*profile.upgrades.reservoir,health:6+2*profile.upgrades.binding,capacity:{ink:7+2*profile.upgrades.reservoir,health:6+2*profile.upgrades.binding},turn:0,deck:[...baseDeck],hand:['nib','dash','nib'],draw:['fold','dash','siphon'],discard:[],pages:[],wells:[],phase:'explore',offers:[],drafts:0,status:'active',stars:0,message:'Choose a card, then a lit square. Recover three pages and reach the golden exit.'}}
 const par=o=>o.run.scoring===2?chapters[o.run.index].par:[19,21,21,22,23][o.run.index];
 function create(){const profile={coins:0,best:[0,0,0,0,0],upgrades:{reservoir:0,binding:0}};return{version:1,profile,run:fresh(0,profile)}}
 function clearPath(c,a,b){const dx=Math.sign(b%W-a%W),dy=Math.sign(Math.floor(b/W)-Math.floor(a/W));let p=a;while(p!==b){p+=dx+dy*W;if(c.walls.includes(p))return false}return true}
 function targets(o,slot){const s=o.run,c=chapters[s.index],card=cards[s.hand[slot]];if(!card||s.status!=='active'||s.phase!=='explore'||s.ink<card.cost)return[];if(card.kind==='ink'||card.kind==='heal')return[s.pos];const out=[];for(let i=0;i<36;i++){if(i===s.pos||c.walls.includes(i))continue;const dx=Math.abs(i%W-s.pos%W),dy=Math.abs(Math.floor(i/W)-Math.floor(s.pos/W));if(card.kind==='line'&&(!dx||!dy)&&dx+dy<=card.range&&clearPath(c,s.pos,i)||card.kind==='fold'&&dx===1&&dy===1||card.kind==='leap'&&dx+dy<=2)out.push(i)}return out}
 function refill(s){if(!s.draw.length){s.draw=s.discard.splice(0);/* rotate on each cycle: deterministic, saveable, no hidden RNG */if(s.draw.length>1)s.draw.push(s.draw.shift())}s.hand.push(s.draw.shift())}
 function offers(s){const pool=['quill','glide','mend','leap','siphon'];return[0,1,2].map(i=>pool[(s.index+s.drafts*2+i)%pool.length])}
 function finish(o){const s=o.run,c=chapters[s.index];if(s.health<=0){s.status='lost';s.phase='explore';s.offers=[];s.message='The binding broke. Retry the volume; your earlier seals are safe.';return}if(s.pos===EXIT&&s.pages.length>=3){s.status='complete';s.phase='explore';s.offers=[];s.stars=1+(s.pages.length===4?1:0)+(s.health>=4&&s.turn<=par(o)?1:0);const old=o.profile.best[s.index];o.profile.best[s.index]=Math.max(old,s.stars);o.profile.coins+=Math.max(0,s.stars-old);s.message=`Volume recovered. ${s.stars} seals; only improvements add new seals.`;return}if(s.turn>=c.limit){s.status='lost';s.phase='explore';s.offers=[];s.message='The archive closed for the night. Retry with a different route or draft.';return}if(s.turn%4===0){s.phase='draft';s.offers=offers(s);s.message='A loose leaf offers a new technique. Draft one card into your hand.'}}
 function play(o,slot,target){const s=o.run;if(!targets(o,slot).includes(target))return false;const card=cards[s.hand[slot]],id=s.hand.splice(slot,1)[0];s.ink-=card.cost;s.discard.push(id);refill(s);if(card.kind==='ink')s.ink=Math.min(s.capacity.ink,s.ink+3);else if(card.kind==='heal')s.health=Math.min(s.capacity.health,s.health+3);else{s.pos=target;const c=chapters[s.index];if(c.pages.includes(target)&&!s.pages.includes(target))s.pages.push(target);if(c.wells.includes(target)&&!s.wells.includes(target)){s.wells.push(target);s.ink=Math.min(s.capacity.ink,s.ink+3)}if(c.blots.includes(target))s.health=Math.max(0,s.health-2)}s.turn++;s.message=`${card.name} written. ${s.pages.length}/3 required pages recovered.`;finish(o);return true}
 function rest(o){const s=o.run;if(s.status!=='active'||s.phase!=='explore')return false;s.ink=Math.min(s.capacity.ink,s.ink+2);s.turn++;s.message='Pen rested. Two ink recovered; the closing bell is one turn nearer.';finish(o);return true}
 function preview(o,slot,target){const copy=clone(o);if(!play(copy,slot,target))return null;const a=o.run,b=copy.run;return{pos:b.pos,ink:b.ink,health:b.health,pages:b.pages.length,turn:b.turn,status:b.status,phase:b.phase,stars:b.stars,damage:a.health-b.health,newPage:b.pages.length>a.pages.length,newWell:b.wells.length>a.wells.length}}
 function draft(o,i){const s=o.run;if(s.status!=='active'||s.phase!=='draft'||!int(i,0,2))return false;const card=s.offers[i];s.deck.push(card);s.discard.push(s.hand.shift());s.hand.push(card);s.offers=[];s.phase='explore';s.drafts++;s.message=`${cards[card].name} drafted. It joins your hand immediately; the oldest card goes to discard.`;return true}
 function next(o,index){const s=o.run;if(s.status==='active'||!int(index,0,4)||(index>0&&!o.profile.best[index-1]))return false;o.run=fresh(index,o.profile);return true}
 function retry(o){o.run=fresh(o.run.index,o.profile);return true}
 function upgrade(o,key){if(o.run.status!=='complete'||!(key in costs)||o.profile.upgrades[key]||o.profile.coins<costs[key])return false;o.profile.coins-=costs[key];o.profile.upgrades[key]=1;return true}
 function valid(o){try{const s=o.run,p=o.profile,c=chapters[s.index];if(o.version!==1||!c||!int(s.index,0,4)||!int(p.coins,0,15)||!Array.isArray(p.best)||p.best.length!==5||p.best.some(x=>!int(x,0,3))||!p.upgrades||Object.keys(costs).some(k=>!int(p.upgrades[k],0,1)))return false;if(p.best.some((x,i)=>x&&i&&!p.best[i-1])||s.index&&!p.best[s.index-1])return false;if(p.coins!==p.best.reduce((a,b)=>a+b,0)-Object.keys(costs).reduce((a,k)=>a+p.upgrades[k]*costs[k],0))return false;
 if(!int(s.pos,0,35)||c.walls.includes(s.pos)||!int(s.turn,0,c.limit)||!int(s.health,0,8)||!int(s.ink,0,9)||!s.capacity||![7,9].includes(s.capacity.ink)||![6,8].includes(s.capacity.health)||s.capacity.ink>maxInk(o)||s.capacity.health>maxHealth(o)||s.ink>s.capacity.ink||s.health>s.capacity.health||!['active','complete','lost'].includes(s.status)||!['explore','draft'].includes(s.phase)||typeof s.message!=='string'||s.message.length>1000||!int(s.stars,0,3)||!int(s.drafts,0,8))return false;
 for(const [k,allowed]of [['pages',c.pages],['wells',c.wells]])if(!Array.isArray(s[k])||new Set(s[k]).size!==s[k].length||s[k].some(x=>!allowed.includes(x)))return false;
 const arrays=['hand','draw','discard','deck','offers'];if(arrays.some(k=>!Array.isArray(s[k])||s[k].some(x=>!Object.hasOwn(cards,x))))return false;if(s.hand.length!==3||s.deck.length!==baseDeck.length+s.drafts||s.deck.length>14)return false;
 const count=a=>Object.keys(cards).map(k=>a.filter(x=>x===k).length).join(',');if(count(s.deck)!==count([...s.hand,...s.draw,...s.discard])||baseDeck.some(k=>s.deck.filter(x=>x===k).length<baseDeck.filter(x=>x===k).length))return false;
 if(s.drafts>Math.floor(s.turn/4)||s.drafts<Math.floor((s.turn-1)/4))return false;
 if(s.phase==='draft'&&(s.status!=='active'||s.turn%4||s.drafts!==s.turn/4-1||JSON.stringify(s.offers)!==JSON.stringify(offers(s))))return false;if(s.phase==='explore'&&s.offers.length)return false;
 if(s.status==='active'&&(s.health<=0||s.turn>=c.limit||s.pos===EXIT&&s.pages.length>=3||s.stars||s.drafts!==Math.floor(s.turn/4)-(s.phase==='draft'?1:0)))return false;
  if(s.scoring!==undefined&&s.scoring!==1&&s.scoring!==2)return false;
  if(s.status==='complete'&&(s.pos!==EXIT||s.pages.length<3||s.health<=0||s.stars!==1+(s.pages.length===4?1:0)+(s.health>=4&&s.turn<=par(o)?1:0)||p.best[s.index]<s.stars))return false;
 if(s.status==='lost'&&s.health>0&&s.turn<c.limit)return false;
 if(s.status!=='active'&&(s.phase!=='explore'||s.status==='lost'&&s.stars))return false;return true}catch{return false}}
 function encode(o){if(!valid(o))throw Error('Invalid Inkline state');return JSON.stringify(o)}
 function decode(raw){try{if(typeof raw!=='string'||raw.length>32000)return null;const o=JSON.parse(raw);return valid(o)?o:null}catch{return null}}
 return{W,START,EXIT,chapters,cards,costs,baseDeck,clone,create,targets,play,rest,preview,draft,next,retry,upgrade,valid,encode,decode,maxInk,maxHealth,par};
});
