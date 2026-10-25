// A read-only distance plan keeps nearby play crisp, grades the town, and
// lets the authored horizon settle into the sky without touching world state.
export const ATMOSPHERIC_FIXED_VIEWS=Object.freeze([
 Object.freeze({id:'campsite-road',foreground:34,town:142,backdrop:268}),
 Object.freeze({id:'westside-junction',foreground:42,town:156,backdrop:282}),
 Object.freeze({id:'east-market-crossing',foreground:38,town:149,backdrop:274}),
 Object.freeze({id:'north-heights-rise',foreground:46,town:168,backdrop:296})
]);

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const finite=value=>Number.isFinite(value);
export function atmosphericDistancePlan({daylight=1,active=true,quality='balanced'}={}){
 const day=clamp(finite(daylight)?daylight:1,0,1),mode=['performance','balanced','high'].includes(quality)?quality:'balanced',night=1-day;
 const qualityOffset=mode==='performance'?-14:mode==='high'?12:0;
 const near=active?92-night*8:82,far=active?286-night*18+qualityOffset:238;
 return Object.freeze({near,far,waterNear:Math.max(70,near-12),waterFar:far-20,horizonHaze:clamp(.2+night*.18,0,1),quality:mode,active:!!active});
}

export function atmosphericFogFactor(distance,plan=atmosphericDistancePlan()){
 const value=finite(distance)?Math.max(0,distance):0,near=finite(plan?.near)?plan.near:92,far=finite(plan?.far)&&plan.far>near?plan.far:286;
 return clamp((value-near)/(far-near),0,1);
}

export function atmosphericViewSeparation(view,plan=atmosphericDistancePlan()){
 if(!view||![view.foreground,view.town,view.backdrop].every(finite)||view.foreground<0||view.town<=view.foreground||view.backdrop<=view.town)return null;
 const factors=[view.foreground,view.town,view.backdrop].map(distance=>atmosphericFogFactor(distance,plan));
 return Object.freeze({id:String(view.id||'fixed-view'),foreground:factors[0],town:factors[1],backdrop:factors[2],separated:factors[0]<=.02&&factors[1]>=.2&&factors[1]<=.5&&factors[2]>=.78});
}
