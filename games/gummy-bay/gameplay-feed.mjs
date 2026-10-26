// State and events for the phone, HUD and menus. This module does not draw anything.
const listeners=new Set();
let readState=()=>null;

export function bindGameplayState(read){readState=typeof read==='function'?read:()=>null;}

export function gameplaySnapshot(){
 const state=readState();
 return state&&typeof state==='object'?state:null;
}

export function subscribeGameplay(listener){
 if(typeof listener!=='function')return ()=>{};
 listeners.add(listener);
 return ()=>listeners.delete(listener);
}

export function emitGameplay(event){
 if(!event||typeof event!=='object'||!event.type)return;
 for(const listener of [...listeners]){
  try{listener(event);}catch(error){console.error(error);}
 }
}
