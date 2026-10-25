const RULES={call:['payphone'],rent:['reception','property','house','workshop'],job:['reception'],buyTent:['hardware'],buyCan:['hardware'],buyTrimmers:['hardware'],buyPackStation:['hardware'],buyMixer:['hardware'],lights:['hardware'],bench:['hardware'],irrigation:['hardware'],seed:['dealer'],soil:['dealer'],wrappers:['store'],lemonade:['store'],ingredient:['servo'],fill:['sink'],make:['craft'],pack:['craft'],mix:['mix'],hire:['helpers'],worker:['helpers','staffboard'],staffAssign:['helpers','staffboard'],house:['property','house','workshop'],deposit:['laundry'],withdraw:['laundry'],front:['laundry'],sleep:['bed'],atmDeposit:['atm'],atmWithdraw:['atm'],recycle:['recycler'],stash:['stockroom'],unstash:['stockroom'],install:['tent'],prepare:['tent'],plant:['tent'],water:['tent'],harvest:['tent'],buyVehicle:['garage'],buyFleet:['garage'],selectFleet:['garage']};
for(const types of Object.values(RULES))Object.freeze(types);Object.freeze(RULES);
export const physicalPointTypes=new Set(Object.values(RULES).flat());
export function actionPointTypes(kind,arg){return kind==='batch'?arg?.kind==='mix'?RULES.mix:['make','pack'].includes(arg?.kind)?RULES.make:[]:Object.hasOwn(RULES,kind)?RULES[kind]:null;}
export function actionPointMatches(point,kind,arg){const types=actionPointTypes(kind,arg);return !!types?.includes(point.type)&&(point.type!=='tent'||Number.isInteger(arg)&&point.i===arg);}
// Points are authored on the usable side of counters/equipment, not at the
// vendor's body or inside the model. Never route around an obstacle or teleport.
export function pointApproach(actor,point,blocked,floorHeight=()=>0,range=5){
 if(!actor||!point||![actor.x,actor.y,actor.z,point.x,point.z,range].every(Number.isFinite)||range<0||range>5)return false;
 const distance=Math.hypot(actor.x-point.x,actor.z-point.z),ground=floorHeight(point.x,point.z);
 if(distance>range||!Number.isFinite(ground)||Math.abs(actor.y-ground-1.72)>.9)return false;
 const steps=Math.max(1,Math.ceil(distance/.1));
 for(let i=0;i<=steps;i++)if(blocked(actor.x+(point.x-actor.x)*i/steps,actor.z+(point.z-actor.z)*i/steps))return false;
 return true;
}
