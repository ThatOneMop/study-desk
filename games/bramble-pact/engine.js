(function(root,f){const api=f();if(typeof module==='object'&&module.exports)module.exports=api;else root.BramblePact=api})(globalThis,function(){'use strict';
const KEY='study-desk-bramble-pact-v1',SUITS=['Berry','Nut','Leaf'],PEOPLE=['You','Wren','Moss'];
const LEVELS=[
 {name:'The first picnic',seed:1,leader:0,winds:[0,1,2,0,1,2],goal:[1,1,1]},
 {name:'A neighbour’s basket',seed:16,leader:1,winds:[2,2,1,1,0,0],goal:[1,2,1]},
 {name:'The autumn promise',seed:19,leader:2,winds:[1,0,2,1,2,0],goal:[1,1,2]}
];
const copy=x=>JSON.parse(JSON.stringify(x)),int=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b,suit=c=>Math.floor(c/6),rank=c=>c%6+1;
function deal(level){let r=LEVELS[level].seed;const cards=Array.from({length:18},(_,i)=>i);for(let i=17;i>0;i--){r=r*16807%2147483647;const j=r%(i+1);[cards[i],cards[j]]=[cards[j],cards[i]]}return [0,1,2].map(p=>cards.slice(p*6,p*6+6).sort((a,b)=>a-b))}
function legal(b,p){const hand=b.hands[p],lead=b.table.length?suit(b.table[0].card):null,follow=hand.filter(c=>suit(c)===lead);return follow.length?follow:hand.slice()}
function strength(c,lead,wind){return rank(c)+(suit(c)===wind?200:suit(c)===lead?100:0)}
function winner(table,wind){const lead=suit(table[0].card);return table.reduce((a,b)=>strength(a.card,lead,wind)>strength(b.card,lead,wind)?a:b).player}
function bot(b,p,level){const cards=legal(b,p);if(!b.table.length)return cards.slice().sort((a,c)=>rank(a)-rank(c)||suit(a)-suit(c))[0];const wind=LEVELS[level].winds[b.trick],lead=suit(b.table[0].card),top=Math.max(...b.table.map(t=>strength(t.card,lead,wind))),ordered=cards.slice().sort((a,c)=>strength(a,lead,wind)-strength(c,lead,wind)||a-c);return ordered.find(c=>strength(c,lead,wind)>top)??ordered[0]}
function put(b,p,c){b.hands[p].splice(b.hands[p].indexOf(c),1);b.table.push({player:p,card:c})}
function prepare(b,level){if(b.trick===6)return;let p=(b.leader+b.table.length)%3;while(p!==0){put(b,p,bot(b,p,level));p=(b.leader+b.table.length)%3}}
function start(level){const b={trick:0,leader:LEVELS[level].leader,hands:deal(level),table:[],harvest:[0,0,0],giftUsed:false,history:[]};prepare(b,level);return b}
function step(level,b,a){if(b.trick===6||!a||typeof a!=='object'||Array.isArray(a)||!['card','card,gift'].includes(Object.keys(a).sort().join(','))||!int(a.card,0,17)||!legal(b,0).includes(a.card)||('gift'in a&&(a.gift!==true||b.giftUsed)))return null;const n=copy(b);put(n,0,a.card);while(n.table.length<3){const p=(n.leader+n.table.length)%3;put(n,p,bot(n,p,level))}const wind=LEVELS[level].winds[n.trick],who=winner(n.table,wind),crop=suit(n.table[0].card);if(a.gift)n.giftUsed=true;if(who===0&&!a.gift)n.harvest[crop]++;n.history.push({cards:copy(n.table),winner:who,crop,wind,gift:!!a.gift});n.trick++;n.leader=who;n.table=[];prepare(n,level);return n}
function board(s){let b=start(s.level);for(const a of s.moves){b=step(s.level,b,a);if(!b)throw Error('Invalid journal')}return b}
const won=(level,b)=>b.trick===6&&b.harvest.every((n,i)=>n===LEVELS[level].goal[i]),lost=(level,b)=>b.trick===6&&!won(level,b);
function create(){return{version:1,level:0,moves:[],records:[null,null,null]}}
function act(s,a){const n=copy(s);if(a==='undo'){if(!n.moves.length)return{ok:false,state:s};n.moves.pop();return{ok:true,state:n}}if(a==='retry'){n.moves=[];return{ok:true,state:n}}if(a?.type==='level'){if(Object.keys(a).sort().join(',')!=='level,type'||!int(a.level,0,2)||a.level>0&&s.records[a.level-1]===null)return{ok:false,state:s};n.level=a.level;n.moves=[];return{ok:true,state:n}}const b=step(s.level,board(s),a);if(!b)return{ok:false,state:s};n.moves.push(copy(a));if(won(s.level,b)){const cost=Number(b.giftUsed);n.records[s.level]=n.records[s.level]===null?cost:Math.min(cost,n.records[s.level])}return{ok:true,state:n}}
function decode(raw){const s=JSON.parse(raw);if(!s||Object.keys(s).sort().join(',')!=='level,moves,records,version'||s.version!==1||!int(s.level,0,2)||!Array.isArray(s.moves)||s.moves.length>6||!Array.isArray(s.records)||s.records.length!==3||!s.records.every(r=>r===null||int(r,0,1))||s.records.some((r,i)=>i&&r!==null&&s.records[i-1]===null)||s.level>0&&s.records[s.level-1]===null)throw Error('Invalid save');const b=board(s);if(won(s.level,b)&&(s.records[s.level]===null||s.records[s.level]>Number(b.giftUsed)))throw Error('Missing record');return copy(s)}
return{KEY,SUITS,PEOPLE,LEVELS,suit,rank,deal,legal,strength,winner,bot,start,step,board,won,lost,create,act,decode};});
