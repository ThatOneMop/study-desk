// Greys out panel action buttons whose action is out of reach, and restores only
// the buttons it disabled itself. Buttons disabled for other reasons are left alone.
export function reachArgs(onclick,fallback){
 const m=/^\s*action\(\s*'([A-Za-z]+)'\s*(?:,\s*(-?\d+)|,\s*'([^']*)')?/.exec(typeof onclick==='string'?onclick:'');
 return m?{k:m[1],a:m[2]!==undefined?Number(m[2]):m[3]!==undefined?m[3]:fallback}:null;
}
export function gateButtons(buttons,access,fallback){
 let off=0;
 for(const b of buttons||[]){
  const args=reachArgs(b.getAttribute?.('onclick'),fallback);if(!args)continue;
  const status=access(args.k,args.a),out=!!(status&&!status.ok);
  b.dataset??={};
  if(out&&!b.disabled){b.disabled=true;b.dataset.reachOff='1';b.title=status.reason||'Move closer';b.classList?.add('out-of-reach');}
  else if(!out&&b.dataset.reachOff){b.disabled=false;delete b.dataset.reachOff;b.title='';b.classList?.remove('out-of-reach');}
  if(b.dataset.reachOff)off++;
 }
 return off;
}
