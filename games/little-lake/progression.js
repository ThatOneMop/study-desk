/* Little Lake — trip contracts, lures, and stretch mastery.
   Cash buys tackle. A stretch opens only after it has been fished. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.LakeProgress=factory()})(typeof globalThis==='undefined'?window:globalThis,()=>{
'use strict';
const AREA_MAX=8000000;
const LURES=[{id:'balanced',name:'All-round spinner',note:'All six local species. A good choice for discoveries.'},{id:'small',name:'Reed fly',note:'Targets the three smaller species. Bites come 25% sooner.'},{id:'deep',name:'Deep-water spoon',note:'Targets the three larger species. Bites take 35% longer.'}];
const NAMED=[['The Shallows',0,0],['Willow River',1,1],['Moonwater Coast',2,2],['Reed Marsh',3,6],['Autumn Coves',7,12],['Glacial Narrows',13,20],['Dusky Sound',21,32],['Starlit Basin',33,48],['Far Shores',49,72]];
let FROM,TO;
(function build(){
  const froms=NAMED.map(row=>row[1]),tos=NAMED.map(row=>row[2]);
  let from=73,width=16,grown=0;
  while(from<AREA_MAX){
    const to=Math.min(AREA_MAX-1,from+width-1);
    froms.push(from);tos.push(to);
    from=to+1;grown++;
    if(grown%2===0)width=Math.min(96,Math.ceil(width*1.18));
  }
  FROM=Int32Array.from(froms);TO=Int32Array.from(tos);
})();
function stretchAt(index){
  const froms=FROM,tos=TO;
  if(!Number.isInteger(index)||index<0||index>=froms.length)throw Error('Invalid stretch');
  const from=froms[index],to=tos[index];
  const name=index<NAMED.length?NAMED[index][0]:(from===to?'Horizon '+(from+1).toLocaleString():'Horizon '+(from+1).toLocaleString()+'–'+(to+1).toLocaleString());
  return {index,name,from,to};
}
function stretchOf(area){
  const tos=TO,a=clampArea(area);
  let lo=0,hi=tos.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(tos[mid]<a)lo=mid+1;else hi=mid}
  return stretchAt(lo);
}
function clampArea(area){area=Math.floor(Number(area)||0);return Math.max(0,Math.min(AREA_MAX-1,area))}
function pool(area){return Array.from({length:6},(_,k)=>(clampArea(area)*6+k)%7000)}
function needs(index){return {species:index<3?3:4,perfects:Math.min(4,2+Math.floor(index/4)),catches:Math.min(12,6+index)}}
function rewardFor(index){return Math.round(60+index*40)}
function pressure(area){return 1+Math.min(.32,stretchOf(area).index*.035)}
function catchValue(base,weight,area,perfect){return Math.round(base*(.8+weight*.15)*(1+Math.sqrt(clampArea(area))*.6)*(perfect?1.25:1))}
function emptyMastery(waters){return {gate:stretchOf(waters).index,species:[],catches:0,perfects:0,frontier:false}}
function settled(waters){const s=stretchOf(waters);return s.to<=waters?s.index:s.index-1}
function validSpecies(id,waters){
  const s=stretchOf(waters);
  if(!Number.isInteger(id))return false;
  for(let area=s.from;area<=waters;area++)if(pool(area).includes(id))return true;
  return false;
}
function sanitizeMastery(value,waters){
  const blank=emptyMastery(waters);
  if(!value||typeof value!=='object'||value.gate!==blank.gate||!Array.isArray(value.species))return blank;
  const species=[];
  for(const id of value.species){if(species.length>=6)break;if(validSpecies(id,waters)&&!species.includes(id))species.push(id)}
  let catches=Math.floor(Number(value.catches)||0),perfects=Math.floor(Number(value.perfects)||0);
  if(catches<species.length||catches>1000000||perfects<0||perfects>catches)return blank;
  return {gate:blank.gate,species,catches,perfects,frontier:value.frontier===true};
}
function adopt(save){
  const waters=clampArea(save&&save.waters);
  return {waters,paidThrough:settled(waters),mastery:sanitizeMastery(save&&save.mastery,waters)};
}
function met(mastery,waters){
  const stretch=stretchOf(waters),need=needs(stretch.index);
  if(!mastery||mastery.gate!==stretch.index)return false;
  if(mastery.species.length<need.species||mastery.perfects<need.perfects||mastery.catches<need.catches)return false;
  if(stretch.from!==stretch.to&&!mastery.frontier)return false;
  return true;
}
function noteCatch(progress,area,speciesId,perfect){
  const waters=clampArea(progress.waters);
  const stretch=stretchOf(waters);
  const current=sanitizeMastery(progress.mastery,waters);
  if(area<stretch.from||area>waters||!pool(area).includes(speciesId))return {mastery:current,counted:false,justReady:false};
  const next={gate:current.gate,species:current.species.slice(),catches:current.catches,perfects:current.perfects,frontier:current.frontier};
  const before=met(next,waters);
  if(!next.species.includes(speciesId))next.species.push(speciesId);
  next.catches=Math.min(1000000,next.catches+1);
  if(perfect)next.perfects=Math.min(next.catches,next.perfects+1);
  if(area===waters)next.frontier=true;
  return {mastery:next,counted:true,justReady:met(next,waters)&&!before};
}
function gateView(progress,fishingArea){
  const waters=clampArea(progress.waters);
  const here=stretchOf(waters);
  const mastery=sanitizeMastery(progress.mastery,waters);
  if(waters>=AREA_MAX-1)return {doneAll:true,ready:false,here,next:null,lines:[],summary:'Every horizon is open.'};
  const upcoming=waters<here.to?here:stretchAt(here.index+1);
  const next={index:upcoming.index,name:upcoming.name,from:waters<here.to?waters+1:upcoming.from,to:upcoming.to};
  const need=needs(here.index);
  const lines=[
    {done:mastery.species.length>=need.species,text:'Fish from this stretch '+mastery.species.length+'/'+need.species},
    {done:mastery.perfects>=need.perfects,text:'Perfect catches '+mastery.perfects+'/'+need.perfects},
    {done:mastery.catches>=need.catches,text:'Catches in this stretch '+mastery.catches+'/'+need.catches}
  ];
  if(here.from!==here.to)lines.push({done:mastery.frontier===true,text:'A catch from area '+(waters+1)});
  const ready=lines.every(line=>line.done);
  const away=fishingArea<here.from||fishingArea>waters;
  const summary=ready?next.name+' can open from Areas.':next.name+' is sealed · '+lines.map(line=>line.text.replace('Fish from this stretch ','fish ').replace('Perfect catches ','perfect ').replace('Catches in this stretch ','caught ').replace('A catch from area ','area ')).join(' · ')+(away?' · fish '+here.name+' for this':'');
  return {doneAll:false,ready,here,next,lines,summary};
}
function advance(progress){
  const adopted=adopt(progress);
  if(adopted.waters>=AREA_MAX-1)return {ok:false,reason:'Every horizon is already open.',reward:0};
  const view=gateView(adopted,adopted.waters);
  if(!view.ready)return {ok:false,reason:view.summary,reward:0,waters:adopted.waters};
  const waters=view.next.to;
  const before=adopted.paidThrough;
  const after=settled(waters);
  let reward=0;const gained=[];
  for(let index=before+1;index<=after;index++){gained.push(index);reward+=rewardFor(index)}
  return {ok:true,waters,paidThrough:after,mastery:emptyMastery(waters),reward,gained,toast:view.next.name+' is open.'+(reward?' +$'+reward:'')};
}
function create(area=0,round=0){return {area,round,fish:[],catches:0,perfects:0,claimed:[false,false,false]}}
function restore(value,area=0){const fail=()=>create(area);if(!value||!Number.isInteger(value.area)||value.area<0||value.area>=8000000||!Number.isInteger(value.round)||value.round<0||value.round>1000000)return fail();if(!Array.isArray(value.fish)||value.fish.length>6||new Set(value.fish).size!==value.fish.length||!value.fish.every(id=>Array.from({length:6},(_,k)=>(value.area*6+k)%7000).includes(id)))return fail();if(!Number.isInteger(value.catches)||value.catches<0||value.catches>1000000||!Number.isInteger(value.perfects)||value.perfects<0||value.perfects>value.catches||value.fish.length>value.catches||!Array.isArray(value.claimed)||value.claimed.length!==3||!value.claimed.every(x=>typeof x==='boolean'))return fail();return {...value,fish:[...value.fish],claimed:[...value.claimed]}}
function goals(c){return [{name:'Field naturalist',have:c.fish.length,need:3,reward:Math.round(75*(1+Math.sqrt(c.area)*.6))},{name:'Steady hands',have:c.perfects,need:2,reward:Math.round(90*(1+Math.sqrt(c.area)*.6))},{name:'Dock delivery',have:c.catches,need:6+Math.min(4,c.round),reward:Math.round(110*(1+Math.sqrt(c.area)*.6))}]}
function record(c,area,id,perfect){if(area!==c.area||!Array.from({length:6},(_,k)=>(area*6+k)%7000).includes(id))return 0;c.catches=Math.min(1000000,c.catches+1);if(perfect)c.perfects=Math.min(c.catches,c.perfects+1);if(!c.fish.includes(id))c.fish.push(id);let reward=0;goals(c).forEach((g,i)=>{if(!c.claimed[i]&&g.have>=g.need){c.claimed[i]=true;reward+=g.reward}});return reward}
function roll(lure,random,bonus=0){const n=Math.max(0,Math.min(.999999,random));if(lure==='small')return Math.min(2,Math.floor(n*3));if(lure==='deep'){const r=n+bonus;return r>.94?5:r>.6?4:3}const r=n+bonus;return r>1.02?5:r>.92?4:r>.74?3:r>.47?2:r>.2?1:0}
return {LURES,create,restore,goals,record,roll,stretchAt,stretchOf,needs,rewardFor,pressure,catchValue,adopt,noteCatch,gateView,advance,pool,AREA_MAX};
});
