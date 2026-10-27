// v157: Gummy Bay's customer book, Schedule I-style. Fourteen original locals, each with
// preferred effects, a weekly spend range and a quality standard. The first five are known
// from the start. The rest unlock when a friend vouches for you and you hand them a sample.
// v173 adds the town cast, sampling reactions and district gates beside this book.
// All deal maths is delegated to sim-formulas.mjs.
export {TOWN_CUSTOMERS,CUSTOMER_LOOKS,lookSignature} from './customer-cast.mjs';
export {createCustomerCrowd,customerLook} from './customer-crowd.mjs';
export {AREA_GATES,areaById,areaOpen,bestBatchQuality,gearRows,areaHow,gateText,progressModel,progressHTML} from './progression-book.mjs';
export {levelOf,levelProgress,rankTitle,migrateXp} from './xp-curve.mjs';
import {QUALITY,STANDARDS,ENJOYMENT_WEIGHTS,appeal,judgeCounter,sampleScore,sampleAcceptance,
 weeklyBudget,weeklyOrders,dealPay,QUICK_DEAL_MINUTES} from './sim-formulas.mjs';

export const STARTER_CUSTOMERS=5;
const P=(effects,spend,standard,knows,role)=>Object.freeze({effects:Object.freeze(effects),spend:Object.freeze(spend),standard,knows:Object.freeze(knows),role});
// Profiles for the five original contacts (Jules, Benji, Nina, Oz, Frankie).
export const STARTER_PROFILES=Object.freeze([
 P(['sunny','hearty'],[90,220],'low',[5,1],'Night-shift nurse'),
 P(['breezy','still'],[60,160],'veryLow',[6,0],'Bike courier'),
 P(['zippy','keen'],[110,260],'moderate',[9,3],'Bookshop clerk'),
 P(['quiet','luminous'],[160,420],'high',[11,2],'Gadget collector'),
 P(['zesty','buoyant'],[90,240],'low',[7,0],'Pier fisher')
]);
const C=(name,x,z,color,skin,budget,line,profile)=>Object.freeze({name,x,z,color,skin,budget,line,...profile});
export const NEW_CUSTOMERS=Object.freeze([
 C('Marlowe',-40,-9.6,0xd09a5c,0xd7a57e,1.1,'The ovens start at four. Something sweet keeps me going.',P(['sunny','smooth','hearty'],[120,300],'moderate',[0,6],'Bakery early shift')),
 C('Pip',40,9.6,0x6fa0c8,0xe3b894,.96,'Fast and cheap. That is my whole budget plan.',P(['zippy','brisk','spry'],[70,180],'veryLow',[1,5],'Scooter courier')),
 C('Rosa',8.6,55,0xc96f7d,0xb98763,1.15,'Fresh from the boats every morning. I like things just as fresh.',P(['breezy','bright','buoyant'],[150,380],'moderate',[4,8],'Fish market stall')),
 C('Theo',-8.6,62,0xe0c25c,0xc89670,1.18,'Long days on the tower. Calm is worth paying for.',P(['quiet','still','luminous'],[110,280],'high',[7,10],'Beach lifeguard')),
 C('Ivy',-60,-9.6,0x8a9b6e,0xe5bf9c,1.2,'Quiet please. Unless you have something interesting.',P(['curious','keen','quiet'],[140,340],'high',[2,10],'Town librarian')),
 C('Gus',-8.6,-50,0xa3765a,0xc08a62,1.25,'I tow cars all night. Give me something with a kick.',P(['hearty','thunder','zesty'],[180,450],'moderate',[8,9],'Tow-truck driver')),
 C('Wren',62,-9.6,0xb48ac7,0xe7c3a2,1.22,'If it looks lovely and tastes lovelier, I am in.',P(['sunny','breezy','luminous'],[160,400],'high',[3,12],'Flower shop owner')),
 C('Dot',8.6,-45,0x6f8fa0,0xd3a07c,1.35,'Sailed every sea there is. Only the best gets my coin.',P(['still','smooth','hazy'],[220,520],'veryHigh',[11,13],'Retired sailor')),
 C('Rocco',62,9.6,0xd86f4f,0xb77d58,1.3,'Food truck life. I know good flavour when I taste it.',P(['zesty','peppery','sparking'],[220,600],'high',[12,6],'Food-truck chef'))
]);
export const STANDARD_LABEL=Object.freeze({veryLow:'Very low',low:'Low',moderate:'Moderate',high:'High',veryHigh:'Very high'});
const clamp=(v,a,b)=>Math.min(b,Math.max(a,Number.isFinite(v)?v:a));

