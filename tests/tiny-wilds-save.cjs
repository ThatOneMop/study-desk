const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(root+'/games/tiny-wilds/save.js','utf8');
const context={};vm.createContext(context);vm.runInContext(source,context);const Saves=context.TinyWildsSaves;
function storage(initial=null){let value=initial,writes=0;return {getItem:()=>value,setItem:(_,next)=>{value=next;writes++},value:()=>value,writes:()=>writes,external:next=>{value=next}}}
let s=storage('{broken json'),store=Saves.create({storage:s}),loaded=store.load();
assert.equal(loaded.status,'invalid');assert.equal(loaded.raw,'{broken json');assert.deepEqual(JSON.parse(JSON.stringify(loaded.data)),{});
assert.equal(store.save({fish:{coins:10}}),false);assert.equal(s.writes(),0);assert.equal(store.backup('preserved',{}),'{broken json');
assert.equal(store.replace({fish:{coins:10}}),true);assert.equal(store.state().status,'ready');assert.equal(JSON.parse(s.value()).fish.coins,10);
assert.equal(Saves.decode('{"fish":{"water":100}}').ok,false);assert.equal(Saves.decode('{"queen":{"roles":[1,2,3]}}').ok,false);assert.equal(Saves.decode('{"fish":{"coins":5,"unlocked":1},"queen":{"roles":[3,2,0,0],"auto":false}}').ok,true);
s=storage('{"fish":{"coins":5}}');store=Saves.create({storage:s});store.load();s.external('{"fish":{"coins":99}}');
assert.equal(store.save({fish:{coins:6}}),false);assert.equal(store.state().status,'conflict');assert.equal(JSON.parse(s.value()).fish.coins,99);
s=storage(null);store=Saves.create({storage:s});assert.equal(store.load().status,'ready');assert.equal(store.save({fish:{coins:1},queen:{roles:[3,2,0,0]}}),true);assert.equal(store.state().status,'ready');assert.equal(JSON.parse(s.value()).fish.coins,1);
const broken={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};store=Saves.create({storage:broken});assert.equal(store.load().status,'unavailable');assert.equal(store.save({}),false);
const html=fs.readFileSync(root+'/games/tiny-wilds/index.html','utf8'),game=fs.readFileSync(root+'/games/tiny-wilds/game.js','utf8');
assert(html.includes('<script src="save.js"></script><script src="game.js"></script>'));assert(html.includes('id="saveNotice"'));assert(html.includes("downloadSave('current')"));assert(html.includes('.save-notice[hidden]{display:none!important}'));
assert(game.includes('saveStore.save(saveData())'));assert(game.includes('Another tab changed Tiny Wilds'));assert(game.includes('saveStore.replace(saveData())'));
console.log('PASS Tiny Wilds saves: invalid data preservation, schema bounds, explicit replacement, conflict blocking, unavailable storage, backup and UI wiring.');
