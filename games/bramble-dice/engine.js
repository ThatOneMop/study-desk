/* Original Study Desk game. No external assets. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BrambleDice=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const KEY='study-desk-bramble-dice-v1',MAX=1200;
const FOES=[
 {name:'Gate beetle',hp:28,intents:[{name:'Feelers',hit:4,armor:1,thorns:0},{name:'Shell charge',hit:7,armor:2,thorns:0},{name:'Open shell',hit:2,armor:0,thorns:0}]},
 {name:'Briar snail',hp:38,intents:[{name:'Briar coat',hit:3,armor:1,thorns:2},{name:'Heavy trail',hit:7,armor:2,thorns:0},{name:'Soft step',hit:4,armor:0,thorns:0}]},
 {name:'Hollow owl',hp:48,intents:[{name:'Gathering wings',hit:4,armor:3,thorns:0},{name:'Moon dive',hit:10,armor:0,thorns:0},{name:'Landing',hit:3,armor:0,thorns:0}]}
];
const PERKS=[{id:'blade',name:'Honed spoon',text:'+1 attack for each attack die.'},{id:'guard',name:'Patchwork shield',text:'+1 protection for each guard die.'},{id:'mend',name:'Moss salve',text:'+2 healing when you use at least one repair die.'},{id:'balance',name:'Three-leaf clasp',text:'+4 attack when attack, guard and repair all receive dice.'},{id:'small',name:'Acorn sling',text:'+3 attack for each attack die showing 1 or 2.'}];
const clone=x=>JSON.parse(JSON.stringify(x)),integer=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b;
function draw(r){r.rng=(r.rng*48271)%2147483647;return 1+r.rng%6;}
function roll(r){r.dice=Array.from({length:4},()=>draw(r));r.rerolls=2;}
function fresh(seed){const r={rng:seed,room:0,hp:18,maxHp:18,foeHp:FOES[0].hp,turn:0,turns:0,phase:'active',perks:{blade:0,guard:0,mend:0,balance:0,small:0},last:null};roll(r);return r;}
function intent(r){return FOES[r.room].intents[r.turn%3];}
function forecast(r,slots){if(!Array.isArray(slots)||slots.length!==4||!slots.every(n=>integer(n,0,3)))return null;const sums=[0,0,0,0],counts=[0,0,0,0];slots.forEach((n,i)=>{sums[n]+=r.dice[i];counts[n]++});const balanced=counts[1]>0&&counts[2]>0&&counts[3]>0,lowDice=slots.filter((n,i)=>n===1&&r.dice[i]<=2).length,bonus=4*r.perks.balance*(balanced?1:0)+3*r.perks.small*lowDice;const foe=intent(r),attack=Math.max(0,sums[1]+counts[1]*r.perks.blade+bonus-foe.armor),guard=sums[2]+counts[2]*r.perks.guard,heal=Math.min(r.maxHp-r.hp,Math.floor(sums[3]/3)+(counts[3]?2*r.perks.mend:0)),thorns=counts[1]?foe.thorns:0,defeated=attack>=r.foeHp,hit=defeated?0:Math.max(0,foe.hit-guard),hp=Math.max(0,r.hp+heal-hit-thorns);return{attack,bonus,balanced,lowDice,guard,heal,thorns,hit,hp,foeHp:Math.max(0,r.foeHp-attack),defeated,unassigned:counts[0]};}
function step(r,a){if(!a||typeof a!=='object')return false;
 if(a.type==='perk'){if(r.phase!=='reward'||!PERKS.some(p=>p.id===a.id))return false;r.perks[a.id]++;r.room++;r.foeHp=FOES[r.room].hp;r.hp=Math.min(r.maxHp,r.hp+4);r.turn=0;r.phase='active';r.last=null;roll(r);return true;}
 if(r.phase!=='active')return false;
 if(a.type==='reroll'){if(r.rerolls<=0||!Array.isArray(a.keep)||a.keep.length!==4||!a.keep.every(x=>typeof x==='boolean')||a.keep.every(Boolean))return false;r.dice=r.dice.map((v,i)=>a.keep[i]?v:draw(r));r.rerolls--;return true;}
 if(a.type!=='resolve')return false;const f=forecast(r,a.slots);if(!f||f.unassigned)return false;r.last={...f,dice:r.dice.slice(),slots:a.slots.slice(),foe:FOES[r.room].name,intent:intent(r).name};r.hp=f.hp;r.foeHp=f.foeHp;r.turns++;r.turn++;
 if(!r.hp)r.phase='lost';else if(!r.foeHp)r.phase=r.room===2?'won':'reward';else roll(r);return true;
}
function create(seed=1){if(!integer(seed,1,2147483646))throw Error('Invalid trail seed');return{version:1,seed,journal:[],best:null,setup:{keep:[false,false,false,false],slots:[0,0,0,0]}};}
function run(s){const r=fresh(s.seed);for(const a of s.journal)if(!step(r,a))throw Error('Invalid trail journal');return r;}
function act(state,a){const s=clone(state),r=run(s);if(a==='retry'||a==='new'){s.seed=a==='new'?s.seed%2147483646+1:s.seed;s.journal=[];s.setup=create().setup;return{ok:true,state:s};}if(s.journal.length>=MAX)return{ok:false,state,reason:'Trail journal is full. Start another trail.'};if(!step(r,a))return{ok:false,state,reason:'That action is not available.'};s.journal.push(clone(a));if(a.type!=='reroll')s.setup=create().setup;if(r.phase==='won')s.best=s.best===null?r.turns:Math.min(s.best,r.turns);return{ok:true,state:s};}
function decode(raw){const s=JSON.parse(raw);if(!s||s.version!==1||!integer(s.seed,1,2147483646)||!Array.isArray(s.journal)||s.journal.length>MAX||!(s.best===null||integer(s.best,3,MAX))||!s.setup||!Array.isArray(s.setup.keep)||s.setup.keep.length!==4||!s.setup.keep.every(v=>typeof v==='boolean')||!Array.isArray(s.setup.slots)||s.setup.slots.length!==4||!s.setup.slots.every(v=>integer(v,0,3)))throw Error('Invalid save');const r=run(s);if(r.phase==='won'&&(s.best===null||s.best>r.turns))throw Error('Missing victory record');return{version:1,seed:s.seed,journal:clone(s.journal),best:s.best,setup:clone(s.setup)};}
return{KEY,MAX,FOES,PERKS,create,run,act,decode,forecast,intent};
});
