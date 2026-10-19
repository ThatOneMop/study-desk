/* Spore Kitchen — original turn-based growing/cooking game. No external assets. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SporeKitchen=factory()})(globalThis,()=>{
'use strict';
const species=[
 {id:'button',name:'Velvet Button',color:'#e0b68b',traits:[2,0,0],grow:2,note:'Earthy and quick'},
 {id:'lantern',name:'Moon Lantern',color:'#b3cc74',traits:[0,2,0],grow:3,note:'Bright and slow'},
 {id:'ember',name:'Ember Cap',color:'#ee895f',traits:[0,0,2],grow:3,note:'Warm and peppery'},
 {id:'oyster',name:'Cloud Oyster',color:'#a8bbdd',traits:[1,1,0],grow:2,note:'Earth meets brightness'}
];
const methods=[{id:'fresh',name:'Fresh',add:[0,0,0]},{id:'broth',name:'Broth',add:[0,1,0]},{id:'roast',name:'Roast',add:[1,0,1]}];
const services=[
 {name:'The first lantern',story:'Three neighbours have found your tiny woodland kitchen.',budget:30,orders:[['Moss toast',[4,0,0]],['Firefly broth',[2,3,0]],['Warm welcome',[3,0,3]]]},
 {name:'Rain at the window',story:'The walking club arrives with muddy boots and bright appetites.',budget:28,orders:[['Moon soup',[0,5,0]],['Pepper parcel',[1,0,5]],['Cloud salad',[2,2,0]]]},
 {name:'The foragers’ table',story:'Foragers trade stories while you turn their favourite flavours into supper.',budget:27,orders:[['Woodland stew',[3,2,0]],['Ember clouds',[2,1,3]],['Lantern pickle',[1,3,0]]]},
 {name:'Market evening',story:'Your chalkboard menu is the talk of the village market.',budget:26,orders:[['Smoky moon',[1,2,3]],['Cloud roast',[3,2,1]],['Quiet comfort',[4,1,0]]]},
 {name:'Under a full moon',story:'One last table, lit by fireflies. Make a meal worth remembering.',budget:26,orders:[['Festival broth',[0,3,2]],['Golden forest',[4,1,1]],['Double moon',[0,4,0]]]}
];
const copy=x=>JSON.parse(JSON.stringify(x));
const blankProfile=()=>({coins:0,upgrades:{beds:0,basket:0,mist:0},best:[0,0,0,0,0]});
const limits=p=>({beds:6+2*p.upgrades.beds,tray:8+2*p.upgrades.basket});
const isInt=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
function start(index=0,p=blankProfile()){
 return {service:index,turn:0,status:'growing',beds:Array(limits(p).beds).fill(null),tray:[0,0,1,2],served:[0,0,0],earnings:0,checkpoint:copy(p),message:'Pick a seed, then an empty bed. Every garden action grows the other mushrooms.'};
}
const create=()=>{const profile=blankProfile();return {profile,kitchen:start(0,profile)}};
function flavour(items,method){if(!Array.isArray(items)||items.length!==2||items.some(n=>!isInt(n,0,3))||!isInt(method,0,2))return null;return methods[method].add.map((n,i)=>n+items.reduce((s,id)=>s+species[id].traits[i],0))}
function preview(s,indices,method,order){if(!Array.isArray(indices)||indices.length!==2||new Set(indices).size!==2||indices.some(i=>!isInt(i,0,s.tray.length-1))||!isInt(order,0,2))return null;const traits=flavour(indices.map(i=>s.tray[i]),method);if(!traits)return null;const target=services[s.service].orders[order][1],distance=target.reduce((n,t,i)=>n+Math.abs(t-traits[i]),0);return{traits,target,distance,stars:distance===0?3:distance<=2?2:1}}
function tick(s,p){s.turn++;s.beds.forEach(b=>{if(b)b.age=Math.min(species[b.kind].grow-p.upgrades.mist,b.age+1)});if(s.served.every(Boolean)){
 const stars=s.served.reduce((a,b)=>a+b,0);s.status=stars>=7?'complete':'failed';
 if(s.status==='complete'){p.coins+=s.earnings;p.best[s.service]=Math.max(p.best[s.service],stars);s.message=`Service complete: ${stars}/9 stars! ${s.earnings} coins banked. ${s.service===4?'Your woodland kitchen has earned its place.':'Choose an upgrade, then open the next service.'}`}
 else s.message=`${stars}/9 stars. The table needs at least 7. Retry freely; preview dishes to find better matches.`;
 }else if(s.turn>=services[s.service].budget){s.status='failed';s.message='The table has closed. Retry freely: your pre-service coins and upgrades are safe.'}}
function act(s,p,a){if(s.status!=='growing'||!a)return false;const l=limits(p);
 if(a.type==='plant'){
  if(!isInt(a.bed,0,l.beds-1)||!isInt(a.kind,0,3)||s.beds[a.bed])return false;
  s.beds[a.bed]={kind:a.kind,age:-1};s.message=`Planted ${species[a.kind].name}.`;
 }else if(a.type==='harvest'){
  const b=s.beds[a.bed];if(!isInt(a.bed,0,l.beds-1)||!b||b.age<species[b.kind].grow-p.upgrades.mist)return false;
  if(s.tray.length>=l.tray){s.message='Basket full. Cook a dish or compost an ingredient first.';return false}
  s.tray.push(b.kind);s.beds[a.bed]=null;s.message=`Harvested ${species[b.kind].name}.`;
 }else if(a.type==='tend'){
  const b=s.beds[a.bed];if(!isInt(a.bed,0,l.beds-1)||!b||b.age>=species[b.kind].grow-p.upgrades.mist)return false;
  b.age++;s.message='Misted the bed. This mushroom grows an extra step.';
 }else if(a.type==='cook'){
  const result=preview(s,a.items,a.method,a.order);if(!result||s.served[a.order])return false;
  s.tray=s.tray.filter((_,i)=>!a.items.includes(i));s.served[a.order]=result.stars;s.earnings+=6+4*result.stars;
  s.message=`${services[s.service].orders[a.order][0]} served: ${result.stars} stars. ${result.distance===0?'A perfect flavour match!':'Check the flavour preview for a closer match.'}`;
 }else if(a.type==='compost'){
  if(!isInt(a.item,0,s.tray.length-1))return false;s.tray.splice(a.item,1);s.message='Ingredient composted. Seeds are always free.';
 }else if(a.type==='wait'){s.message='A quiet moment. Every planted mushroom grows one step.'}
 else return false;
 tick(s,p);return true;
}
function retry(o){o.profile=copy(o.kitchen.checkpoint);o.kitchen=start(o.kitchen.service,o.profile)}
const costs={beds:20,basket:18,mist:24};
function upgrade(o,key){const p=o.profile,s=o.kitchen;if(s.status!=='complete'||!Object.hasOwn(costs,key)||p.upgrades[key]||p.coins<costs[key])return false;p.coins-=costs[key];p.upgrades[key]=1;s.message='Kitchen upgraded. It will be ready for the next service.';return true}
function next(o){if(o.kitchen.status!=='complete'||o.kitchen.service===4)return false;o.kitchen=start(o.kitchen.service+1,o.profile);return true}
const encode=o=>JSON.stringify({version:1,...o});
function validProfile(p){return !!p&&isInt(p.coins,0,1e6)&&p.upgrades&&['beds','basket','mist'].every(k=>isInt(p.upgrades[k],0,1))&&Array.isArray(p.best)&&p.best.length===5&&p.best.every(n=>isInt(n,0,9))}
function decode(raw){try{
 if(typeof raw!=='string'||raw.length>30000)return null;const o=JSON.parse(raw),p=o.profile,s=o.kitchen;
 if(o.version!==1||!validProfile(p)||!s||!validProfile(s.checkpoint)||!isInt(s.service,0,4)||!isInt(s.turn,0,services[s.service].budget)||!['growing','complete','failed'].includes(s.status))return null;
 const l=limits(s.checkpoint);if(!Array.isArray(s.beds)||s.beds.length!==l.beds||s.beds.some(b=>b!==null&&(!isInt(b.kind,0,3)||!isInt(b.age,0,species[b.kind].grow-s.checkpoint.upgrades.mist))))return null;
 if(!Array.isArray(s.tray)||s.tray.length>l.tray||s.tray.some(n=>!isInt(n,0,3))||!Array.isArray(s.served)||s.served.length!==3||s.served.some(n=>!isInt(n,0,3)))return null;
 const earnings=s.served.reduce((n,x)=>n+(x?6+4*x:0),0),all=s.served.every(Boolean),stars=s.served.reduce((a,b)=>a+b,0);
 if(s.earnings!==earnings||s.status==='complete'&&(!all||stars<7)||s.status==='growing'&&(all||s.turn===services[s.service].budget)||s.status==='failed'&&!(s.turn===services[s.service].budget||all&&stars<7))return null;
 if(s.status!=='complete'&&JSON.stringify(p)!==JSON.stringify(s.checkpoint))return null;
 return {profile:copy(p),kitchen:{...copy(s),message:'Kitchen restored. Your beds, basket and table are just as you left them.'}};
 }catch{return null}}
return {species,methods,services,copy,blankProfile,limits,start,create,flavour,preview,act,retry,costs,upgrade,next,encode,decode};
});
