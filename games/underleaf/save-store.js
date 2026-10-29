/* Underleaf save protection — MIT, Study Desk contributors, 2026. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.UnderleafSaves=factory()})(typeof window==='undefined'?globalThis:window,()=>{
 'use strict';
 const KEY='underleaf-v1',BACKUP=KEY+'.backup';
 const initial=()=>({food:20,workers:3,rooms:1,carry:0,speed:0,nurse:0,auto:0,autoOn:true,eggs:[],gathered:0,time:0,rewards:0,focus:'balanced',focusCooldown:0});
 function validate(value){
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid colony');
  const s=initial();for(const key of Object.keys(s))if(Object.hasOwn(value,key))s[key]=value[key];
  const integer=(key,min,max)=>{if(!Number.isInteger(s[key])||s[key]<min||s[key]>max)throw Error('Invalid '+key)};
  for(const key of ['food','gathered','time'])if(!Number.isFinite(s[key])||s[key]<0||s[key]>Number.MAX_SAFE_INTEGER)throw Error('Invalid '+key);
  integer('rooms',1,25);integer('workers',3,12+(s.rooms-1)*8);
  for(const key of ['carry','speed','nurse'])integer(key,0,5);
  if(!['balanced','forage','nursery','dig'].includes(s.focus)||!Number.isFinite(s.focusCooldown)||s.focusCooldown<0||s.focusCooldown>15)throw Error('Invalid work priority');
  integer('auto',0,1);integer('rewards',0,4);
  if(typeof s.autoOn!=='boolean'||!Array.isArray(s.eggs)||s.workers+s.eggs.length>12+(s.rooms-1)*8)throw Error('Invalid brood');
  s.eggs=s.eggs.map(e=>{
   if(!e||!Number.isFinite(e.duration)||e.duration<2||e.duration>8||!Number.isFinite(e.left)||e.left<=0||e.left>e.duration)throw Error('Invalid egg');
   return {left:e.left,duration:e.duration};
  });return s;
 }
 function parse(text,complete=false){
  if(typeof text!=='string'||text.length>100000)throw Error('Choose a colony JSON file under 100 KB.');
  const value=JSON.parse(text);
  if(!value||!Object.hasOwn(value,'workers'))throw Error('Not an Underleaf colony.');
  if(complete&&!['food','workers','rooms','carry','speed','nurse','auto','eggs','gathered','time','rewards'].every(key=>Object.hasOwn(value,key)))throw Error('Choose a complete Underleaf export.');
  return validate(value);
 }
 function create(storage){
  let raw=null,status='ready';
  function read(){return storage.getItem(KEY)}
  function load(){
   try{raw=read()}catch{status='unavailable';return initial()}
   if(raw===null){status='ready';return initial()}
   try{const s=parse(raw);status='ready';return s}catch{status='invalid';return initial()}
  }
  function save(value){
   if(status!=='ready')return false;
   try{const next=JSON.stringify(validate(value));if(read()!==raw){status='conflict';return false}storage.setItem(KEY,next);raw=next;return true}catch{status='unavailable';return false}
  }
  function replace(value,expected){
   // Back up the exact current bytes before intentionally replacing a colony.
   // A failed read/backup/write must not report a successful reset.
   try{const next=JSON.stringify(validate(value)),previous=read();if(arguments.length>1&&previous!==expected){status='conflict';return false}
    const oldBackup=storage.getItem(BACKUP);if(previous!==null)storage.setItem(BACKUP,previous);
    try{storage.setItem(KEY,next)}catch(error){
     // Best-effort preservation of the older backup if the main write fails.
     try{if(oldBackup===null)storage.removeItem?.(BACKUP);else storage.setItem(BACKUP,oldBackup)}catch{}
     throw error;
    }
    raw=next;status='ready';return true;
   }catch{status='unavailable';return false}
  }
  return {load,save,replace,readCurrent:read,readBackup:()=>storage.getItem(BACKUP),get status(){return status},get originalRaw(){return raw}};
 }
 return {KEY,BACKUP,initial,validate,parse,create};
});
