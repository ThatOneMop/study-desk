(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.KilnChorus=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const KEY='study-desk-kiln-chorus-v1';
const LOADS=[
 {name:'Morning cups',fuel:6,pots:[{name:'Honey cup',shape:'cup',low:3,high:5,need:2,rate:2,color:'#e8b963'},{name:'Blue bowl',shape:'bowl',low:5,high:7,need:2,rate:1,color:'#80c4cb'}]},
 {name:'Market shelf',fuel:8,pots:[{name:'Rose cup',shape:'cup',low:4,high:6,need:2,rate:3,color:'#eaa0a0'},{name:'Moss jar',shape:'vase',low:6,high:8,need:3,rate:1,color:'#a5bf83'},{name:'Indigo bowl',shape:'bowl',low:8,high:10,need:2,rate:2,color:'#a8a3db'}]},
 {name:'The narrow firing',fuel:8,pots:[{name:'Ivory vase',shape:'vase',low:3,high:4,need:3,rate:1,color:'#eedaba'},{name:'Fern bowl',shape:'bowl',low:6,high:7,need:2,rate:3,color:'#93c1aa'},{name:'Ember cup',shape:'cup',low:8,high:9,need:3,rate:2,color:'#eb9e71'}]}
];
const clone=o=>JSON.parse(JSON.stringify(o));
const int=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b;
const create=()=>({v:1,level:0,moves:[],records:[null,null,null]});
const initial=level=>({heat:0,fuel:LOADS[level].fuel,pots:LOADS[level].pots.map(()=>({temp:0,soak:0,drawn:false})),phase:'firing',reason:''});
function actionOK(a,n){return a==='stoke'||a==='bank'||a==='vent'||(typeof a==='string'&&/^draw[0-2]$/.test(a)&&Number(a[4])<n)}
function step(level,b,input){
 let a=input,shield=null;const l=LOADS[level];
 if(input&&typeof input==='object'){if(Object.keys(input).sort().join(',')!=='action,shield'||!int(input.shield,0,(l?.pots.length??0)-1)||b.shieldUsed||b.pots[input.shield].drawn||input.action==='draw'+input.shield)return null;a=input.action;shield=input.shield}
 if(!l||b.phase!=='firing'||!actionOK(a,l.pots.length)||a==='stoke'&&b.fuel===0)return null;
 const n=clone(b);if(shield!==null)n.shieldUsed=true;if(a.startsWith('draw')){const i=Number(a[4]);if(n.pots[i].drawn||n.pots[i].soak<l.pots[i].need)return null;n.pots[i].drawn=true}
 n.heat=Math.max(0,Math.min(12,n.heat+(a==='stoke'?3:a==='vent'?-3:-1)));if(a==='stoke')n.fuel--;
 n.pots.forEach((p,i)=>{if(p.drawn)return;const d=l.pots[i];if(i!==shield)p.temp+=Math.sign(n.heat-p.temp)*Math.min(d.rate,Math.abs(n.heat-p.temp));if(p.temp>d.high){n.phase='lost';n.reason=d.name+' overheated at '+p.temp+' (limit '+d.high+').'}else if(p.temp>=d.low)p.soak=Math.min(d.need,p.soak+1)});
 if(n.phase==='firing'&&n.pots.every(p=>p.drawn)){n.phase='won';n.reason='Every piece drawn safely.'}
 if(n.phase==='firing'&&n.fuel===0&&n.heat===0&&n.pots.every(p=>p.drawn||p.temp===0)&&n.pots.some((p,i)=>!p.drawn&&p.soak<l.pots[i].need)){n.phase='lost';n.reason='The fire is cold and no fuel remains for the unfinished clay.'}
 return JSON.stringify(n)===JSON.stringify(b)?null:n;
}
function board(s){let b=initial(s.level);for(const a of s.moves){b=step(s.level,b,a);if(!b)throw Error('Invalid firing journal')}return b}
function act(s,a){const n=clone(s);if(a==='undo'){if(!n.moves.length)return{ok:false,state:s};n.moves.pop()}
 else if(a==='retry')n.moves=[];
 else if(a&&typeof a==='object'&&a.type==='level'){if(!int(a.level,0,2)||a.level>0&&n.records[a.level-1]===null)return{ok:false,state:s};n.level=a.level;n.moves=[]}
 else{if(n.moves.length>=96)return{ok:false,state:s};const b=step(n.level,board(n),a);if(!b)return{ok:false,state:s};n.moves.push(a);if(b.phase==='won')n.records[n.level]=Math.max(n.records[n.level]??-1,b.fuel)}
 return{ok:true,state:n};
}
function decode(raw){if(typeof raw!=='string'||raw.length>8000)throw Error('Invalid save');const s=JSON.parse(raw);if(!s||s.v!==1||!int(s.level,0,2)||!Array.isArray(s.moves)||s.moves.length>96||!Array.isArray(s.records)||s.records.length!==3||s.records.some((r,i)=>r!==null&&!int(r,0,LOADS[i].fuel)))throw Error('Invalid save');for(let i=1;i<3;i++)if(s.records[i]!==null&&s.records[i-1]===null)throw Error('Invalid unlock');if(s.level>0&&s.records[s.level-1]===null)throw Error('Locked load');const n={v:1,level:s.level,moves:s.moves.slice(),records:s.records.slice()},b=board(n);if(b.phase==='won'&&(n.records[n.level]===null||n.records[n.level]<b.fuel))throw Error('Missing record');return n}
return{KEY,LOADS,create,initial,step,board,act,decode};
});
