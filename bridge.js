/* Study Desk keyboard/visibility bridge — MIT License.
Copyright (c) 2026 Study Desk contributors
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the Software), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(()=>{
'use strict';
const native={raf:requestAnimationFrame.bind(window),caf:cancelAnimationFrame.bind(window),timeout:setTimeout.bind(window),clearTimeout:clearTimeout.bind(window),now:performance.now.bind(performance),date:Date.now.bind(Date)};
let suspended=false,pauseAt=0,totalPaused=0,nextId=0,hits=[];
const frames=new Map(),timers=new Map(),held=new Map(),heldMouse=new Map(),heldPointers=new Map(),contexts=new Set(),resumeContexts=new Set(),media=new Set(),resumeMedia=new Set();
const clock=()=> (suspended?pauseAt:native.now())-totalPaused;
try{Object.defineProperty(performance,'now',{value:clock,configurable:true})}catch{}
Date.now=()=>native.date()-totalPaused-(suspended?native.now()-pauseAt:0);
function scheduleFrame(id){const rec=frames.get(id);if(!rec||suspended)return;rec.native=native.raf(()=>{if(suspended)return;frames.delete(id);rec.fn(clock())})}
window.requestAnimationFrame=fn=>{const id=++nextId;frames.set(id,{fn});scheduleFrame(id);return id};
window.cancelAnimationFrame=id=>{const rec=frames.get(id);if(rec?.native)native.caf(rec.native);frames.delete(id)};
function scheduleTimer(id){const r=timers.get(id);if(!r||suspended)return;r.due=clock()+r.remaining;r.native=native.timeout(()=>{if(suspended)return;if(!r.interval)timers.delete(id);else r.remaining=r.delay;try{if(typeof r.fn==='function')r.fn(...r.args);else Function(String(r.fn))()}finally{if(r.interval&&timers.has(id))scheduleTimer(id)}},r.remaining)}
function timer(fn,delay,args,interval){const id=++nextId;delay=Math.max(interval?4:0,Number(delay)||0);timers.set(id,{fn,args,delay,remaining:delay,interval});scheduleTimer(id);return id}
window.setTimeout=(fn,delay,...args)=>timer(fn,delay,args,false);window.setInterval=(fn,delay,...args)=>timer(fn,delay,args,true);
window.clearTimeout=window.clearInterval=id=>{const r=timers.get(id);if(r)native.clearTimeout(r.native);else native.clearTimeout(id);timers.delete(id)};
for(const key of ['AudioContext','webkitAudioContext']){const C=window[key];if(C)window[key]=class extends C{constructor(...args){super(...args);contexts.add(this);if(suspended)this.suspend().catch(()=>{})}resume(){if(suspended){resumeContexts.add(this);return Promise.resolve()}return super.resume()}}}
if(window.HTMLMediaElement){const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(...args){media.add(this);if(suspended)return Promise.resolve();return play.apply(this,args)}}
window.addEventListener('mousedown',e=>{if(!suspended)heldMouse.set(e.button,{target:e.target,clientX:e.clientX,clientY:e.clientY})},true);
window.addEventListener('mouseup',e=>heldMouse.delete(e.button),true);
window.addEventListener('pointerdown',e=>{if(!suspended)heldPointers.set(e.pointerId,{target:e.target,capture:null,pointerId:e.pointerId,pointerType:e.pointerType,isPrimary:e.isPrimary,clientX:e.clientX,clientY:e.clientY})},true);
window.addEventListener('pointermove',e=>{const r=heldPointers.get(e.pointerId);if(r){r.clientX=e.clientX;r.clientY=e.clientY}},true);
window.addEventListener('gotpointercapture',e=>{const r=heldPointers.get(e.pointerId);if(r)r.capture=e.target},true);
window.addEventListener('lostpointercapture',e=>{const r=heldPointers.get(e.pointerId);if(r?.capture===e.target)r.capture=null},true);
for(const type of ['pointerup','pointercancel'])window.addEventListener(type,e=>heldPointers.delete(e.pointerId),true);
function releaseInputs(){
 for(const r of held.values()){const e=new KeyboardEvent('keyup',{key:r.key,code:r.code,keyCode:r.keyCode,which:r.keyCode,bubbles:true});(r.target?.isConnected?r.target:document).dispatchEvent(e)}held.clear();
 // Preserve button identity and element listeners (e.g. Forge Arena right fire).
 // Snapshot before dispatch: capture listeners remove entries on each release.
 const mouse=[...heldMouse];heldMouse.clear();
 for(const [button,r] of mouse)(r.target?.isConnected?r.target:document).dispatchEvent(new MouseEvent('mouseup',{button,buttons:0,clientX:r.clientX,clientY:r.clientY,bubbles:true}));
 // Retain the legacy global left-button reset for untracked/pre-bridge input.
 if(!mouse.some(([button])=>button===0))document.dispatchEvent(new MouseEvent('mouseup',{button:0,buttons:0,bubbles:true}));
 // Cancel, rather than commit, each held gesture at its capture owner/original
 // control. Synthetic events alone do not release native pointer capture.
 const pointers=[...heldPointers.values()];heldPointers.clear();
 for(const r of pointers){
  const owner=r.capture||r.target,target=owner?.isConnected?owner:document;
  try{const C=window.PointerEvent||MouseEvent;target.dispatchEvent(new C('pointercancel',{pointerId:r.pointerId,pointerType:r.pointerType,isPrimary:r.isPrimary,clientX:r.clientX,clientY:r.clientY,button:-1,buttons:0,bubbles:true}))}
  finally{try{owner?.releasePointerCapture?.(r.pointerId)}catch{}}
 }
 // Keep legacy document-level resets for games without tracked pointers.
 for(const type of ['pointerup','pointercancel']){try{document.dispatchEvent(new MouseEvent(type,{bubbles:true,buttons:0}))}catch{}}
 window.dispatchEvent(new Event('blur'));
}
function suspend(value){if(suspended===value)return;if(value){releaseInputs();pauseAt=native.now();suspended=true;for(const r of frames.values())if(r.native)native.caf(r.native);for(const r of timers.values()){r.remaining=Math.max(0,r.due-clock());native.clearTimeout(r.native)}document.exitPointerLock?.();if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});for(const c of contexts)if(c.state==='running'){resumeContexts.add(c);c.suspend().catch(()=>{})}for(const m of new Set([...media,...document.querySelectorAll('audio,video')]))if(!m.paused){resumeMedia.add(m);m.pause()}}else{totalPaused+=native.now()-pauseAt;suspended=false;for(const id of frames.keys())scheduleFrame(id);for(const id of timers.keys())scheduleTimer(id);for(const c of resumeContexts)c.resume().catch(()=>{});resumeContexts.clear();for(const m of resumeMedia)m.play().catch(()=>{});resumeMedia.clear()}}
window.addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin)return;if(e.data?.type==='study-visibility')suspend(!e.data.visible)});
function typing(e){return e.target?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"])')}
window.addEventListener('keydown',e=>{
 if(typing(e)||e.isComposing)return;
 const plainP=e.key.toLowerCase()==='p'&&!e.ctrlKey&&!e.altKey&&!e.metaKey;
 if(plainP&&parent!==window){e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;const now=native.now();hits=hits.filter(t=>now-t<=1000);hits.push(now);if(hits.length===3){hits=[];parent.postMessage({type:'study-toggle'},location.origin)}return}
 if(suspended){e.preventDefault();e.stopImmediatePropagation();return}
 hits=[];held.set(e.code||e.key,{key:e.key,code:e.code,keyCode:e.keyCode,target:e.target});
},true);
window.addEventListener('keyup',e=>{held.delete(e.code||e.key);if(e.key.toLowerCase()==='p'&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&!typing(e)&&parent!==window){e.preventDefault();e.stopImmediatePropagation()}},true);
// Visible integration surface for targeted checks; does not expose game saves.
window.StudyBridge={get paused(){return suspended},clock};
})();
