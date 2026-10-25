import {exchangeAccess} from '../dist/exchange-access.mjs';
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {customerReply,readCustomerReceipt} from '../dist/customer-context.mjs';
const src=fs.readFileSync('dist/game.js','utf8');
const body=src.slice(src.indexOf('function doAction(k,a,b,c){'),src.indexOf('function reservedQty(t)'));
const s={cash:400,bank:0,room:false,tents:0,plants:[],seeds:[0],soil:0,raw:[0],gummies:[0],packs:[0],wrappers:0,made:0,sold:0,earned:0,xp:0,heat:0,planted:0,watered:0,harvested:0,listed:0,texted:0,deals:[],threads:{},bench:0,lights:0};
const c={s,STRAINS:[{name:'Pine Pop',seed:30,time:24,level:1}],CONTACTS:[{name:'Jules',x:0,z:0,budget:1}],player:{x:0,y:1.72,z:0},Math,Date,Number,track:null,close(){},toast(){},refresh(){},save(){},startWork(){},cash:n=>'$'+n,level:()=>1+Math.floor(s.xp/30),maxTents:()=>2,unlocked:()=>true,value:()=>30,reservedQty:t=>s.deals.filter(d=>d.t===t).reduce((a,d)=>a+d.qty,0),spend(n){if(s.cash<n)return false;s.cash-=n;return true}};
c.customerExchangeStatus=i=>exchangeAccess(c.player,c.CONTACTS[i],()=>false);c.customerReply=customerReply;c.readCustomerReceipt=readCustomerReceipt;
// This extracted economics-only test deliberately omits the full presentation runtime.
c.committedExchange=()=>{};
c.agree=(i,price)=>{const t=s.threads[i];t.status='agreed';s.deals.push({npc:i,t:t.t,qty:t.qty,price})};vm.createContext(c);vm.runInContext(body,c);
for(const k of ['rent','buyTent','buyCan','seed','soil','wrappers'])c.doAction(k,0);
// V12 equipment costs are handled by a later action wrapper; account for them explicitly here.
s.cash-=110;s.trimmers=true;s.packStation=true;assert.equal(s.cash,50);
c.doAction('install',0);c.doAction('prepare',0);c.doAction('plant',0,0);c.doAction('fill');c.doAction('water',0);s.plants[0].phase='thirsty';c.doAction('water',0);s.plants[0].phase='mature';c.doAction('harvest',0);
for(let i=0;i<4;i++){c.doAction('make',0);c.doAction('pack',0)}assert.equal(s.packs[0],4);assert.equal(s.wrappers,6);
c.doAction('list',0,4,30);c.doAction('text',0);c.doAction('deliver',0);assert.equal(s.cash,170);assert.equal(s.sold,4);assert.equal(s.xp,20);c.doAction('deliver',0);assert.equal(s.cash,170);
// A second identical crop earns enough XP and cash for the first press.
c.doAction('seed',0);c.doAction('soil');s.raw[0]=4;for(let i=0;i<4;i++){c.doAction('make',0);c.doAction('pack',0)}c.doAction('list',0,4,30);c.doAction('text',0);c.doAction('deliver',0);c.doAction('bench');assert.equal(s.bench,1);assert.equal(s.cash,30);
console.log('PASS: base-action economics, first sale, duplicate delivery, second-crop press upgrade. Growth transitions simulated; not a full game/browser test.');
