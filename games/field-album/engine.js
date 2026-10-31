(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FieldAlbum=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const KEY='study-desk-field-album-v1',TERRAINS=['meadow','pond','forest'];
const SPECIES=[
 {name:'Clover',habitat:'meadow',kind:'plant',color:'#d6a7ba',rule:'1 point + 2 on meadow.'},
 {name:'Reed',habitat:'pond',kind:'plant',color:'#9dc7ad',rule:'1 point + 2 on pond.'},
 {name:'Fern',habitat:'forest',kind:'plant',color:'#8aba87',rule:'1 point + 2 on forest.'},
 {name:'Bee',habitat:'meadow',kind:'animal',color:'#edca71',rule:'2 points + 3 per neighbouring clover.'},
 {name:'Frog',habitat:'pond',kind:'animal',color:'#8ccac0',rule:'2 points + 2 per different neighbouring plant species.'},
 {name:'Robin',habitat:'forest',kind:'animal',color:'#e6a183',rule:'2 points + 2 on forest + 2 with no neighbouring robin.'}
];
const SITES=[
 {name:'The home meadow',target:36,terrain:[0,0,1,1,0,2,1,2,2,2,0,1]},
 {name:'Splitwater trail',target:40,terrain:[1,0,2,1,2,1,0,2,0,2,1,0]},
 {name:'Woodland edge',target:44,terrain:[2,2,0,1,0,1,2,0,1,0,1,2]}
];
const copy=x=>JSON.parse(JSON.stringify(x));
function neighbours(p){return[p%4? p-1:-1,p%4<3?p+1:-1,p>=4?p-4:-1,p<8?p+4:-1].filter(x=>x>=0)}
function packet(seed,level,day,habitat){let x=(seed+level*7919+day*1543+habitat*313)%2147483647;const rand=()=>{x=x*48271%2147483647;return x};const cards=[habitat,habitat+3,rand()%6];for(let i=2;i>0;i--){const j=rand()%(i+1);[cards[i],cards[j]]=[cards[j],cards[i]]}return cards}
function initial(){return{cells:Array(12).fill(null),day:0,pack:null,phase:'survey'}}
function score(cells,level){const points=cells.map((s,p)=>{if(s===null)return 0;const ns=neighbours(p).map(i=>cells[i]);if(s<3)return 1+(SITES[level].terrain[p]===s?2:0);if(s===3)return 2+3*ns.filter(n=>n===0).length;if(s===4)return 2+2*new Set(ns.filter(n=>n!==null&&n<3)).size;return 2+(SITES[level].terrain[p]===2?2:0)+(ns.includes(5)?0:2)});return{points,total:points.reduce((a,b)=>a+b,0)}}
// Studies derive only from the current page; no new save fields or unlock gates.
function studies(cells,level){
 const positions=s=>cells.flatMap((v,p)=>v===s?[p]:[]);
 const bees=positions(3),frogs=positions(4),robins=positions(5);
 const clovers=p=>neighbours(p).filter(q=>cells[q]===0).length;
 const diversity=p=>new Set(neighbours(p).map(q=>cells[q]).filter(v=>v!==null&&v<3)).size;
 const native=[0,1,2].filter(s=>positions(s).some(p=>SITES[level].terrain[p]===s));
 const safeRobins=robins.filter(p=>SITES[level].terrain[p]===2&&!neighbours(p).some(q=>cells[q]===5));
 return [
  {id:'pollinators',title:'Pollinator network',rule:'Give every bee a neighbouring clover, with one bee sharing at least two.',met:bees.length>0&&bees.every(p=>clovers(p)>0)&&bees.some(p=>clovers(p)>=2),detail:bees.length?bees.filter(p=>clovers(p)>0).length+'/'+bees.length+' bees fed; best clover link '+Math.max(...bees.map(clovers)):'No bees yet'},
  {id:'wetland',title:'Wetland mosaic',rule:'Surround one frog with Clover, Reed and Fern on its four edges.',met:frogs.some(p=>diversity(p)===3),detail:'Best frog neighbours: '+(frogs.length?Math.max(...frogs.map(diversity)):0)+'/3 plant species'},
  {id:'refuge',title:'Native refuge',rule:'Place each plant species on its own terrain, plus a forest robin with no robin neighbour.',met:native.length===3&&safeRobins.length>0,detail:native.length+'/3 native plants; '+safeRobins.length+' sheltered robins'}
 ];
}
function action(a){if(!a||typeof a!=='object'||Array.isArray(a))return null;if(['pocket','swapPocket'].includes(a.type)&&Number.isInteger(a.card)&&a.card>=0&&a.card<3)return{type:a.type,card:a.card};if(a.type==='rearrange'&&Number.isInteger(a.from)&&a.from>=0&&a.from<12&&Number.isInteger(a.p)&&a.p>=0&&a.p<12)return{type:'rearrange',from:a.from,p:a.p};if(a.type==='survey'&&Number.isInteger(a.habitat)&&a.habitat>=0&&a.habitat<3)return{type:'survey',habitat:a.habitat};if(a.type==='place'&&Number.isInteger(a.card)&&a.card>=0&&a.card<3&&Number.isInteger(a.p)&&a.p>=0&&a.p<12)return{type:'place',card:a.card,p:a.p};return null}
function step(b,a,seed,level){a=action(a);if(!a)return null;const n=copy(b);if(a.type==='pocket'||a.type==='swapPocket'){if(b.phase!=='arrange'||b.pack.taken.includes(a.card)||b.pack.pocketed===a.card)return null;if(a.type==='pocket'){if(b.pocketUsed||b.day>=5)return null;n.pocket={species:b.pack.cards[a.card],day:b.day};n.pocketUsed=true;n.pack.pocketed=a.card;}else{if(!b.pocket||b.day<=b.pocket.day||b.pack.cards[a.card]===b.pocket.species)return null;n.pack.cards[a.card]=b.pocket.species;n.pocket=null;}return n}if(a.type==='rearrange'){if(b.rearranged||b.cells[a.from]===null||a.from===a.p||b.cells[a.from]===b.cells[a.p])return null;[n.cells[a.from],n.cells[a.p]]=[n.cells[a.p],n.cells[a.from]];n.rearranged=true;return n}if(b.phase==='complete')return null;if(a.type==='survey'){if(b.phase!=='survey')return null;n.pack={habitat:a.habitat,cards:packet(seed,level,b.day,a.habitat),taken:[]};n.phase='arrange'}else{if(b.phase!=='arrange'||b.cells[a.p]!==null||b.pack.taken.includes(a.card)||b.pack.pocketed===a.card)return null;n.cells[a.p]=b.pack.cards[a.card];n.pack.taken.push(a.card);if(n.pack.taken.length===2){n.day++;n.pack=null;n.phase=n.day===6?'complete':'survey'}}return n}
function board(s){let b=initial();for(const a of s.moves){b=step(b,a,s.seed,s.level);if(!b)throw Error('Invalid field journal')}return b}
function create(seed=137){return{version:1,seed,level:0,moves:[],records:[null,null,null]}}
function decode(raw){const x=typeof raw==='string'?JSON.parse(raw):raw;if(!x||x.version!==1||!Number.isInteger(x.seed)||x.seed<1||x.seed>999999||!Number.isInteger(x.level)||x.level<0||x.level>2||!Array.isArray(x.moves)||x.moves.length>21||!Array.isArray(x.records)||x.records.length!==3)throw Error('Invalid album');const records=x.records.map(r=>{if(r!==null&&(!Number.isInteger(r)||r<0||r>168))throw Error('Invalid record');return r});for(let l=1;l<3;l++){if((x.level>=l||records[l]!==null)&&(records[l-1]===null||records[l-1]<SITES[l-1].target))throw Error('Locked trail')}const moves=x.moves.map(a=>{const clean=action(a);if(!clean)throw Error('Invalid action');return clean}),s={version:1,seed:x.seed,level:x.level,moves,records};const b=board(s);if(b.phase==='complete')s.records[s.level]=Math.max(s.records[s.level]??0,score(b.cells,s.level).total);return s}
function act(s,a){let n=copy(s);if(a==='undo'){if(!n.moves.length)return{ok:false,state:s};n.moves.pop()}else if(a==='retry'){n.moves=[]}else if(a&&a.type==='trail'){if(!Number.isInteger(a.level)||a.level<0||a.level>2||(a.level>0&&(n.records[a.level-1]??0)<SITES[a.level-1].target))return{ok:false,state:s};n.level=a.level;n.moves=[]}else if(a&&a.type==='seed'){if(!Number.isInteger(a.seed)||a.seed<1||a.seed>999999)return{ok:false,state:s};n.seed=a.seed;n.moves=[]}else{const clean=action(a);if(!clean||!step(board(n),clean,n.seed,n.level))return{ok:false,state:s};n.moves.push(clean)}n=decode(n);return{ok:true,state:n}}
function forecast(s,a){const before=board(s),after=step(before,a,s.seed,s.level);if(!after)return null;return{board:after,score:score(after.cells,s.level),gain:score(after.cells,s.level).total-score(before.cells,s.level).total}}
return{KEY,TERRAINS,SPECIES,SITES,studies,neighbours,packet,initial,score,step,create,decode,board,act,forecast};
});
