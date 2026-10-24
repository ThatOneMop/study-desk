/* Afterlight collection save protection — MIT, Study Desk contributors, 2026. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory();
 else root.AfterlightSaves=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const KEY='afterlight-v1',BACKUP='afterlight-v1-backup';
 const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
 const blank=()=>({chapter:0,coins:0,up:[0,0],complete:false,best:0});
 const initial=()=>Object.fromEntries(Array.from({length:10},(_,i)=>[i,blank()]));
 function normalise(value){
  if(!object(value))throw Error('Save must be an object');
  if(Object.keys(value).some(k=>!/^(?:[0-9])$/.test(k)))throw Error('Unknown game key');
  const out=initial();
  for(let i=0;i<10;i++){
   const p=value[i];if(p===undefined)continue;
   if(!object(p))throw Error('Invalid game save');
   const allowed=['chapter','coins','up','complete','best'];
   if(Object.keys(p).some(k=>!allowed.includes(k)))throw Error('Unknown save field');
   if(p.chapter!==undefined&&(!Number.isInteger(p.chapter)||p.chapter<0||p.chapter>4))throw Error('Invalid chapter');
   if(p.coins!==undefined&&(!Number.isFinite(p.coins)||p.coins<0||p.coins>1000000))throw Error('Invalid coins');
   if(p.up!==undefined&&(!Array.isArray(p.up)||p.up.length!==2||p.up.some(n=>!Number.isInteger(n)||n<0||n>5)))throw Error('Invalid upgrades');
   if(p.complete!==undefined&&typeof p.complete!=='boolean')throw Error('Invalid completion');
   if(p.best!==undefined&&(!Number.isFinite(p.best)||p.best<0||p.best>1000000000))throw Error('Invalid best');
   out[i]={chapter:p.chapter??0,coins:p.coins??0,up:p.up?[...p.up]:[0,0],complete:p.complete??false,best:p.best??0};
  }
  return out;
 }
 function create(storage){
  let status='ready',expected=null,originalRaw=null;
  function read(){return storage.getItem(KEY)}
  function load(){
   try{expected=read();originalRaw=expected}catch{status='unavailable';return initial()}
   if(expected===null){status='ready';return initial()}
   if(expected.length>1000000){status='invalid';return initial()}
   try{const value=normalise(JSON.parse(expected));status='ready';return value}
   catch{status='invalid';return initial()}
  }
  function encode(value){return JSON.stringify(normalise(value))}
  function save(value){
   if(status==='invalid'||status==='unavailable')return false;
   let current;try{current=read()}catch{status='unavailable';return false}
   if(current!==expected){status='conflict';return false}
   try{const raw=encode(value);storage.setItem(KEY,raw);expected=raw;originalRaw=raw;status='ready';return true}
   catch{status='unavailable';return false}
  }
  function replace(value){
   try{
    const current=read();if(current!==null)storage.setItem(BACKUP,current);
    const raw=encode(value);storage.setItem(KEY,raw);expected=raw;originalRaw=raw;status='ready';return true;
   }catch{status='unavailable';return false}
  }
  return {load,save,replace,exportText:value=>status==='invalid'&&originalRaw!==null?originalRaw:JSON.stringify(normalise(value),null,2),readBackup:()=>storage.getItem(BACKUP),get status(){return status},get originalRaw(){return originalRaw}};
 }
 return {create,initial,normalise,KEY,BACKUP};
});
