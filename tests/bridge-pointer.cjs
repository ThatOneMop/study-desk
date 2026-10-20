const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('node:assert/strict');
const dom=new JSDOM('<iframe></iframe>',{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
const parent=dom.window,w=parent.document.querySelector('iframe').contentWindow,d=w.document;
// jsdom has no native PointerEvent/capture; model identity and capture ownership.
w.PointerEvent=class extends w.MouseEvent{constructor(type,o={}){super(type,o);for(const k of ['pointerId','pointerType','isPrimary'])Object.defineProperty(this,k,{value:o[k]});}};
w.eval(fs.readFileSync(__dirname+'/../bridge.js','utf8'));
const a=d.createElement('canvas'),b=d.createElement('button');d.body.append(a,b);
const captures=new Map(),cancels=[],ups=[];
function pointer(type,id,target=a,kind='touch'){target.dispatchEvent(new w.PointerEvent(type,{pointerId:id,pointerType:kind,isPrimary:id===7,button:0,buttons:type==='pointerdown'?1:0,clientX:35,clientY:46,bubbles:true}));}
for(const element of [a,b]){
 element.setPointerCapture=id=>{captures.set(id,element);pointer('gotpointercapture',id,element)};
 element.releasePointerCapture=id=>{if(captures.get(id)===element){captures.delete(id);pointer('lostpointercapture',id,element)}};
 element.addEventListener('pointercancel',e=>cancels.push({target:element,id:e.pointerId,kind:e.pointerType,x:e.clientX,buttons:e.buttons}));
 element.addEventListener('pointerup',e=>ups.push(e.pointerId));
}
function visible(value){w.dispatchEvent(new w.MessageEvent('message',{source:parent,origin:w.location.origin,data:{type:'study-visibility',visible:value}}));}
pointer('pointerdown',7);a.setPointerCapture(7);visible(false);
assert.equal(captures.size,0,'pause releases active canvas pointer capture');
assert.deepEqual(cancels,[{target:a,id:7,kind:'touch',x:35,buttons:0}],'cancel reaches actual element with pointer identity');
assert.deepEqual(ups,[],'pause does not commit a pointerup action at the element');
visible(false);assert.equal(cancels.length,1,'repeated pause is idempotent');
visible(true);pointer('pointerdown',7);pointer('pointerdown',8,b,'pen');a.setPointerCapture(7);b.setPointerCapture(8);visible(false);
assert.equal(captures.size,0);assert.deepEqual(cancels.slice(-2).map(e=>e.id),[7,8]);
visible(true);pointer('pointerdown',9);pointer('pointerup',9);let n=cancels.length;visible(false);assert.equal(cancels.length,n,'released pointers are not cancelled again');
visible(true);pointer('pointerdown',10);pointer('pointercancel',10);n=cancels.length;visible(false);assert.equal(cancels.length,n,'native cancellation removes tracking');
visible(true);pointer('pointerdown',11);b.setPointerCapture(11);visible(false);assert.equal(cancels.at(-1).target,b,'capture transfer routes cancellation to current owner');
visible(true);pointer('pointerdown',12);a.setPointerCapture(12);a.remove();let detached;
d.addEventListener('pointercancel',e=>{if(e.pointerId===12)detached=e.pointerId});visible(false);assert.equal(detached,12);assert.equal(captures.size,0,'detached capture is released');
parent.close();console.log('PASS bridge pointer: target cancellation, touch/pen identity, multiple holds, capture ownership/release, native completion, detached target, idempotence, no pointerup activation');
