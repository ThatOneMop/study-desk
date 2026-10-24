/* Nightshift save protection — MIT, Study Desk contributors, 2026. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory();
 else root.NightshiftSaves=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const PREFIX='nightshift-v1-',BACKUP_PREFIX='nightshift-v1-backup-';
 const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
 function create({storage,id,fresh,restore}){
  const key=PREFIX+id,backupKey=BACKUP_PREFIX+id;
  let status='ready',expected=null,originalRaw=null;
  function parse(raw){
   if(typeof raw!=='string'||raw.length>1000000)throw Error('Invalid save text');
   const value=JSON.parse(raw);
   if(!object(value)||value.version!==1||value.id!==id)throw Error('Wrong save');
   if(!Number.isFinite(value.cash)||value.cash<0||value.cash>1e9)throw Error('Invalid cash');
   if(!Number.isFinite(value.total)||value.total<0||value.total>1e9)throw Error('Invalid total');
   if(!Number.isInteger(value.level)||value.level<1||value.level>6)throw Error('Invalid level');
   if(!Array.isArray(value.up)||value.up.length!==3||value.up.some(n=>!Number.isInteger(n)||n<0||n>8))throw Error('Invalid upgrades');
   if(!Number.isInteger(value.best)||value.best<0||value.best>6||typeof value.won!=='boolean')throw Error('Invalid progress');
   return restore(id,value);
  }
  function read(){return storage.getItem(key)}
  function load(){
   try{expected=read();originalRaw=expected}catch{status='unavailable';return fresh(id)}
   if(expected===null){status='ready';return fresh(id)}
   try{const value=parse(expected);status='ready';return value}
   catch{status='invalid';return fresh(id)}
  }
  function encode(value){return JSON.stringify(restore(id,value))}
  function save(value){
   if(status==='invalid'||status==='unavailable')return false;
   let current;
   try{current=read()}catch{status='unavailable';return false}
   if(current!==expected){status='conflict';return false}
   try{const raw=encode(value);storage.setItem(key,raw);expected=raw;originalRaw=raw;status='ready';return true}
   catch{status='unavailable';return false}
  }
  function replace(value){
   try{
    const current=read();
    if(current!==null)storage.setItem(backupKey,current);
    const raw=encode(value);storage.setItem(key,raw);expected=raw;originalRaw=raw;status='ready';return true;
   }catch{status='unavailable';return false}
  }
  function backup(){
   let text;
   try{text=storage.getItem(backupKey)}catch{return {status:'unavailable'}}
   if(text===null)return {status:'missing'};
   try{return {status:'ready',text,value:parse(text)}}catch{return {status:'invalid',text}}
  }
  function restoreBackup(){
   if(status==='unavailable')return {ok:false,reason:'unavailable'};
   let current;
   try{current=read()}catch{status='unavailable';return {ok:false,reason:'unavailable'}}
   if(current!==expected){status='conflict';return {ok:false,reason:'conflict'}}
   const previous=backup();
   if(previous.status!=='ready')return {ok:false,reason:previous.status};
   try{const raw=encode(previous.value);storage.setItem(key,raw);expected=raw;originalRaw=raw;status='ready';return {ok:true,value:previous.value}}
   catch{status='unavailable';return {ok:false,reason:'unavailable'}}
  }
  return {load,save,replace,backup,restoreBackup,exportText:value=>status==='invalid'&&originalRaw!==null?originalRaw:JSON.stringify(restore(id,value),null,2),readBackup:()=>storage.getItem(backupKey),get status(){return status},get originalRaw(){return originalRaw},key,backupKey};
 }
 return {create,PREFIX,BACKUP_PREFIX};
});
