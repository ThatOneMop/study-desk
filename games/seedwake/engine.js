(function(root,f){const api=f();if(typeof module==='object'&&module.exports)module.exports=api;else root.Seedwake=api})(globalThis,function(){'use strict';
const KEY='study-desk-seedwake-v1';
const FLOWERS=['Poppy','Cornflower','Chamomile'];
const LEVELS=[
 {name:'Morning ring',intro:'Three flowers for the kitchen windowsill. Follow the last seed, not the largest handful.',seeds:[2,1,3,1,5,4,1,1],sizes:[3,4,3,4,3,4,3,4],flowers:[0,1,2,0,1,2,0,2],needs:[1,1,1],turns:12,gusts:2},
 {name:'Walled garden',intro:'A second poppy makes the bouquet. Save a gust for a landing that clockwise sowing cannot reach.',seeds:[4,2,1,3,4,2,4,0],sizes:[4,3,4,3,4,3,4,3],flowers:[0,1,2,0,1,2,0,2],needs:[2,1,1],turns:15,gusts:2},
 {name:'Evening garland',intro:'Five flowers, with more blue and cream than red. Every flower spends its bed’s seeds.',seeds:[1,4,3,1,4,4,3,4],sizes:[3,4,3,4,3,4,3,4],flowers:[0,1,2,0,1,2,1,2],needs:[1,2,2],turns:18,gusts:3}
];
const copy=x=>JSON.parse(JSON.stringify(x)),int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
function initial(l){return{seeds:LEVELS[l].seeds.slice(),bouquet:[0,0,0],turn:0,gusts:LEVELS[l].gusts,last:null,bloom:null}}
function won(l,b){return LEVELS[l].needs.every((n,i)=>b.bouquet[i]>=n)}
function lost(l,b){return !won(l,b)&&(b.turn>=LEVELS[l].turns||b.seeds.every(n=>!n))}
function step(l,b,a){if(won(l,b)||lost(l,b)||!a||typeof a!=='object'||Array.isArray(a)||Object.keys(a).sort().join(',')!=='bed,reverse'||!int(a.bed,0,7)||typeof a.reverse!=='boolean'||!b.seeds[a.bed]||a.reverse&&!b.gusts)return null;
 const n=copy(b),count=n.seeds[a.bed],dir=a.reverse?-1:1;n.seeds[a.bed]=0;let p=a.bed;for(let i=0;i<count;i++){p=(p+dir+8)%8;n.seeds[p]++}n.turn++;if(a.reverse)n.gusts--;n.last=p;n.bloom=null;if(n.seeds[p]===LEVELS[l].sizes[p]){n.bloom=LEVELS[l].flowers[p];n.bouquet[n.bloom]++;n.seeds[p]=0}return n}
function trail(b,a){if(!a||!int(a.bed,0,7))return[];return Array.from({length:b.seeds[a.bed]},(_,i)=>(a.bed+(a.reverse?-1:1)*(i+1)+64)%8)}
function create(){return{version:1,level:0,moves:[],records:[null,null,null]}}
function board(s){let b=initial(s.level);for(const a of s.moves){b=step(s.level,b,a);if(!b)throw Error('Invalid sowing journal')}return b}
function act(s,a){const n=copy(s);if(a==='undo'){if(!n.moves.length)return{ok:false,state:s};n.moves.pop();return{ok:true,state:n}}if(a==='retry'){n.moves=[];return{ok:true,state:n}}if(a&&typeof a==='object'&&Object.keys(a).sort().join(',')==='level,type'&&a.type==='level'){if(!int(a.level,0,2)||a.level>0&&n.records[a.level-1]===null)return{ok:false,state:s};n.level=a.level;n.moves=[];return{ok:true,state:n}}const b=step(s.level,board(s),a);if(!b)return{ok:false,state:s};n.moves.push(copy(a));if(won(s.level,b))n.records[s.level]=Math.min(n.records[s.level]??Infinity,b.turn);return{ok:true,state:n}}
function decode(raw){const s=JSON.parse(raw);if(!s||s.version!==1||!int(s.level,0,2)||!Array.isArray(s.moves)||s.moves.length>18||!Array.isArray(s.records)||s.records.length!==3||!s.records.every((x,i)=>x===null||int(x,1,LEVELS[i].turns))||s.records.some((x,i)=>i>0&&x!==null&&s.records[i-1]===null)||s.level>0&&s.records[s.level-1]===null)throw Error('Invalid save');const b=board(s);if(won(s.level,b)&&(s.records[s.level]===null||s.records[s.level]>b.turn))throw Error('Missing record');return{version:1,level:s.level,moves:copy(s.moves),records:s.records.slice()}}
return{KEY,FLOWERS,LEVELS,initial,won,lost,step,trail,create,board,act,decode};});
