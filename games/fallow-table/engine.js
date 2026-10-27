(function(root,f){const api=f();if(typeof module==='object'&&module.exports)module.exports=api;else root.FallowTable=api})(globalThis,function(){'use strict';
const KEY='study-desk-fallow-table-v1',DAYS=8,WORK=3,LIMIT=32;
const CROPS=[{name:'Beans',days:2,soil:0,yield:2},{name:'Carrots',days:1,soil:1,yield:2},{name:'Squash',days:3,soil:2,yield:5}];
const LEVELS=[
{name:'Kitchen garden',intro:'Regular showers help the first supper basket. Try beans beside a slow-growing squash.',soil:[2,2,2,2,2,2,2,2,2],rain:[1,0,1,0,1,0,1],needs:[4,4,5]},
{name:'Dry-stone beds',intro:'Long dry spells reward a clustered garden: one watering reaches a cross of beds.',soil:[1,2,1,2,1,2,1,2,1],rain:[0,0,1,0,0,1,0],needs:[4,6,5]},
{name:'Borrowed ground',intro:'This tired plot needs renewal. Harvest beans for soil and compost before planting hungry crops.',soil:[0,1,0,1,2,1,0,1,0],rain:[0,1,0,0,1,0,0],needs:[6,4,5]}
];
const copy=x=>JSON.parse(JSON.stringify(x)),int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
function near(p){return[p-3,p%3<2?p+1:-1,p+3,p%3?p-1:-1].filter(q=>q>=0&&q<9)}
function initial(level){return{day:1,work:WORK,compost:2,stock:[0,0,0],ended:false,beds:LEVELS[level].soil.map(soil=>({soil,water:1,crop:null,last:null}))}}
function won(level,b){return LEVELS[level].needs.every((n,i)=>b.stock[i]>=n)}
function score(b){return(DAYS-b.day)*WORK+b.work}
function yieldFor(bed,kind){return CROPS[kind].yield-(kind!==0&&bed.last===kind?1:0)}
function grow(level,b){const n=copy(b),rain=LEVELS[level].rain[b.day-1];if(rain)n.beds.forEach(bed=>bed.water=Math.min(2,bed.water+1));const beans=n.beds.map(bed=>bed.crop?.kind===0);n.beds.forEach((bed,p)=>{const c=bed.crop;if(!c||c.age>=CROPS[c.kind].days||!bed.water)return;c.age++;if(!(c.kind===2&&near(p).some(q=>beans[q])))bed.water--});n.day++;n.work=WORK;return n}
function step(level,b,a){
 if(b.ended||won(level,b))return null;
 if(a==='end'){if(b.day===DAYS){const n=copy(b);n.ended=true;return n}return grow(level,b)}
 if(!a||typeof a!=='object'||Array.isArray(a)||!int(a.p,0,8)||b.work===0)return null;
 const keys=Object.keys(a).sort().join(','),plant=a.type==='plant';if(keys!==(plant?'crop,p,type':'p,type'))return null;
 const n=copy(b),bed=n.beds[a.p];
 if(plant){if(!int(a.crop,0,2)||bed.crop||bed.soil<CROPS[a.crop].soil)return null;bed.crop={kind:a.crop,age:0,yield:yieldFor(bed,a.crop)};bed.soil-=CROPS[a.crop].soil}
 else if(a.type==='water'){const cells=[a.p,...near(a.p)];if(cells.every(p=>n.beds[p].water===2))return null;cells.forEach(p=>n.beds[p].water=2)}
 else if(a.type==='compost'){if(!n.compost||bed.soil===2)return null;n.compost--;bed.soil++}
 else if(a.type==='harvest'){const c=bed.crop;if(!c||c.age<CROPS[c.kind].days)return null;n.stock[c.kind]+=c.yield;bed.last=c.kind;bed.crop=null;if(c.kind===0){bed.soil=Math.min(2,bed.soil+1);n.compost++}}
 else return null;
 n.work--;return n;
}
function board(s){let b=initial(s.level);for(const a of s.moves){b=step(s.level,b,a);if(!b)throw Error('Invalid farm journal')}return b}
function create(){return{version:1,level:0,moves:[],records:[null,null,null]}}
function act(s,a){const n=copy(s);if(a==='undo'){if(!n.moves.length)return{ok:false,state:s};n.moves.pop();return{ok:true,state:n}}if(a==='retry'){n.moves=[];return{ok:true,state:n}}if(a&&typeof a==='object'&&Object.keys(a).sort().join(',')==='level,type'&&a.type==='level'){if(!int(a.level,0,2)||a.level>0&&n.records[a.level-1]===null)return{ok:false,state:s};n.level=a.level;n.moves=[];return{ok:true,state:n}}if(n.moves.length>=LIMIT)return{ok:false,state:s};const b=step(s.level,board(s),a);if(!b)return{ok:false,state:s};n.moves.push(copy(a));if(won(s.level,b))n.records[s.level]=Math.max(n.records[s.level]??-1,score(b));return{ok:true,state:n}}
function decode(raw){const s=JSON.parse(raw);if(!s||s.version!==1||!int(s.level,0,2)||!Array.isArray(s.moves)||s.moves.length>LIMIT||!Array.isArray(s.records)||s.records.length!==3||!s.records.every(x=>x===null||int(x,0,24))||s.records.some((x,i)=>i>0&&x!==null&&s.records[i-1]===null)||s.level>0&&s.records[s.level-1]===null)throw Error('Invalid save');const b=board(s);if(won(s.level,b)&&(s.records[s.level]===null||s.records[s.level]<score(b)))throw Error('Missing record');return{version:1,level:s.level,moves:copy(s.moves),records:s.records.slice()}}
return{KEY,DAYS,WORK,LIMIT,CROPS,LEVELS,near,initial,won,score,yieldFor,grow,step,board,create,act,decode};});
