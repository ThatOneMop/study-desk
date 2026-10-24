const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(root+'/games/tiny-wilds/index.html','utf8'),saveSource=fs.readFileSync(root+'/games/tiny-wilds/save.js','utf8'),gameSource=fs.readFileSync(root+'/games/tiny-wilds/game.js','utf8');
function open(raw){
  const dom=new JSDOM(html,{url:'https://example.test/games/tiny-wilds/',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;
  w.HTMLCanvasElement.prototype.getContext=()=>({imageSmoothingEnabled:true});
  w.requestAnimationFrame=()=>1;
  w.confirm=()=>true;
  if(raw!==null)w.localStorage.setItem('tinyWilds2',raw);
  w.eval(saveSource);w.eval(gameSource+';window.__tinyWildsTest={save,replaceStoredSave};');
  return dom;
}
let dom=open('{broken json'),w=dom.window,d=w.document;
assert.equal(d.getElementById('saveNotice').hidden,false);assert.equal(d.getElementById('saveBadge').textContent,'● SAVE PROTECTED');
assert.equal(d.getElementById('preservedSave').hidden,false);assert.equal(d.getElementById('replaceSave').hidden,false);assert.equal(d.getElementById('reloadSave').hidden,true);
assert.equal(w.localStorage.getItem('tinyWilds2'),'{broken json');w.__tinyWildsTest.save();assert.equal(w.localStorage.getItem('tinyWilds2'),'{broken json');
w.confirm=()=>false;w.__tinyWildsTest.replaceStoredSave();assert.equal(w.localStorage.getItem('tinyWilds2'),'{broken json');
w.confirm=()=>true;w.__tinyWildsTest.replaceStoredSave();assert.equal(d.getElementById('saveNotice').hidden,true);assert.equal(d.getElementById('saveBadge').textContent,'● LOCAL SAVE ENABLED');assert.equal(JSON.parse(w.localStorage.getItem('tinyWilds2')).fish.coins,0);dom.window.close();
dom=open('{"fish":{"coins":5}}');w=dom.window;d=w.document;w.localStorage.setItem('tinyWilds2','{"fish":{"coins":99}}');w.__tinyWildsTest.save();
assert.equal(d.getElementById('saveNotice').hidden,false);assert.equal(d.getElementById('saveBadge').textContent,'● NEWER SAVE FOUND');assert.equal(d.getElementById('reloadSave').hidden,false);assert.equal(JSON.parse(w.localStorage.getItem('tinyWilds2')).fish.coins,99);dom.window.close();
console.log('PASS Tiny Wilds save UI: preserved invalid data, cancel/replace recovery, current badge and two-tab conflict warning.');
