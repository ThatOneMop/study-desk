// Ephemeral presentation receipts, never inventory, rewards or save metadata.
export const EXCHANGE_GESTURE_MS=840;
export function readExchangeReceipt(value,typeCount){
 if(!Number.isInteger(typeCount)||typeCount<1||typeCount>128||!value||!['deliver','sample'].includes(value.kind)||!Number.isInteger(value.npc)||value.npc<0||value.npc>=5||!Number.isInteger(value.t)||value.t<0||value.t>=typeCount||!Number.isInteger(value.qty)||value.qty<1||value.qty>40||value.kind==='sample'&&value.qty!==1)return null;
 return {kind:value.kind,npc:value.npc,t:value.t,qty:value.qty};
}
export function exchangeRequest(message,state,typeCount){
 if(message?.type!=='action')return null;
 if(message.k==='sample')return readExchangeReceipt({kind:'sample',npc:message.a,t:message.b,qty:1},typeCount);
 if(message.k!=='deliver'||!Array.isArray(state?.deals))return null;
 const deal=state.deals.find(d=>d.npc===message.a);
 return deal?readExchangeReceipt({kind:'deliver',npc:message.a,t:deal.t,qty:deal.qty},typeCount):null;
}
export function matchExchangeReceipt(value,expected,elapsed,typeCount){
 const receipt=readExchangeReceipt(value,typeCount),request=readExchangeReceipt(expected,typeCount);
 return receipt&&request&&Number.isFinite(elapsed)&&elapsed>=0&&elapsed<=10000&&['kind','npc','t','qty'].every(k=>receipt[k]===request[k])?receipt:null;
}
export function exchangeGesturePose(elapsed){
 if(!Number.isFinite(elapsed)||elapsed<0||elapsed>=EXCHANGE_GESTURE_MS)return null;
 const t=elapsed/EXCHANGE_GESTURE_MS,clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{const x=clamp(v);return x*x*(3-2*x);};
 const reach=t<.45?smooth(t/.45):1-smooth((t-.45)/.55),release=smooth((t-.35)/.3);
 return {reach,packScale:1-release,packVisible:release<1};
}
