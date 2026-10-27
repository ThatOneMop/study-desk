// v165: double-tap W to sprint (Shift still works). Pure, so tests can drive it with fake clocks.
export const DOUBLE_TAP_WINDOW=.3;
export function createSprintLatch({window=DOUBLE_TAP_WINDOW}={}){
 let lastUp=-Infinity,lastDown=-Infinity,latched=false,held=false;
 return {
  down(t){if(held)return latched;held=true;latched=t-lastUp<=window&&lastUp-lastDown<=window;lastDown=t;return latched;},
  up(t){held=false;lastUp=t;const was=latched;latched=false;return was;},
  reset(){held=false;latched=false;lastUp=lastDown=-Infinity;},
  get latched(){return latched;},get held(){return held;}
 };
}
// Mouse look: the first click on the world captures the mouse (Esc releases). Touch and
// pens never request a lock, and an opt-out keeps the old hold-and-drag look.
export function wantsPointerLock({active,panel,pointerType,button,locked,optOut,driving=false}){
 return !!active&&!panel&&!locked&&!optOut&&pointerType!=='touch'&&pointerType!=='pen'&&button===0&&!driving;
}
