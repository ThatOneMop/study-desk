/* After Hours save validation and recovery. Existing version-1 saves are retained. */
(function(root){
'use strict';
const LIMIT=1000000;
function validate(raw,engine){
 const fail=()=>{throw new Error('This is not a complete, supported After Hours save.');};
 const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const integer=(v,min=0,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
 if(!obj(raw)||raw.version!==1||!integer(raw.round,0,23)||!['round','shop','lost','won'].includes(raw.phase))fail();
 const s={version:1,phase:raw.phase,round:raw.round};
 for(const k of ['rng','seed']){if(!integer(raw[k],0,4294967295))fail();s[k]=raw[k];}
 for(const k of ['money','score','best','played']){if(!integer(raw[k]))fail();s[k]=raw[k];}
 if(!integer(raw.hands,0,4)||!integer(raw.discards,0,3))fail();
 s.hands=raw.hands;s.discards=raw.discards;
 if(raw.phase==='round'&&s.hands===0||raw.phase==='won'&&s.round!==23)fail();
 if(!Array.isArray(raw.levels)||raw.levels.length!==9||!raw.levels.every(n=>integer(n,1,1000000)))fail();
 s.levels=raw.levels.slice();
 if(!Array.isArray(raw.charms)||raw.charms.length>5||new Set(raw.charms).size!==raw.charms.length||!raw.charms.every(id=>engine.CHARMS.some(c=>c.id===id)))fail();
 s.charms=raw.charms.slice();
 function cards(list,max){
  if(!Array.isArray(list)||list.length>max)fail();
  const result=list.map(c=>{if(!obj(c)||!integer(c.id,0,51)||!integer(c.rank,2,14)||!integer(c.suit,0,3)||c.id!==c.suit*13+c.rank-2||!integer(c.bonus??0,0,1000000))fail();return {id:c.id,rank:c.rank,suit:c.suit,bonus:c.bonus??0};});
  if(new Set(result.map(c=>c.id)).size!==result.length)fail();return result;
 }
 s.deck=cards(raw.deck,52);if(s.deck.length<20)fail();
 s.hand=cards(raw.hand,8);s.pile=cards(raw.pile,52);
 const remaining=[...s.hand,...s.pile];if(!remaining.every(c=>s.deck.some(d=>d.id===c.id)))fail();if(new Set(remaining.map(c=>c.id)).size!==remaining.length)fail();
 // Shop polishing changes the deck before the next round, so bonuses in the
 // remaining hand/pile may legitimately differ until the next draw.
 s.selected=Array.isArray(raw.selected)?[...new Set(raw.selected.filter(id=>s.hand.some(c=>c.id===id)))].slice(0,5):[];
 s.sort=raw.sort==='suit'?'suit':'rank';
 for(const k of ['discarded','discardedHearts','straightsPlayed','roundPlayed','roundDiscarded']){const n=raw[k]??0;if(!integer(n))fail();s[k]=n;}
 // Only retain safe, known fields. Imported log text is never inserted as HTML.
 s.log=Array.isArray(raw.log)?raw.log.slice(0,4).filter(p=>obj(p)&&integer(p.type,0,8)&&integer(p.points)&&integer(p.chips)&&Number.isFinite(p.mult)&&p.mult>=0).map(p=>({type:p.type,name:engine.HANDS[p.type][0],points:p.points,chips:p.chips,mult:p.mult})):[];
 if(raw.phase==='shop'||raw.phase==='won'){
  if(!obj(raw.reward))fail();s.reward={};
  for(const k of ['clear','hands','interest','extra']){const n=raw.reward[k]??0;if(!integer(n))fail();s.reward[k]=n;}
 }
 if(raw.phase==='shop'){
  if(raw.trimmed!==undefined&&typeof raw.trimmed!=='boolean')fail();s.trimmed=raw.trimmed===true;
  if(!integer(raw.rerollCost,1)||!Array.isArray(raw.stock)||raw.stock.length>6)fail();s.rerollCost=raw.rerollCost;
  s.stock=raw.stock.map(item=>{if(item===null)return null;if(!obj(item)||!integer(item.cost))fail();
   if(item.kind==='charm'){if(!engine.CHARMS.some(c=>c.id===item.id))fail();}
   else if(item.kind==='level'){if(!integer(item.id,0,8))fail();}
   else if(item.kind==='polish'){if(!integer(item.id,0,51)||!s.deck.some(c=>c.id===item.id))fail();}else fail();
   return {kind:item.kind,id:item.id,cost:item.cost};
  });
 }
 return s;
}
function parse(text,engine){if(typeof text!=='string'||text.length>LIMIT)throw new Error('Choose an After Hours JSON save smaller than 1 MB.');return validate(JSON.parse(text),engine);}
function create(storage,key,engine){
 let baseline=null,issue='',state=null;
 try{baseline=storage().getItem(key);if(baseline!==null){try{state=parse(baseline,engine);}catch{issue='Your saved run could not be loaded. It has been kept untouched. Open Saves to recover it.';}}}
 catch{issue='Device storage is unavailable. Export your run from Saves before leaving.';}
 const api={state,get issue(){return issue;},raw:()=>storage().getItem(key),backup:()=>storage().getItem(key+'.backup'),
  save(value){
   if(issue)return false;
   try{const data=JSON.stringify(validate(value,engine));if(storage().getItem(key)!==baseline){issue='Another tab changed this save. Autosave is paused; use Saves to choose which run to keep.';return false;}
    storage().setItem(key,data);baseline=data;return true;
   }catch{issue='Saving failed. Your existing save was kept; export this run from Saves.';return false;}
  },
  replace(value){
   try{const data=JSON.stringify(validate(value,engine)),current=storage().getItem(key);
    // A failed backup stops replacement before touching the main save.
    if(current!==null)storage().setItem(key+'.backup',current);
    storage().setItem(key,data);baseline=data;issue='';return true;
   }catch{issue='Could not safely save the replacement. Export your run and try again.';return false;}
  }
 };return api;
}
const api={validate,parse,create,LIMIT};if(typeof module!=='undefined')module.exports=api;else root.AfterHoursSaves=api;
})(typeof window==='undefined'?globalThis:window);
