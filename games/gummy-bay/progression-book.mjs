// v173 town book. Districts and gear unlock with level and batch quality.
// Display only: shops still use their own gates. No new shop screen.
export const AREA_GATES=Object.freeze([
 {id:'old-town',name:'Old Town',level:1,quality:0,mode:'level'},
 {id:'westside',name:'Westside',level:3,quality:0,mode:'level'},
 {id:'east-market',name:'East Market',level:5,quality:.45,mode:'or'},
 {id:'west-harbor',name:'West Harbor',level:6,quality:.55,mode:'and'},
 {id:'north-heights',name:'North Heights',level:8,quality:.62,mode:'and'},
 {id:'east-coast',name:'East Coast',level:11,quality:.72,mode:'and'},
 {id:'northgate',name:'Northgate',level:14,quality:.8,mode:'and'}
].map(Object.freeze));

export function areaById(id){return AREA_GATES.find(a=>a.id===id)||null;}

export function areaOpen(id,{level=1,quality=0}={}){
 const g=areaById(id);if(!g)return false;
 const lvl=(level||1)>=g.level,qual=!(g.quality>0)||(quality||0)>=g.quality;
 if(g.mode==='or')return lvl||qual;
 if(g.mode==='and')return lvl&&qual;
 return lvl;
}

export function bestBatchQuality(state){
 let best=0;
 for(const key of ['packQuality','gummyQuality','rawQuality']){
  const arr=state?.[key];if(!Array.isArray(arr))continue;
  for(const q of arr)if(Number.isFinite(q)&&q>best)best=q;
 }
 return Math.max(0,Math.min(1,best));
}

const GEAR=Object.freeze([
 {name:'Grow lights, gummy press, mixer, delivery van',level:2},
 {name:'Compact car, irrigation, Harbor workshop',level:3},
 {name:'Suds banking, pickup',level:4},
 {name:'Hillside house, estate car',level:5},
 {name:'Limo',level:6},
 {name:'Sunset Gold seed, sprinter van',level:7}
].map(Object.freeze));

export function gearRows(level=1){
 return GEAR.map(row=>Object.freeze({name:row.name,level:row.level,open:(level||1)>=row.level,need:(level||1)>=row.level?'Unlocked':'Reach level '+row.level}));
}

export function areaHow(area,ctx={}){
 if(!area)return 'Keep exploring.';
 if(areaOpen(area.id,ctx))return 'Open.';
 if(area.mode==='or')return 'Reach level '+area.level+' or batch quality '+Math.round(area.quality*100)+'%.';
 if(area.mode==='and')return 'Reach level '+area.level+' and batch quality '+Math.round(area.quality*100)+'%.';
 return 'Reach level '+area.level+'.';
}

export function gateText(gate,ctx={}){
 if(!gate)return 'Keep meeting people.';
 const level=ctx.level||1,quality=ctx.quality||0;
 if(gate.kind==='level'){
  const bits=[];
  if(level<gate.level)bits.push('Reach level '+gate.level);
  if(gate.quality>0&&quality<gate.quality)bits.push('batch quality '+Math.round(gate.quality*100)+'%');
  return bits.length?bits.join(' and ')+'.':'You can meet them. Hand over a sample.';
 }
 if(gate.kind==='district')return areaHow(areaById(gate.area),ctx);
 if(gate.kind==='both'){
  const parts=[];
  if(level<(gate.level||1))parts.push('level '+(gate.level||1));
  if(gate.quality>0&&quality<gate.quality)parts.push('quality '+Math.round(gate.quality*100)+'%');
  if(gate.area&&!ctx.areaOpen?.(gate.area))parts.push(areaById(gate.area)?.name||gate.area);
  return parts.length?'Need '+parts.join(', ')+'.':'You can meet them. Hand over a sample.';
 }
 return 'Keep playing.';
}

export function progressModel(ctx={},people=[]){
 const level=ctx.level||1,quality=ctx.quality||0,xp=ctx.xp||0;
 return Object.freeze({
  level,quality,xp,
  areas:Object.freeze(AREA_GATES.map(area=>Object.freeze({id:area.id,name:area.name,open:areaOpen(area.id,{level,quality}),how:areaHow(area,{level,quality})}))),
  gear:Object.freeze(gearRows(level)),
  people:Object.freeze(people.map(person=>Object.freeze({...person})))
 });
}

export function progressHTML(model,esc=value=>String(value??'')){
 const e=typeof esc==='function'?esc:value=>String(value??'');
 const m=model||{level:1,xp:0,quality:0,areas:[],gear:[],people:[]};
 const areas=(m.areas||[]).map(area=>'<article class="net-card"><strong>'+e(area.name)+'</strong><p class="note">'+(area.open?'Open':e(area.how))+'</p></article>').join('');
 const gear=(m.gear||[]).map(row=>'<p class="note"><b>'+e(row.name)+'</b> — '+(row.open?'unlocked':e(row.need))+'</p>').join('');
 const people=(m.people||[]).map(person=>'<p class="note">'+(person.unlocked?'●':'○')+' <b>'+e(person.name)+'</b> · '+e(person.area||'Old Town')+' · '+e(person.how||'')+'</p>').join('');
 return '<div class="overline">TOWN BOOK</div><h2>Level '+e(m.level)+' · '+e(m.xp)+' XP</h2><p class="note">Best batch quality '+Math.round((m.quality||0)*100)+'%. Districts open as your level and your best batch climb. A free sample that suits someone brings them, and the people they know, into your book.</p><h3>Districts</h3>'+areas+'<h3>Gear by level</h3>'+gear+'<h3>People</h3>'+people;
}
