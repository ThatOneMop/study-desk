const STAGES=Object.freeze([
 Object.freeze({key:'rv',name:'Old RV start',spaces:0,stock:0,storage:0}),
 Object.freeze({key:'room',name:'Room 04 workshop',spaces:2,stock:64,storage:40}),
 Object.freeze({key:'harbor',name:'Harbor workshop',spaces:4,stock:256,storage:160}),
 Object.freeze({key:'hillside',name:'Hillside house',spaces:8,stock:640,storage:400})
]);
const finite=value=>Number.isFinite(value)?Math.max(0,Math.floor(value)):0;
const helperCount=helpers=>helpers&&typeof helpers==='object'?['gardener','crafter','seller'].filter(key=>Object.hasOwn(helpers,key)&&helpers[key]===true).length:0;

export function businessPortrait(state){
 const s=state&&typeof state==='object'?state:{},home=Math.min(2,finite(s.house));
 const stage=!s.room&&home===0?0:home+1,current=STAGES[stage],level=Math.min(8,1+Math.floor(finite(s.xp)/30));
 const installed=new Set(Array.isArray(s.installed)?s.installed.filter(index=>Number.isInteger(index)&&index>=0&&index<current.spaces):[]).size;
 const crew=helperCount(s.helpers),equipment=[s.can,s.trimmers,s.packStation,s.mixer,s.vehicleOwned,s.irrigation].filter(Boolean).length;
 let next;
 if(stage===0)next='Rent Room 04 to turn shelter into a first workshop.';
 else if(stage===1)next=level<3?'Reach level 3 for the Harbor workshop deed.':finite(s.bank)<1200?'Build $1,200 in bank funds for the Harbor workshop.':'The Harbor workshop deed is ready at Cedar Bay Lettings.';
 else if(stage===2)next=level<5?'Reach level 5 for the Hillside house deed.':finite(s.bank)<3500?'Build $3,500 in bank funds for the Hillside house.':'The Hillside house deed is ready at Cedar Bay Lettings.';
 else if(crew<3)next='Hire '+(3-crew)+' more '+(crew===2?'helper':'helpers')+' to complete the three-role crew.';
 else next='Full property ladder and three-role crew complete.';
 const stages=STAGES.map((item,index)=>Object.freeze({...item,status:index<stage?'past':index===stage?'current':index===stage+1?'next':'future'}));
 return Object.freeze({stage,current,stages:Object.freeze(stages),level,installed,ownedTents:finite(s.tents),crew,equipment,sold:finite(s.sold),earned:Number.isFinite(s.earned)?Math.max(0,s.earned):0,next});
}

export function progressionSummary(portrait){
 if(!portrait||!portrait.current)return '';
 return portrait.current.name+' · '+portrait.installed+'/'+portrait.current.spaces+' grow spaces installed · '+portrait.crew+'/3 crew · '+portrait.sold+' sold';
}

export {STAGES as BUSINESS_STAGES};
