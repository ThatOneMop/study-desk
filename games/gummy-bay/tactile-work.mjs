// Input gestures are presentation only: inventory commits remain host-authoritative.
export function gestureCredit(kind, dx, dy, memory={}) {
 if(!Number.isFinite(dx)||!Number.isFinite(dy))return 0;
 dx=Math.max(-40,Math.min(40,dx));dy=Math.max(-40,Math.min(40,dy));
 if(kind==='pack')return Math.max(0,dx); // slide towards the wrapper, on the right
 if(kind==='make'||kind==='prepare'||kind==='plant')return Math.abs(dx); // level a surface
 if(kind==='mix'){
  const axis=Math.abs(dx)>Math.abs(dy)?'x':'y',delta=axis==='x'?dx:dy;
  if(Math.abs(delta)<2)return 0;
  const direction=axis;
  if(memory.direction!==direction){memory.direction=direction;memory.run=0;}
  // Straight-line scrubbing stops crediting; a circular motion keeps changing direction.
  const credit=Math.min(Math.abs(delta),Math.max(0,60-(memory.run||0)));
  memory.run=(memory.run||0)+Math.abs(delta);return credit;
 }
 return Math.hypot(dx,dy);
}
export function sealPosition(elapsed){return (1-Math.cos(Math.max(0,elapsed)*Math.PI*1.1))/2;}
export function sealReady(elapsed){const p=sealPosition(elapsed);return p>=.35&&p<=.65;}
export function taskInstruction(kind,step){
 if(kind==='mix'&&step===1)return 'Stir in circles to combine the flavour. A straight swipe only mixes one edge.';
 if(kind==='pack'&&step===0)return 'Slide right to move the gummy into its wrapper.';
 if(kind==='make'&&step===0)return 'Sweep left and right to spread the gummy evenly across the mould.';
 if(['prepare','plant'].includes(kind)&&step===1)return 'Sweep left and right to level the soil.';
 return '';
}

// Pointer Lock keeps client coordinates fixed; free cursors and touch use positions.
// Return a fresh baseline on a mode change so entering/leaving lock cannot jump.
export function workSurfaceMotion(event, previous, locked=false) {
 const finite=Number.isFinite;
 const point={x:finite(event.clientX)?event.clientX:null,y:finite(event.clientY)?event.clientY:null,locked};
 let dx=0,dy=0;
 if(previous?.locked===locked){
  if(locked){dx=finite(event.movementX)?event.movementX:0;dy=finite(event.movementY)?event.movementY:0;}
  else if(point.x!==null&&point.y!==null&&finite(previous.x)&&finite(previous.y)){
   dx=point.x-previous.x;dy=point.y-previous.y;
  }
 }
 return {dx,dy,point};
}
