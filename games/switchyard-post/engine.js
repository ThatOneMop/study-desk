(function(r,f){const e=f();if(typeof module==='object')module.exports=e;else r.SwitchyardPost=e})(globalThis,()=>{'use strict';
const KEY='study-desk-switchyard-post-v1',DIRS={left:-1,right:1,up:-7,down:7};
const YARDS=[
 {name:'Morning mail',rails:[14,15,16,17,18,19,20,1,2,3,8,9,10,24,25,26,31,32,33],engine:14,cars:[17,19],targets:[2,32],home:14},
 {name:'Platform exchange',rails:[14,15,16,17,18,19,20,1,2,3,8,9,10,24,25,26,31,32,33],engine:17,cars:[2,32],targets:[20,14],home:17},
 {name:'Evening return',rails:[14,15,16,17,18,19,20,0,1,2,7,8,9,25,26,27,32,33,34],engine:14,cars:[19,15],targets:[1,33],home:14}
];
const create=(level=0,records=[null,null,null],fragile=false,fragileRecords=[null,null,null])=>({v:2,level,engine:YARDS[level].engine,cars:YARDS[level].cars.slice(),coupled:-1,moves:0,undoFloor:0,history:[],records:records.slice(),fragile,fragileRecords:fragileRecords.slice(),won:false});
const layout=s=>s.fragile&&s.level===1?{...YARDS[1],targets:[18,14]}:YARDS[s.level];
const adjacent=(a,b)=>Math.abs(a%7-b%7)+Math.abs(Math.floor(a/7)-Math.floor(b/7))===1;
const snapshot=s=>({engine:s.engine,cars:s.cars.slice(),coupled:s.coupled,moves:s.moves});
function act(s,a){
 if(!a||!['move','couple','undo'].includes(a.type))return null;
 const n=JSON.parse(JSON.stringify(s)),y=layout(s);
 if(a.type==='undo'){if(!n.history.length)return null;Object.assign(n,n.history.pop());n.won=false;return n}
 if(s.won)return null;
 if(a.type==='couple'){
  if(!Number.isInteger(a.car)||a.car<0||a.car>1)return null;
  if(s.coupled===a.car)n.coupled=-1;
  else{if(s.coupled!==-1||!adjacent(s.engine,s.cars[a.car]))return null;n.coupled=a.car}
 }else{
  const to=s.engine+DIRS[a.dir];if(!y.rails.includes(to)||!adjacent(s.engine,to))return null;
  const car=s.cars.indexOf(to);
  if(car>=0){
   if(s.coupled!==-1||s.fragile&&car===0)return null;
   const beyond=to+DIRS[a.dir];if(!y.rails.includes(beyond)||!adjacent(to,beyond)||s.cars.includes(beyond))return null;
   n.cars[car]=beyond;
  }else if(s.coupled>=0)n.cars[s.coupled]=s.engine;
  n.engine=to;
 }
 if(n.history.length>=200){n.history.shift();n.undoFloor++}
 n.history.push(snapshot(s));n.moves++;
 n.won=n.engine===y.home&&n.coupled===-1&&n.cars.every((p,i)=>p===y.targets[i]);
 if(n.won){const scores=n.fragile?n.fragileRecords:n.records;scores[n.level]=Math.min(scores[n.level]??Infinity,n.moves)}
 return n;
}
function decode(raw){const s=JSON.parse(raw),int=(v,a,b=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(v)&&v>=a&&v<=b;
 if(s?.v===1){s.v=2;s.fragile=false;s.fragileRecords=[null,null,null];s.undoFloor=0}
 if(!s||s.v!==2||!int(s.level,0,2)||!Array.isArray(s.records)||s.records.length!==3||s.records.some((v,i)=>v!==null&&(!int(v,1)||i>0&&s.records[i-1]===null))||s.level>0&&s.records[s.level-1]===null||!Array.isArray(s.history)||s.history.length>200||typeof s.won!=='boolean'||!int(s.undoFloor,0)||typeof s.fragile!=='boolean'||s.fragile&&s.records[s.level]===null||!Array.isArray(s.fragileRecords)||s.fragileRecords.length!==3||s.fragileRecords.some((v,i)=>v!==null&&(!int(v,1)||s.records[i]===null)))throw Error('Invalid save');
 const y=layout(s),valid=q=>q&&y.rails.includes(q.engine)&&Array.isArray(q.cars)&&q.cars.length===2&&q.cars.every(p=>y.rails.includes(p)&&p!==q.engine)&&q.cars[0]!==q.cars[1]&&int(q.coupled,-1,1)&&(q.coupled<0||adjacent(q.engine,q.cars[q.coupled]))&&int(q.moves,0);
 if(!valid(s)||s.history.some((q,i)=>!valid(q)||q.moves!==s.moves-s.history.length+i)||s.moves!==s.undoFloor+s.history.length||s.won!==(s.engine===y.home&&s.coupled===-1&&s.cars.every((p,i)=>p===y.targets[i]))||s.won&&(s.records[s.level]===null||s.fragile&&s.fragileRecords[s.level]===null))throw Error('Invalid yard');
 return JSON.parse(JSON.stringify(s));}
return{KEY,DIRS,YARDS,create,act,decode,adjacent,layout};});
