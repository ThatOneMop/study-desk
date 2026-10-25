import {orderOverview} from './resident-life.mjs?v=25';
// Original voices; these describe an offer without changing its economics.
const VOICES=[
 {role:'Late-shift regular',first:'Long shift ahead. What have you got?',returning:'Back for another sweet break. Good to see you.',waiting:'There you are. A quick handover before my shift?',counter:'That is a bit much for a work break. I could do',agree:'A sweet break sorted.',thanks:'That will get me through the late shift.'},
 {role:'Careful bargain hunter',first:'Just looking today. Unless the price is right.',returning:'Hey again. Still keeping an eye on my budget.',waiting:'Got the exact order? I have set the money aside.',counter:'I have to stick to my budget. I could do',agree:'That fits my budget.',thanks:'Good stuff. And I still have some money left.'},
 {role:'Flavour-minded gardener',first:'Good ingredients matter. Tell me what you are making.',returning:'Hello again. What flavours have you been working on?',waiting:'Ready to try that batch we agreed on.',counter:'I like the idea, but not that price. I could do',agree:'Good flavour, fair price.',thanks:'I will take my time with these. Flavour deserves it.'},
 {role:'Curious premium buyer',first:'Show me something a little different.',returning:'You again! Got another interesting batch?',waiting:'I have been looking forward to trying this one.',counter:'Interesting, but I still have a limit. I could do',agree:'All right. Let us try something different.',thanks:'Now that is a much more interesting afternoon.'},
 {role:'Waterfront walker',first:'Taking the long way home. No rush.',returning:'Nice to see a familiar face on the walk.',waiting:'One quick stop, then back to the waterfront.',counter:'Saving a little for the walk home. I could do',agree:'A little treat for the way home.',thanks:'Perfect. Back to the sea air for me.'}
];
export const customerVoice=index=>VOICES[index]||VOICES[0];
export function customerReply(index,event,amount,qty){
 const v=customerVoice(index);
 if(event==='counter')return v.counter+' $'+amount+' each. What do you think?';
 if(event==='agree')return v.agree+' $'+amount+' each for '+qty+'. Meet me where I am marked on your map.';
 return v.thanks+' $'+amount+', as agreed. Text me when you have more.';
}
export function readCustomerReceipt(thread,strainCount){
 const r=thread?.lastSale;
 if(!r||!Number.isSafeInteger(r.t)||r.t<0||r.t>=strainCount||!Number.isSafeInteger(r.qty)||r.qty<1||r.qty>40||!Number.isSafeInteger(r.total)||r.total<1||!Number.isSafeInteger(r.day)||r.day<1||!Number.isFinite(r.time)||r.time<0||r.time>=1440)return null;
 return {t:r.t,qty:r.qty,total:r.total,day:r.day,time:r.time};
}
export function customerBrief(state,index,strainCount){
 const receipt=readCustomerReceipt(state.threads?.[index],strainCount);
 const order=orderOverview(state).find(d=>d.npc===index)||null,v=customerVoice(index);
 return {receipt,order,role:v.role,greeting:order?v.waiting:receipt?v.returning:v.first};
}
export function sampleChoices(state,index,baseCount=6,ingredientCount=4){
 return (state.packs||[]).flatMap((n,t)=>{
  const promised=(state.deals||[]).filter(d=>d.t===t).reduce((sum,d)=>sum+d.qty,0),free=Math.max(0,n-promised);
  return free>0?[{t,free,favourite:t>=baseCount&&(t-baseCount)%ingredientCount===index%ingredientCount}]:[];
 }).sort((a,b)=>Number(b.favourite)-Number(a.favourite)||a.t-b.t);
}
