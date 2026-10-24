(function(root){
'use strict';
const plain=value=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;
const number=(value,min=0,max=Number.MAX_SAFE_INTEGER)=>typeof value==='number'&&Number.isFinite(value)&&value>=min&&value<=max;
const integer=(value,min=0,max=Number.MAX_SAFE_INTEGER)=>Number.isInteger(value)&&value>=min&&value<=max;
const optional=(object,key,check)=>!Object.prototype.hasOwnProperty.call(object,key)||check(object[key]);
function numberMap(value,maxKey,maxEntries){
  if(!plain(value)){return false}
  const entries=Object.entries(value);
  return entries.length<=maxEntries&&entries.every(([key,count])=>/^(0|[1-9]\d*)$/.test(key)&&integer(+key,0,maxKey)&&integer(count,0,Number.MAX_SAFE_INTEGER));
}
function fish(value){
  if(!plain(value)){return false}
  return optional(value,'coins',v=>number(v))&&optional(value,'catches',v=>integer(v))&&optional(value,'rod',v=>integer(v,0,10000))&&optional(value,'lure',v=>integer(v,0,10000))&&optional(value,'water',v=>integer(v,0,99))&&optional(value,'unlocked',v=>integer(v,1,100))&&optional(value,'book',v=>numberMap(v,99999,100000))&&optional(value,'visits',v=>numberMap(v,99,100))&&optional(value,'best',v=>number(v));
}
function queen(value){
  if(!plain(value)){return false}
  const array=(v,length,check)=>Array.isArray(v)&&v.length===length&&v.every(check);
  return optional(value,'nectar',v=>number(v))&&optional(value,'roles',v=>array(v,4,n=>integer(n,0,1000000)))&&optional(value,'stock',v=>array(v,4,n=>number(n)))&&optional(value,'pantry',v=>array(v,4,n=>number(n)))&&optional(value,'fed',v=>number(v))&&optional(value,'level',v=>integer(v,1,1000000))&&optional(value,'dna',v=>integer(v,0,1000000))&&optional(value,'talents',v=>array(v,3,n=>integer(n,0,1000000)))&&optional(value,'evolutions',v=>Array.isArray(v)&&v.length<=10000)&&optional(value,'speed',v=>integer(v,0,1000000))&&optional(value,'auto',v=>typeof v==='boolean')&&optional(value,'time',v=>number(v))&&optional(value,'eggs',v=>integer(v,0,1000000));
}
function decode(raw){
  if(raw===null){return {ok:true,data:{}}}
  if(typeof raw!=='string'||raw.length>20*1024*1024){return {ok:false}}
  try{
    const data=JSON.parse(raw);
    if(!plain(data)||!optional(data,'fish',fish)||!optional(data,'queen',queen)){return {ok:false}}
    return {ok:true,data};
  }catch{return {ok:false}}
}
function create({storage,key='tinyWilds2'}){
  let raw=null,status='ready',data={};
  function load(){
    try{raw=storage.getItem(key)}catch{status='unavailable';raw=null;data={};return state()}
    const result=decode(raw);
    if(!result.ok){status='invalid';data={};return state()}
    status='ready';data=result.data;return state();
  }
  function state(){return {status,raw,data}}
  function save(nextData){
    if(status!=='ready'){return false}
    let current;
    try{current=storage.getItem(key)}catch{status='unavailable';return false}
    if(current!==raw){status='conflict';return false}
    try{const next=JSON.stringify(nextData);storage.setItem(key,next);raw=next;data=nextData;return true}catch{status='unavailable';return false}
  }
  function replace(nextData){
    try{const next=JSON.stringify(nextData);storage.setItem(key,next);raw=next;data=nextData;status='ready';return true}catch{status='unavailable';return false}
  }
  function backup(kind,nextData){
    if(kind==='preserved'&&status==='invalid'&&typeof raw==='string'){return raw}
    return JSON.stringify(nextData,null,2);
  }
  return {load,state,save,replace,backup,decode};
}
root.TinyWildsSaves={create,decode};
})(typeof window==='undefined'?globalThis:window);
