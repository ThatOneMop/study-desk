// Cinematic toolkit shared by the loading flyover and story cutscenes.
// Camera moves are data: each shot is a centripetal Catmull-Rom path for the
// lens and one for the look target, eased and arc-length parameterised so the
// camera glides at an even speed. The maths is DOM-free so it can be tested.

const clamp01=t=>Math.max(0,Math.min(1,Number.isFinite(t)?t:0));
export const EASE=Object.freeze({
 linear:t=>clamp01(t),
 smooth:t=>{const u=clamp01(t);return u*u*(3-2*u);},
 smoother:t=>{const u=clamp01(t);return u*u*u*(u*(u*6-15)+10);},
 inOutSine:t=>.5-.5*Math.cos(Math.PI*clamp01(t)),
 inOutCubic:t=>{const u=clamp01(t);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;},
 outCubic:t=>1-Math.pow(1-clamp01(t),3),
 inCubic:t=>Math.pow(clamp01(t),3),
 outQuart:t=>1-Math.pow(1-clamp01(t),4)
});
const easeFn=name=>typeof name==='function'?name:EASE[name]||EASE.inOutSine;

const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const lerp3=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];

// One centripetal (alpha .5) Catmull-Rom segment between p1 and p2, Barry-Goldman form.
// Centripetal parameterisation never overshoots into cusps or loops.
export function catmullRomSegment(p0,p1,p2,p3,t,alpha=.5){
 const knot=(a,b)=>Math.max(1e-4,Math.pow(dist(a,b),alpha));
 const t0=0,t1=t0+knot(p0,p1),t2=t1+knot(p1,p2),t3=t2+knot(p2,p3);
 const u=t1+(t2-t1)*clamp01(t);
 const mix=(a,b,ta,tb)=>lerp3(a,b,(u-ta)/(tb-ta));
 const a1=mix(p0,p1,t0,t1),a2=mix(p1,p2,t1,t2),a3=mix(p2,p3,t2,t3);
 const b1=mix(a1,a2,t0,t2),b2=mix(a2,a3,t1,t3);
 return mix(b1,b2,t1,t2);
}

// An open path through every control point. The ends are mirrored so the camera
// starts and finishes on the first and last points with no stray tangent.
export function createPath(points,{alpha=.5,samples=96}={}){
 const pts=(Array.isArray(points)?points:[]).filter(p=>Array.isArray(p)&&p.length>=3&&p.every(Number.isFinite)).map(p=>[p[0],p[1],p[2]]);
 if(!pts.length)pts.push([0,0,0]);
 if(pts.length===1)return Object.freeze({points:pts,length:0,at:()=>pts[0].slice()});
 const ext=[lerp3(pts[0],pts[1],-1),...pts,lerp3(pts[pts.length-1],pts[pts.length-2],-1)];
 const segs=pts.length-1;
 const raw=s=>{const x=clamp01(s)*segs,i=Math.min(segs-1,Math.floor(x));return catmullRomSegment(ext[i],ext[i+1],ext[i+2],ext[i+3],x-i,alpha);};
 // Arc-length table: constant speed along the curve regardless of point spacing.
 const n=Math.max(8,samples*segs),table=[0];let prev=raw(0),total=0;
 for(let i=1;i<=n;i++){const p=raw(i/n);total+=dist(prev,p);table.push(total);prev=p;}
 function at(u){
  if(total<1e-6)return raw(clamp01(u));
  const target=clamp01(u)*total;let lo=0,hi=n;
  while(hi-lo>1){const mid=(lo+hi)>>1;if(table[mid]<target)lo=mid;else hi=mid;}
  const span=table[hi]-table[lo]||1,f=(target-table[lo])/span;
  return raw((lo+f)/n);
 }
 return Object.freeze({points:pts,length:total,at});
}

// A shot: {duration, cam:[...], look:[...], fov:[from,to]|n, ease, fadeIn, fadeOut, ...extra}
export function createShot(def){
 const cam=createPath(def.cam),look=createPath(def.look||def.cam.map(p=>[p[0],p[1]-1,p[2]-6]));
 const fov=Array.isArray(def.fov)?def.fov:[def.fov??48,def.fov??48];
 const ease=easeFn(def.ease),duration=Math.max(.1,Number(def.duration)||6);
 return Object.freeze({...def,duration,camPath:cam,lookPath:look,
  pose(local){
   const u=ease(local/duration),p=cam.at(u),l=look.at(u),f=fov[0]+(fov[1]-fov[0])*u;
   return {x:p[0],y:p[1],z:p[2],lookX:l[0],lookY:l[1],lookZ:l[2],fov:f};
  }});
}

