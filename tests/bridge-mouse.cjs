const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('assert');
const root=__dirname+'/../';
const dom=new JSDOM('<iframe></iframe>',{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
const parent=dom.window,w=parent.document.querySelector('iframe').contentWindow,d=w.document;
w.eval(fs.readFileSync(root+'bridge.js','utf8'));
const canvas=d.createElement('canvas');d.body.append(canvas);
function mouse(type,button,target=canvas){target.dispatchEvent(new w.MouseEvent(type,{button,buttons:type==='mouseup'?0:button===2?2:1,bubbles:true}))}
function visible(value,source=parent,origin=w.location.origin){w.dispatchEvent(new w.MessageEvent('message',{source,origin,data:{type:'study-visibility',visible:value}}))}
// Execute the actual current Forge Arena release handler, not a substitute engine.
const forge=fs.readFileSync(root+'games/forge-arena/index.html','utf8');
const release=[...forge.matchAll(/this\.onUp=e=>\{if\(e\.button===0\)this\.mouse\.left=false;if\(e\.button===2\)this\.mouse\.right=false\}/g)].pop();
assert(release,'Forge Arena button-specific release handler exists');
const battle={mouse:{left:false,right:false}};
new Function(release[0]).call(battle);w.addEventListener('mouseup',battle.onUp);
canvas.addEventListener('mousedown',e=>{if(e.button===0)battle.mouse.left=true;if(e.button===2)battle.mouse.right=true});
let clicks=0,canvasUps=[],windowUps=[];
canvas.addEventListener('click',()=>clicks++);
canvas.addEventListener('mouseup',e=>canvasUps.push(e.button));
w.addEventListener('mouseup',e=>windowUps.push(e.button));
mouse('mousedown',2);assert(battle.mouse.right);
visible(false,w);assert(!w.StudyBridge.paused,'ignore non-parent messages');
visible(false,parent,'https://other.test');assert(!w.StudyBridge.paused,'ignore foreign origins');
visible(false);assert(!battle.mouse.right,'pause releases Forge Arena right hold');
assert(canvasUps.includes(2),'release reaches original element listener');
assert.equal(clicks,0,'cleanup never synthesizes a click');
visible(true);mouse('mousedown',0);mouse('mousedown',2);visible(false);
assert.deepEqual(battle.mouse,{left:false,right:false},'release both held buttons');
const count=windowUps.length;visible(false);assert.equal(windowUps.length,count,'repeated pause is idempotent');
visible(true);mouse('mousedown',2);mouse('mouseup',2);const rights=windowUps.filter(b=>b===2).length;visible(false);
assert.equal(windowUps.filter(b=>b===2).length,rights,'already released right button is not replayed');
visible(true);mouse('mousedown',2);canvas.remove();visible(false);
assert(!battle.mouse.right,'detached target falls back to document/window');
assert.equal(clicks,0);parent.close();
console.log('PASS bridge mouse: Forge Arena right hold, multiple buttons, target routing, detached target, idempotence, no clicks, message origin guards');