export function isUnlocked(state,i){return i<STARTER_CUSTOMERS||state?.unlocked?.[i]===true;}
export function vouchers(state,contacts,i){
 const me=contacts[i];if(!me)return [];
 return contacts.map((c,j)=>j).filter(j=>j!==i&&isUnlocked(state,j)&&((contacts[j].knows||[]).includes(i)||(me.knows||[]).includes(j)));
}
export function canSample(state,contacts,i){return isUnlocked(state,i)||vouchers(state,contacts,i).length>0;}
// People a successful sample introduces, one hop. Town locals list `introduces`;
// the original book uses `knows`. Callers must not walk those contacts again.
export function introductions(contact){
 const raw=Array.isArray(contact?.introduces)?contact.introduces:Array.isArray(contact?.knows)?contact.knows:[];
 return raw.filter(i=>Number.isInteger(i)&&i>=0);
}
// A town local can be approached when their level or district gate is open.
// The original fourteen have no gate, so a district opening does not skip their vouch chain.
export function canApproach(contact,ctx){
 if(ctx?.unlocked||ctx?.vouched)return true;
 const g=contact?.gate;if(!g)return false;
 const level=ctx?.level||1,quality=ctx?.quality||0;
 if(g.kind==='level')return level>=g.level&&!(g.quality>0&&quality<g.quality);
 if(g.kind==='district')return !!ctx?.areaOpen?.(g.area);
 if(g.kind==='both')return level>=(g.level||1)&&!(g.quality>0&&quality<g.quality)&&(!g.area||!!ctx?.areaOpen?.(g.area));
 return false;
}
// How a free sample lands, from enjoyment (quality against their taste).
export function sampleVerdict(contact,{enjoyment=0}={}){
 const name=contact?.name||'They';
 const taste=(contact?.effects||[]).slice(0,2).join(' and ')||'something sweet';
 const e=clamp(enjoyment,0,1);
 if(e>=.72)return Object.freeze({accept:true,tone:'delighted',text:name+' lights up. "That is exactly my kind of '+taste+'."'});
 if(e>=.5)return Object.freeze({accept:true,tone:'warming',text:name+' nods. "I could go for more of that '+taste+'."'});
 if(e>=.34)return Object.freeze({accept:false,tone:'unsure',text:name+' shrugs. "Not really my '+taste+'. Maybe another batch."'});
 return Object.freeze({accept:false,tone:'polite',text:name+' hands it back. "Kind of you. I will wait for something closer to '+taste+'."'});
}
// Enjoyment 0..1 from sim ENJOYMENT_WEIGHTS: affinity (mixes vs plain), effect matches, quality vs standard.
export function enjoymentOf(contact,{effects=[],mixed=false,quality=1}={}){
 const want=contact?.effects||[];
 const hits=want.filter(e=>effects.includes(e)).length;
 const eff=want.length?clamp(hits/Math.min(2,want.length),0,1):0;
 const need=QUALITY[STANDARDS[contact?.standard]||'standard']??.5;
 const q=clamp(quality,0,1);
 const qual=clamp(.5+(q-need)*1.5,0,1);
 const aff=mixed?.75:.45;
 return clamp(ENJOYMENT_WEIGHTS.affinity*aff+ENJOYMENT_WEIGHTS.effects*eff+ENJOYMENT_WEIGHTS.quality*qual,0,1);
}
export function matchedEffects(contact,effects=[]){return (contact?.effects||[]).filter(e=>effects.includes(e));}
// Highest per-gummy price they will agree to without haggling.
export function fairPrice(market,budget,enjoyment){return Math.max(1,Math.round(market*(budget||1)*(.8+.5*clamp(enjoyment,0,1))));}
export function appealOf(enjoyment,price,fair){return appeal(enjoyment,price,fair);}
export function rankByAppeal(rows){return rows.slice().sort((a,b)=>b.appeal-a.appeal||a.index-b.index);}
const drive=(loyalty,craving)=>({loyalty:clamp(loyalty,0,100)/20,craving:clamp(craving,0,100)/100});
// Chance (0..100) they accept a per-gummy price above their fair price. Enjoyment already lifts
// the fair price, so the counter roll uses a neutral .5 and lets loyalty/craving drive the odds.
export function haggleChance({price,fair,qty=1,enjoyment=.5,relation=0,craving=0,spend=[100,250]}){
 if(!(price>0)||!(fair>0))return 0;
 if(price<=fair)return 100;
 const d=drive(relation,craving);
 const weekly=weeklyBudget(spend[0],spend[1],d.loyalty,1),orders=weeklyOrders(1,4,d.craving,d.loyalty);
 const r=judgeCounter({market:fair,originalQty:1,originalTotal:fair,nextQty:1,nextTotal:price,enjoyment:.5,weekly,orders,craving:d.craving,loyalty:d.loyalty,roll:1});
 return Math.round(r.chance*100);
}
// Chance (0..100) a locked customer accepts a sample and joins your contacts.
export function sampleChance({enjoyment=.5,relation=0,craving=0,friendRelation=0}){
 const d=drive(relation,craving);
 return Math.round(sampleAcceptance(sampleScore(enjoyment,d.loyalty,d.craving,clamp(friendRelation,0,100)/20))*100);
}
// Live delivery bonuses (curfew +20%, rain +20%, quick +10%) through sim dealPay.
export function dealBonus({curfew=false,rain=false,agreedAt=null,now=0}={}){
 const left=Number.isFinite(agreedAt)?QUICK_DEAL_MINUTES-(now-agreedAt):-1;
 const quick=left>0;
 const mult=dealPay(1,{curfew,rain,quick});
 const labels=[];if(curfew)labels.push('Curfew +20%');if(rain)labels.push('Rain +20%');if(quick)labels.push('Quick +10% · '+Math.ceil(left)+' min left');
 return Object.freeze({curfew,rain,quick,quickLeft:Math.max(0,Math.ceil(left)),mult,labels:Object.freeze(labels)});
}
