const entries={
 reception:{title:'Palm Court',first:'The desk clerk gives you the lay of the land.',returning:'The desk clerk recognises you and asks how the business is going.',types:['reception']},
 hardware:{title:"Hank's Hardware",first:'Hank points out the reusable kit and keeps the sales pitch practical.',returning:'Hank remembers your setup and asks what you are improving next.',types:['hardware']},
 dealer:{title:"Milo's Seeds",first:'Milo talks you through the first crop like it matters.',returning:'Milo remembers your last visit and asks what is growing now.',types:['dealer']},
 store:{title:'Corner Store',first:'The cashier shows you the small shelf of useful supplies.',returning:'The cashier has your usual supply shelf ready.',types:['store']},
 helpers:{title:'Helping Hand',first:'The crew explains who can help and what stock they need.',returning:'The crew remembers your workshop and checks what still needs doing.',types:['helpers','staffboard']},
 property:{title:'Cedar Bay Lettings',first:'The agent unfolds a map of the town properties.',returning:'The agent remembers your current workshop and opens the next folder.',types:['property','house','workshop']},
 laundry:{title:'Suds & Sunshine',first:'The bookkeeper explains the deposit ledger one line at a time.',returning:'The bookkeeper pulls up your familiar ledger.',types:['laundry']},
 garage:{title:'Harbor Motors',first:'The mechanic walks you around the delivery van.',returning:'The mechanic remembers the van and asks how it is handling.',types:['garage']},
 pier:{title:'Driftwood Pier',first:'The boards creak under a wide view of Gummy Bay.',returning:'The pier feels familiar now; the tide has changed since last time.',types:['pier']}
};

export const LOCATION_MEMORY=Object.freeze(Object.fromEntries(Object.entries(entries).map(([key,value])=>[key,Object.freeze({...value,types:Object.freeze([...value.types])})])));
const typeKeys=Object.freeze(Object.fromEntries(Object.entries(LOCATION_MEMORY).flatMap(([key,value])=>value.types.map(type=>[type,key]))));
const validClock=(day,time)=>Number.isSafeInteger(day)&&day>=1&&Number.isFinite(time)&&time>=0&&time<1440;
const validRecord=record=>record&&typeof record==='object'&&!Array.isArray(record)&&Number.isSafeInteger(record.count)&&record.count>=1&&record.count<=9999&&validClock(record.lastDay,record.lastTime);

export function locationKeyForType(type){return typeof type==='string'&&Object.hasOwn(typeKeys,type)?typeKeys[type]:null;}
export function readLocationVisit(visits,key){
 const record=visits&&typeof visits==='object'&&!Array.isArray(visits)&&Object.hasOwn(LOCATION_MEMORY,key)?visits[key]:null;
 return validRecord(record)?{count:record.count,lastDay:record.lastDay,lastTime:record.lastTime}:{count:0,lastDay:null,lastTime:null};
}
export function normalizeLocationVisits(visits){
 const clean={};if(!visits||typeof visits!=='object'||Array.isArray(visits))return clean;
 for(const key of Object.keys(LOCATION_MEMORY)){const record=visits[key];if(validRecord(record))clean[key]={count:record.count,lastDay:record.lastDay,lastTime:record.lastTime};}
 return clean;
}
export function recordLocationVisit(visits,key,day,time,minGap=10){
 if(!visits||typeof visits!=='object'||Array.isArray(visits)||!Object.hasOwn(LOCATION_MEMORY,key)||!validClock(day,time)||!Number.isFinite(minGap)||minGap<0)return {changed:false,record:readLocationVisit(visits,key)};
 const previous=readLocationVisit(visits,key),elapsed=previous.count?(day-previous.lastDay)*1440+(time-previous.lastTime):Infinity;
 if(previous.count&&elapsed<Math.max(0,minGap))return {changed:false,record:previous};
 const record={count:Math.min(9999,previous.count+1),lastDay:day,lastTime:time};visits[key]=record;return {changed:true,record:{...record}};
}
export function locationMemoryCopy(visits,key){
 const place=LOCATION_MEMORY[key],record=readLocationVisit(visits,key);if(!place)return null;
 const minute=record.count?Math.floor(record.lastTime):0,hour=Math.floor(minute/60),clock=String(hour).padStart(2,'0')+':'+String(minute%60).padStart(2,'0');
 return Object.freeze({title:place.title,greeting:record.count>1?place.returning:place.first,count:record.count,detail:record.count?`Visit ${record.count} · last here Day ${record.lastDay} at ${clock}`:'No visit recorded yet'});
}
