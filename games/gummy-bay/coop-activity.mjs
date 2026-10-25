export const COOP_ACTIVITY_LIMIT=8;

const ACTIONS=Object.freeze({
 call:'called home',rent:'rented the first workshop',buyTent:'bought a grow tent',buyCan:'bought a watering can',buyTrimmers:'bought trimmers',buyPackStation:'installed the packing station',soil:'bought soil',seed:'bought seeds',wrappers:'bought wrappers',ingredient:'bought a mixing ingredient',buyMixer:'bought the gummy mixer',install:'assembled a grow tent',prepare:'prepared a grow bed',plant:'planted a crop',fill:'filled the watering can',water:'watered a crop',harvest:'harvested a crop',make:'made gummies',pack:'packed gummies',mix:'mixed a gummy flavour',batch:'finished a workshop batch',list:'created a listing',text:'messaged customers',offer:'answered a customer',deliver:'completed a delivery',sample:'shared a sample',stash:'stored finished packs',unstash:'collected stored packs',worker:'changed a crew assignment',staffAssign:'updated the crew plan',hire:'hired a helper',lights:'installed grow lights',bench:'upgraded the workbench',irrigation:'installed irrigation',house:'moved the workshop',buyVehicle:'bought the delivery van',recycle:'recycled town litter',deposit:'made a bank deposit',withdraw:'made a bank withdrawal',atmDeposit:'made an ATM deposit',atmWithdraw:'made an ATM withdrawal',sleep:'started a new day',job:'completed a town job',front:'expanded the business front'
});
const ITEM_ACTIONS=new Set(['seed','ingredient','plant','harvest','make','pack','mix','list','offer','deliver','sample','stash','unstash','batch']);
const sum=value=>Array.isArray(value)?value.reduce((total,n)=>total+(Number.isFinite(n)?n:0),0):0;
const number=value=>Number.isFinite(value)?value:0;

export function activitySnapshot(state){
 const s=state&&typeof state==='object'?state:{};
 const view={
  cash:number(s.cash),bank:number(s.bank),day:number(s.day),xp:number(s.xp),called:number(s.called),room:!!s.room,house:number(s.house),tents:number(s.tents),soil:number(s.soil),wrappers:number(s.wrappers),can:!!s.can,water:number(s.water),lights:number(s.lights),bench:number(s.bench),irrigation:!!s.irrigation,packStation:!!s.packStation,trimmers:!!s.trimmers,mixer:!!s.mixer,vehicleOwned:!!s.vehicleOwned,hired:number(s.hired),planted:number(s.planted),watered:number(s.watered),harvested:number(s.harvested),made:number(s.made),listed:number(s.listed),texted:number(s.texted),sold:number(s.sold),earned:number(s.earned),mixed:number(s.mixed),trash:number(s.trash),trashEarned:number(s.trashEarned),laundered:number(s.laundered),front:!!s.front,
  seeds:sum(s.seeds),raw:sum(s.raw),gummies:sum(s.gummies),packs:sum(s.packs),storedPacks:sum(s.storedPacks),ingredients:sum(s.ingredients),deals:Array.isArray(s.deals)?s.deals.length:0,ledger:Array.isArray(s.ledger)?s.ledger.length:0,installed:Array.isArray(s.installed)?s.installed.length:0,
  helpers:JSON.stringify(s.helpers??{}),workers:JSON.stringify(s.workerEnabled??{}),staff:JSON.stringify(s.staffConfig??{}),listing:JSON.stringify(s.listing??null),plants:JSON.stringify(Array.isArray(s.plants)?s.plants.map(p=>[p?.type,p?.phase,p?.watered,p?.end]):[])
 };
 return Object.freeze(view);
}

function delta(before,after,key){return Math.max(1,Math.round(Math.abs(number(after[key])-number(before[key]))));}
function eventAmount(action,before,after){
 const field={plant:'planted',water:'watered',harvest:'harvested',make:'made',pack:'packs',mix:'mixed',deliver:'sold',recycle:'trashEarned',deposit:'bank',withdraw:'bank',atmDeposit:'bank',atmWithdraw:'bank',sleep:'day'}[action];
 return field?Math.min(999,delta(before,after,field)):1;
}

export function deriveCoopActivity(action,args,before,after,actor,at,sequence){
 if(!Object.hasOwn(ACTIONS,action)||!before||!after||JSON.stringify(before)===JSON.stringify(after))return null;
 if(!['Host','Partner'].includes(actor)||!Number.isFinite(at)||at<0||!Number.isSafeInteger(sequence)||sequence<1)return null;
 const raw=Array.isArray(args)?args[0]:undefined,item=ITEM_ACTIONS.has(action)&&Number.isInteger(raw)&&raw>=0&&raw<=63?raw:null;
 return Object.freeze({sequence,at,actor,key:action,item,amount:eventAmount(action,before,after)});
}

export function acceptCoopActivity(message,lastSequence=0){
 const event=message?.event;
 if(message?.type!=='activity'||!event||!Number.isSafeInteger(event.sequence)||event.sequence<=lastSequence)return Object.freeze({ok:false,reason:'sequence'});
 if(!Number.isFinite(event.at)||event.at<0||!['Host','Partner'].includes(event.actor)||!Object.hasOwn(ACTIONS,event.key))return Object.freeze({ok:false,reason:'shape'});
 if(!(event.item===null||Number.isInteger(event.item)&&event.item>=0&&event.item<=63)||!Number.isSafeInteger(event.amount)||event.amount<1||event.amount>999)return Object.freeze({ok:false,reason:'shape'});
 const accepted=Object.freeze({sequence:event.sequence,at:event.at,actor:event.actor,key:event.key,item:event.item,amount:event.amount});
 return Object.freeze({ok:true,sequence:accepted.sequence,event:accepted});
}

export function appendCoopActivity(events,event,limit=COOP_ACTIVITY_LIMIT){
 if(!Array.isArray(events)||!event||!Number.isSafeInteger(limit)||limit<1)return Object.freeze([]);
 return Object.freeze([...events,event].slice(-limit));
}

export function coopActivityLine(event,names=[]){
 if(!event||!Object.hasOwn(ACTIONS,event.key))return '';
 const product=event.item!==null&&typeof names[event.item]==='string'?' · '+names[event.item]:'';
 const amount=event.amount>1?' ×'+event.amount:'';
 return event.actor+' '+ACTIONS[event.key]+product+amount;
}
