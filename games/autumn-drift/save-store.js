/* Autumn Drift save validation — MIT, Study Desk contributors, 2026. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.AutumnSaves=factory()})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const KEY='autumn-drift-v2',LEGACY='autumn-drift-v1',LIMIT=1000000;
 const initial=()=>({area:0,unlocked:0,money:0,ranks:[0,0,0,0],picked:0,clears:0,garden:null});
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const number=(v,min,max,integer=false)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max&&(!integer||Number.isInteger(v));
 function validate(value){
  if(!object(value))throw Error('Not a garden');
  const s=initial();for(const key of Object.keys(s))if(Object.hasOwn(value,key))s[key]=value[key];
  if(!number(s.area,0,4999,true)||!number(s.unlocked,s.area,4999,true)||!number(s.money,0,Number.MAX_SAFE_INTEGER)||!number(s.picked,0,Number.MAX_SAFE_INTEGER,true)||!number(s.clears,0,Number.MAX_SAFE_INTEGER,true))throw Error('Invalid progress');
  if(!Array.isArray(s.ranks)||s.ranks.length!==4||!s.ranks.every(n=>number(n,0,5000,true)))throw Error('Invalid upgrades');s.ranks=[...s.ranks];
  if(s.garden!==null){
   const g=s.garden;
   if(!object(g)||g.area!==s.area||!number(g.total,1,900,true)||!number(g.collected,0,g.total,true)||!Array.isArray(g.leaves)||g.leaves.length>900||g.leaves.length+g.collected!==g.total||typeof g.completed!=='boolean'||g.completed!==(g.leaves.length===0))throw Error('Invalid garden');
   const ids=new Set(),leaves=g.leaves.map(l=>{
    if(!object(l)||!number(l.id,0,899,true)||ids.has(l.id)||!number(l.x,0,1200)||!number(l.y,0,800)||!number(l.a,-100,100)||!number(l.s,1,100)||!number(l.max,1,3500,true)||!number(l.hp,1,l.max,true)||typeof l.rare!=='boolean'||typeof l.c!=='string'||!/^#[0-9a-f]{6}$/i.test(l.c))throw Error('Invalid leaf');
    ids.add(l.id);return {id:l.id,x:l.x,y:l.y,a:l.a,s:l.s,c:l.c,hp:l.hp,max:l.max,rare:l.rare};
   });s.garden={area:g.area,total:g.total,collected:g.collected,completed:g.completed,leaves};
  }return s;
 }
 function json(raw){if(typeof raw!=='string'||raw.length>LIMIT)throw Error('Save too large');return JSON.parse(raw)}
 function create(storage){
  let expected=null,loaded=null,status='ready',migrated=false;
  function load(){
   migrated=false;
   try{expected=storage.getItem(KEY);loaded=expected;
    if(expected!==null){try{const v=json(expected);if(!object(v)||!Object.hasOwn(v,'area'))throw Error('Not a saved garden');const s=validate(v);status='ready';return s}catch{status='invalid';return initial()}}
    const legacy=storage.getItem(LEGACY);loaded=legacy;if(legacy===null){status='ready';return initial()}
    try{const v=json(legacy);if(!object(v)||!number(v.money,0,Number.MAX_SAFE_INTEGER))throw Error('Invalid legacy save');migrated=true;status='ready';return {...initial(),money:v.money}}catch{status='invalid';return initial()}
   }catch{status='unavailable';return initial()}
  }
  function save(value){
   if(status!=='ready')return false;
   try{const text=JSON.stringify(validate(value));if(storage.getItem(KEY)!==expected){status='conflict';return false}storage.setItem(KEY,text);expected=text;return true}catch{status='unavailable';return false}
  }
  return {load,save,get status(){return status},get originalRaw(){return loaded},get migrated(){return migrated}};
 }
 return {KEY,LEGACY,initial,validate,create};
});
