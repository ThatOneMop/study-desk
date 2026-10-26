import {levelOf} from './xp-curve.mjs';
import {validCargo,releaseCargo} from './workshop-logistics.mjs';
export const WORKSHOP_NAMES=Object.freeze(['Room 04','Harbor workshop','Hillside house']);
export function workshopMovePlan(s,to,strainCount){
 const fail=reason=>({ok:false,reason});
 if(![1,2].includes(to)||![0,1,2].includes(s.house)||to<=s.house)return fail('Choose a larger property you do not already own.');
 const cost=to===1?1200:3500,required=to===1?3:5;
 if(!Number.isFinite(s.xp)||s.xp<0||levelOf(s.xp)<required)return fail('This deed needs level '+required+'.');
 if(!Number.isFinite(s.bank)||!Number.isSafeInteger(Math.round(s.bank*100))||s.bank<cost)return fail('This deed needs $'+cost+' in valid bank funds.');
 if(s.police?.search)return fail('Finish the shared police search before moving.');
 if(!Number.isInteger(s.day)||s.day<1||!Number.isFinite(s.time)||s.time<0||s.time>=1440)return fail('The save clock needs to be valid before moving.');
 if(!validCargo(s.crafterCargo,strainCount))return fail('Worker cargo needs a valid save before moving.');
 const cargo=s.crafterCargo?{phase:s.crafterCargo.phase,source:s.crafterCargo.source,index:s.crafterCargo.index,home:s.crafterCargo.home}:null;
 if(cargo){const array=cargo.phase==='input'?s[cargo.source]:s.packs;
  if(!Array.isArray(array)||!Number.isSafeInteger(array[cargo.index])||array[cargo.index]<0||array[cargo.index]>=Number.MAX_SAFE_INTEGER||!Number.isSafeInteger(s.wrappers)||s.wrappers<0||cargo.phase==='input'&&s.wrappers>=Number.MAX_SAFE_INTEGER)return fail('Worker cargo cannot be safely returned to inventory.');
 }
 return {ok:true,from:s.house,to,cost,cargo};
}
export function commitWorkshopMove(s,to,strainCount){
 const plan=workshopMovePlan(s,to,strainCount);if(!plan.ok)return plan;
 // Settle reserved cargo in the same transaction, before any saved/peer state
 // can describe a new home while still carrying an old-home reservation.
 releaseCargo(s);s.bank=Math.round((s.bank-plan.cost)*100)/100;s.house=to;s.room=true;
 s.lastMove={from:plan.from,to,day:s.day,cargo:plan.cargo};
 return plan;
}
export function readWorkshopMove(move,home){
 if(!move||![0,1,2].includes(move.from)||![1,2].includes(move.to)||move.to<=move.from||move.to!==home||!Number.isInteger(move.day)||move.day<1)return null;
 const cargo=move.cargo&&['input','output'].includes(move.cargo.phase)?move.cargo.phase:null;
 return {from:WORKSHOP_NAMES[move.from],to:WORKSHOP_NAMES[move.to],day:move.day,cargo};
}
