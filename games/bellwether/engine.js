(function(root,f){const api=f();if(typeof module==='object'&&module.exports)module.exports=api;else root.Bellwether=api})(globalThis,function(){'use strict';
const KEY='study-desk-bellwether-v1',SIZE=6,LIMIT=512;
const LEVELS=[
{name:'Clover gate',dog:31,sheep:[14,16],pen:2,rocks:[0,5,30,35]},
{name:'Willow passage',dog:31,sheep:[13,22],pen:3,rocks:[8,14,20,26,5,30]},
{name:'Split pasture',dog:32,sheep:[7,16,25],pen:2,rocks:[10,15,21,29,30]}
];
const DIRS=['north','east','south','west'],copy=x=>JSON.parse(JSON.stringify(x)),integer=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
function near(p,d){const x=p%SIZE,y=Math.floor(p/SIZE);return d===0?(y?p-SIZE:-1):d===1?(x<SIZE-1?p+1:-1):d===2?(y<SIZE-1?p+SIZE:-1):(x?p-1:-1)}
function distance(a,b){return Math.abs(a%SIZE-b%SIZE)+Math.abs(Math.floor(a/SIZE)-Math.floor(b/SIZE))}
function initial(level){const l=LEVELS[level];return{dog:l.dog,sheep:l.sheep.slice()}}
function won(b){return b.sheep.every(p=>p===-1)}
function step(level,b,action){
 if(won(b)||!DIRS.includes(action)&&action!=='whistle')return null;
 const l=LEVELS[level],n=copy(b),whistle=action==='whistle';
 if(!whistle){const p=near(b.dog,DIRS.indexOf(action));if(p<0||p===l.pen||l.rocks.includes(p)||b.sheep.includes(p))return null;n.dog=p}
 const proposals=b.sheep.map((p,i)=>{
  if(p<0)return -1;const dist=distance(p,n.dog),active=whistle?dist>=3&&dist<=4:dist<=2;if(!active)return p;
  // Each sheep has a fixed compass preference. Occupied starting cells never become available mid-turn.
  const dirs=[0,1,2,3].map(d=>(d+i)%4);
  const target=dirs.map(d=>near(p,d)).find(q=>q>=0&&!l.rocks.includes(q)&&q!==n.dog&&!b.sheep.includes(q)&&(whistle?distance(q,n.dog)<dist:distance(q,n.dog)>dist));
  return target===undefined?p:target;
 });
 n.sheep=proposals.map((q,i)=>q<0?-1:proposals.filter(p=>p===q).length>1?b.sheep[i]:q===l.pen?-1:q);
 if(whistle&&n.sheep.every((p,i)=>p===b.sheep[i]))return null;
 return n;
}
function board(s){let b=initial(s.level);for(const a of s.moves){b=step(s.level,b,a);if(!b)throw Error('Invalid herding journal')}return b}
function create(){return{version:1,level:0,moves:[],records:[null,null,null]}}
function act(s,a){const n=copy(s);if(a==='undo'){if(!n.moves.length)return{ok:false,state:s};n.moves.pop();return{ok:true,state:n}}if(a==='retry'){n.moves=[];return{ok:true,state:n}}if(a&&typeof a==='object'&&Object.keys(a).sort().join(',')==='level,type'&&a.type==='level'){if(!integer(a.level,0,2)||a.level>0&&n.records[a.level-1]===null)return{ok:false,state:s};n.level=a.level;n.moves=[];return{ok:true,state:n}}if(n.moves.length>=LIMIT)return{ok:false,state:s};const b=step(s.level,board(s),a);if(!b)return{ok:false,state:s};n.moves.push(a);if(won(b))n.records[s.level]=Math.min(n.records[s.level]??Infinity,n.moves.length);return{ok:true,state:n}}
function decode(raw){const s=JSON.parse(raw);if(!s||s.version!==1||!integer(s.level,0,2)||!Array.isArray(s.moves)||s.moves.length>LIMIT||!Array.isArray(s.records)||s.records.length!==3||!s.records.every(x=>x===null||integer(x,1,LIMIT))||s.records.some((x,i)=>i>0&&x!==null&&s.records[i-1]===null)||s.level>0&&s.records[s.level-1]===null)throw Error('Invalid save');const b=board(s);if(won(b)&&(s.records[s.level]===null||s.records[s.level]>s.moves.length))throw Error('Missing record');return{version:1,level:s.level,moves:s.moves.slice(),records:s.records.slice()}}
return{KEY,SIZE,LIMIT,LEVELS,DIRS,near,distance,initial,won,step,board,create,act,decode};});
