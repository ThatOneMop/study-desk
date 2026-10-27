// v170: the Strains app. Every product you can make, as a collection: discovered strains in colour with
// effects and value, undiscovered ones as dark gummy silhouettes with a hint. Plus "try next" mixing ideas
// from what you already own, so mixing is the obvious next thing to do. Pure model + HTML.
const fallbackEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hex=n=>'#'+(Number(n)>>>0).toString(16).padStart(6,'0').slice(-6);
export function strainBookModel({strains=[],baseCount=0,pantry=[],book={},unlocked=()=>false,names={},value=()=>0,owned=()=>0,baseStock=()=>0,pantryStock=()=>0,pantryOpen=()=>true,mixedIndex=null}={}){
 const cards=[];let found=0;
 strains.forEach((p,i)=>{
  if(!p)return;const mixed=i>=baseCount&&!!p.mixed;if(i>=baseCount&&!mixed)return;
  const known=mixed?!!book[i]:unlocked(i);if(known)found++;
  cards.push(Object.freeze({index:i,known,mixed,name:known?(names[i]||p.name):'???',color:hex(p.color??0x777777),
   effects:known?(p.effects||[]).slice(0,4):[],value:known?value(i):null,owned:known?owned(i):0,
   hint:known?(mixed?(strains[p.base]?.name||'')+' + '+(pantry[p.ingredient]?.name||'').toLowerCase():'Base gummy'):mixed?(strains[p.base]?.name||'?')+' + ?':'Unlocks at level '+(p.level??'?')}));
 });
 const tryNext=[];
 if(typeof mixedIndex==='function')for(let b=0;b<baseCount&&tryNext.length<3;b++){if(!unlocked(b)||baseStock(b)<1)continue;for(let k=0;k<pantry.length&&tryNext.length<3;k++){if(!pantryOpen(k)||pantryStock(k)<1)continue;const t=mixedIndex(b,k,baseCount);if(t>=0&&strains[t]&&!book[t])tryNext.push(Object.freeze({base:strains[b].name,ingredient:pantry[k].name,index:t}));}}
 return Object.freeze({found,total:cards.length,cards:Object.freeze(cards),tryNext:Object.freeze(tryNext)});
}
export function strainBookHTML(model,{esc=fallbackEsc,chip=id=>'<em class="mix-chip">'+esc(id)+'</em>',money=n=>'$'+n}={}){
 if(!model)return '';const pct=model.total?Math.round(model.found/model.total*100):0;
 const tries=model.tryNext.length?'<div class="sb-try"><b>Try next at the mixing station</b>'+model.tryNext.map(t=>'<span>'+esc(t.base)+' + '+esc(t.ingredient.toLowerCase())+'</span>').join('')+'</div>':'<div class="sb-try"><b>Mixing</b><span>Buy ingredients at the servo, then mix a base gummy at your station to discover new strains.</span></div>';
 const cards=model.cards.map(c=>'<div class="sb-card'+(c.known?'':' locked')+(c.mixed?' mixed':'')+'"><i class="sb-gummy" style="--g:'+c.color+'" aria-hidden="true"></i><strong>'+esc(c.name)+'</strong><small>'+esc(c.hint)+'</small>'+(c.known?'<p>'+c.effects.map(id=>chip(id)).join('')+'</p><em class="sb-value">'+esc(money(c.value))+(c.owned?' · '+c.owned+' in stock':'')+'</em>':'')+'</div>').join('');
 return '<section class="strain-book" aria-label="Strains"><div class="overline">COLLECTION</div><h2>Strains</h2><div class="sb-progress" role="progressbar" aria-valuemin="0" aria-valuemax="'+model.total+'" aria-valuenow="'+model.found+'"><i style="width:'+pct+'%"></i></div><p class="sb-count">'+model.found+' of '+model.total+' discovered</p>'+tries+'<div class="sb-grid">'+cards+'</div></section>';
}