// A list of shots played back to back. fade is 0 (clear) to 1 (black), used
// for dip-to-black cuts at shot boundaries.
export function createTimeline(defs,{loop=false}={}){
 const shots=defs.map(createShot);const starts=[];let total=0;
 for(const s of shots){starts.push(total);total+=s.duration;}
 function at(time){
  let t=Number.isFinite(time)?Math.max(0,time):0;
  if(loop&&total>0)t%=total;else t=Math.min(t,total);
  let index=shots.length-1;
  for(let i=0;i<shots.length;i++)if(t<starts[i]+shots[i].duration){index=i;break;}
  const shot=shots[index],local=t-starts[index];
  const fi=shot.fadeIn??0,fo=shot.fadeOut??0;
  let fade=0;
  if(fi>0&&local<fi)fade=Math.max(fade,1-EASE.smooth(local/fi));
  if(fo>0&&local>shot.duration-fo)fade=Math.max(fade,EASE.smooth((local-(shot.duration-fo))/fo));
  return {index,shot,local,u:local/shot.duration,time:t,pose:shot.pose(local),fade,done:!loop&&time>=total};
 }
 return Object.freeze({shots,starts,duration:total,loop,at});
}

// Smoothly hands a camera from one pose to another (used for cutscene -> player eye).
export function blendPose(a,b,t,ease='smoother'){
 const u=easeFn(ease)(t),m=(x,y)=>x+(y-x)*u;
 return {x:m(a.x,b.x),y:m(a.y,b.y),z:m(a.z,b.z),lookX:m(a.lookX,b.lookX),lookY:m(a.lookY,b.lookY),lookZ:m(a.lookZ,b.lookZ),fov:m(a.fov,b.fov)};
}

// Beats are timed text/actions inside a cutscene: [{at, until, ...}]
export function activeBeats(beats,time){
 return (Array.isArray(beats)?beats:[]).filter(b=>time>=b.at&&time<(b.until??Infinity));
}

// Letterbox, subtitle, caption and fade overlay. Works on any element with
// classList.toggle, so a mocked DOM can drive it too.
export function createCineOverlay(root){
 const q=sel=>root?.querySelector?.(sel)||null;
 const els={bars:q('.cine-bars'),fade:q('.cine-fade'),sub:q('.cine-sub'),who:q('.cine-sub b'),line:q('.cine-sub span'),cap:q('.cine-cap'),capTitle:q('.cine-cap strong'),capLine:q('.cine-cap small'),skip:q('.cine-skip'),chyron:q('.cine-chyron')};
 let last={};
 const set=(key,value,apply)=>{if(last[key]===value)return;last[key]=value;apply(value);};
 return {
  els,
  show(on){set('show',!!on,v=>{if(root){root.hidden=!v;root.classList?.toggle?.('on',v);}});},
  bars(on){set('bars',!!on,v=>els.bars?.classList?.toggle?.('on',v));},
  fade(v){const f=Math.round(clamp01(v)*100)/100;set('fade',f,x=>{if(els.fade)els.fade.style.opacity=String(x);});},
  subtitle(who,text){set('sub',(who||'')+'|'+(text||''),()=>{if(els.who)els.who.textContent=who||'';if(els.line)els.line.textContent=text||'';els.sub?.classList?.toggle?.('on',!!text);});},
  caption(title,line){set('cap',(title||'')+'|'+(line||''),()=>{if(els.capTitle)els.capTitle.textContent=title||'';if(els.capLine)els.capLine.textContent=line||'';els.cap?.classList?.toggle?.('on',!!title);});},
  chyron(html){set('chyron',html||'',v=>{if(els.chyron){els.chyron.innerHTML=v;els.chyron.classList?.toggle?.('on',!!v);}});},
  reset(){last={};}
 };
}

// An old-fashioned two-tone payphone ring made from oscillators. No samples.
export function playPhoneRing(ctx,destination,{when=0,rings=2,volume=.16}={}){
 if(!ctx||!destination)return 0;
 try{
  const start=ctx.currentTime+Math.max(0,when);
  for(let r=0;r<rings;r++){
   const t0=start+r*3;
   const g=ctx.createGain();g.gain.setValueAtTime(0,t0);g.connect(destination);
   for(const hz of [440,480]){const o=ctx.createOscillator();o.type='sine';o.frequency.value=hz;o.connect(g);o.start(t0);o.stop(t0+2.05);}
   // A 20 Hz tremolo makes it read as a bell rather than a dial tone.
   for(let k=0;k<40;k++){const tk=t0+k*.05;g.gain.setValueAtTime(volume,tk);g.gain.setValueAtTime(volume*.25,tk+.025);}
   g.gain.setValueAtTime(0,t0+2.02);
  }
  return rings;
 }catch(e){return 0;}
}

// A soft filtered whoosh for cuts and the hand-off.
export function playWhoosh(ctx,destination,{volume=.08,duration=.9}={}){
 if(!ctx||!destination)return false;
 try{
  const n=Math.floor(ctx.sampleRate*duration),buf=ctx.createBuffer(1,n,ctx.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<n;i++){const e=Math.sin(Math.PI*i/n);d[i]=(Math.random()*2-1)*e*e;}
  const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();
  src.buffer=buf;f.type='bandpass';f.frequency.setValueAtTime(300,ctx.currentTime);f.frequency.exponentialRampToValueAtTime(1400,ctx.currentTime+duration);f.Q.value=.8;g.gain.value=volume;
  src.connect(f);f.connect(g);g.connect(destination);src.start();return true;
 }catch(e){return false;}
}
