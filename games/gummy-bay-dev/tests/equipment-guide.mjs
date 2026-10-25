import assert from 'node:assert/strict';
import {workshopEquipment,assemblyWording} from '../dist/equipment-guide.mjs';
const fresh={house:0,room:false,tents:0,installed:[]},before=JSON.stringify(fresh);
assert.equal(workshopEquipment(fresh).next,null);assert.equal(JSON.stringify(fresh),before);
for(let house=0;house<3;house++){
 const capacity=[2,4,8][house];
 for(let owned=0;owned<=capacity;owned++)for(let n=0;n<=owned;n++){
  const s={house,room:true,tents:owned,installed:Array.from({length:n},(_,i)=>i)},old=JSON.stringify(s),v=workshopEquipment(s);
  assert.equal(v.capacity,capacity);assert.equal(v.owned,owned);assert.equal(v.installed,n);assert.equal(v.pending,owned-n);assert.equal(v.next,n<owned?n:null);assert.equal(v.slots.length,8);assert.equal(JSON.stringify(s),old);
  assert(v.slots.every(t=>!t.pending||t.owned&&!t.installed));
 }
}
const mixed={house:2,room:true,tents:5,installed:[3,1,3,7,-1,NaN,'2']};
assert.equal(workshopEquipment(mixed).installed,2);assert.equal(workshopEquipment(mixed).next,0);assert.equal(workshopEquipment({...mixed,installed:[0,1,3]}).next,2);
assert.equal(workshopEquipment({...mixed,room:false}).pending,0);
for(const bad of [-1,3,Infinity,NaN,'1'])assert.equal(workshopEquipment({house:bad,room:true,tents:8}).owned,0);
for(const bad of [-1,Infinity,NaN,'8'])assert.equal(workshopEquipment({house:2,room:true,tents:bad}).owned,0);
for(let i=0;i<8;i++){assert(assemblyWording(i).heading.includes(String(i+1).padStart(2,'0')));assert(assemblyWording(i).detail.includes('Owned'));}
for(const bad of [-1,8,Infinity,NaN,'0'])assert.equal(assemblyWording(bad),null);
console.log('PASS: all property capacities, purchased-versus-installed states, next pending assembly, duplicate/legacy indices, invalid bounds, full wording and immutable ownership projection. No rendering performed.');
