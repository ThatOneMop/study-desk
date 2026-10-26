// Caught. A fine of 30% of the cash in hand (at least $20, never more than you
// are holding), the gummies you are carrying, then a wake-up at 07:00.
// Stored stock, the bank and equipment are not touched.
// The booking shot rides the shared cinematic timeline (letterbox, flash, camera).
import {activeBeats,createTimeline} from './cinematics.mjs?v=132';
export const FINE_SHARE=0.3;
export const FINE_FLOOR=20;
export const WAKE_AT=7*60;

export function bustFine(cash){
 const carried=Number.isFinite(cash)?Math.max(0,cash):0;
 if(carried<=0)return 0;
 return Math.min(carried,Math.max(FINE_FLOOR,Math.round(carried*FINE_SHARE)));
}
export function wakeClock(day,time){
 const safeDay=Number.isFinite(day)&&day>=1?Math.floor(day):1;
 const minute=Number.isFinite(time)?time:0;
 if(minute<WAKE_AT)return {day:safeDay,time:WAKE_AT};
 return {day:safeDay+1,time:WAKE_AT};
}
export function applyBust(state){
 const source=state&&typeof state==='object'?state:{};
 const fine=bustFine(source.cash);
 const carried={};
 let seized=0;
 for(const key of ['raw','gummies','packs']){
  const list=Array.isArray(source[key])?source[key]:[];
  carried[key]=list.map(qty=>{const n=Number.isFinite(qty)?qty:0;seized+=Math.max(0,n);return 0;});
 }
 const clock=wakeClock(source.day,source.time);
 return {
  fine,seized,wake:WAKE_AT,
  state:{
   cash:Math.max(0,(Number.isFinite(source.cash)?source.cash:0)-fine),
   day:clock.day,
   time:clock.time,
   heat:Math.min(Number.isFinite(source.heat)?source.heat:0,15),
   ...carried
  }
 };
}
// Close on the face, a white flash, the word BUSTED, then back out. About three seconds.
export function bustedTimeline(){
 return createTimeline([
  {duration:.7,cam:[[0,1.65,2.8],[0,1.5,1.15]],look:[[0,1.45,0],[0,1.48,0]],fov:[52,28],ease:'outCubic',fadeIn:.15},
  {duration:1.6,cam:[[0,1.5,1.15],[0,1.5,1.22]],look:[[0,1.48,0],[0,1.48,0]],fov:[28,30],ease:'linear'},
  {duration:.9,cam:[[0,1.5,1.22],[0,1.62,2.4]],look:[[0,1.48,0],[0,1.45,0]],fov:[30,50],ease:'inOutSine',fadeOut:.4}
 ]);
}
export const BUSTED_BEATS=Object.freeze([{at:.45,until:2.55,text:'BUSTED'}]);
export function bustedSample(scene,time){
 const at=scene.at(Number.isFinite(time)?time:0);
 const beats=activeBeats(BUSTED_BEATS,at.time);
 const text=beats.find(beat=>beat.text)?.text||'';
 const letterbox=at.time>.28&&at.time<scene.duration-.35?0.12:0;
 const flash=at.time>=.62&&at.time<=.78?1:at.fade;
 return {pose:at.pose,fade:at.fade,done:at.done,text,letterbox,flash,t:at.time};
}
// Original booking photo drawn on a canvas. No photos, no downloaded faces.
export function paintMugshot(canvas,seed=1){
 if(!canvas||typeof canvas.getContext!=='function')return null;
 const ctx=canvas.getContext('2d');if(!ctx)return null;
 const w=canvas.width||128,h=canvas.height||128;
 const n=Math.abs(Math.floor(Number.isFinite(seed)?seed:1));
 ctx.fillStyle='#e7d3bf';ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#1c2430';ctx.fillRect(0,0,w,h*0.22);
 ctx.fillStyle='#d7b08a';ctx.beginPath();ctx.ellipse(w*0.5,h*0.58,w*0.28,h*0.32,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#2a211c';ctx.fillRect(w*0.28,h*0.3,w*0.44,h*0.12);
 ctx.fillStyle='#1b140f';
 const lid=h*(0.05+(n%3)*0.01);
 ctx.fillRect(w*0.32,h*0.48,w*0.12,lid);ctx.fillRect(w*0.56,h*0.48,w*0.12,lid);
 ctx.fillStyle='#6b3030';ctx.fillRect(w*0.42,h*0.7,w*0.16,h*0.015);
 ctx.fillStyle='#f4efe4';ctx.font=`700 ${Math.round(h*0.09)}px sans-serif`;ctx.textAlign='center';
 ctx.fillText('SUGAR SQUAD',w*0.5,h*0.14);
 return canvas;
}
