// Lucky Pier arcade foley: original procedural beeps, dings and clunks.
// Oscillators and a seeded noise burst only, in the same style as bench-audio.
const CUES=Object.freeze({
 coin:{notes:[988,1319],type:'square',dur:.07,gain:.035},
 start:{notes:[523,659,784,1047],type:'square',dur:.08,gain:.035},
 charge:{notes:[330],type:'triangle',dur:.06,gain:.025},
 drop:{notes:[620,380],type:'triangle',dur:.12,gain:.035},
 grab:{notes:[180],type:'sawtooth',dur:.09,gain:.03,noise:.04},
 slip:{notes:[520,260],type:'sine',dur:.2,gain:.04},
 miss:{notes:[220,165],type:'sine',dur:.16,gain:.035},
 thud:{notes:[110],type:'sine',dur:.12,gain:.06,noise:.05},
 roll:{notes:[90],type:'triangle',dur:.35,gain:.03,noise:.06},
 clack:{notes:[700],type:'square',dur:.05,gain:.03,noise:.03},
 hit:{notes:[784,988],type:'square',dur:.09,gain:.035},
 jackpot:{notes:[784,988,1175,1568],type:'square',dur:.09,gain:.04},
 prize:{notes:[659,784,1047,1319],type:'triangle',dur:.11,gain:.045},
 clink:{notes:[1760],type:'sine',dur:.08,gain:.03},
 whack:{notes:[260],type:'square',dur:.07,gain:.05,noise:.07},
 buzz:{notes:[140,135],type:'sawtooth',dur:.18,gain:.04},
 throw:{notes:[300,500],type:'sine',dur:.1,gain:.03},
 rim:{notes:[1100],type:'triangle',dur:.12,gain:.035},
 board:{notes:[160],type:'square',dur:.06,gain:.04,noise:.05},
 swish:{notes:[0],type:'sine',dur:.22,gain:0,noise:.09},
 bounce:{notes:[140],type:'sine',dur:.08,gain:.05},
 ticket:{notes:[2093],type:'square',dur:.025,gain:.018},
 end:{notes:[784,659,523],type:'square',dur:.12,gain:.035},
 ui:{notes:[880],type:'triangle',dur:.05,gain:.025},
 deny:{notes:[200,150],type:'square',dur:.1,gain:.03},
});
let noise=null;
function noiseBuffer(ctx){if(noise&&noise.sampleRate===ctx.sampleRate)return noise;const n=Math.max(1,Math.floor(ctx.sampleRate*.25)),b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);let s=0x2f6b4a1d;for(let i=0;i<n;i++){s^=s<<13;s^=s>>>17;s^=s<<5;d[i]=((s>>>0)/4294967296*2-1)*(1-i/n);}noise=b;return b;}
export function playArcadeCue(ctx,kind,enabled=true){
 const cue=CUES[kind];if(!enabled||!cue||!ctx||typeof ctx.createOscillator!=='function')return false;
 const t0=Number.isFinite(ctx.currentTime)?ctx.currentTime:0;
 try{
  cue.notes.forEach((f,i)=>{if(!f||!cue.gain)return;const at=t0+i*cue.dur*.8,o=ctx.createOscillator(),g=ctx.createGain();o.type=cue.type;o.frequency.setValueAtTime(f,at);g.gain.setValueAtTime(cue.gain,at);g.gain.exponentialRampToValueAtTime(.0001,at+cue.dur);o.connect(g);g.connect(ctx.destination);o.start(at);o.stop(at+cue.dur+.02);});
  if(cue.noise&&typeof ctx.createBufferSource==='function'){const src=ctx.createBufferSource(),g=ctx.createGain();src.buffer=noiseBuffer(ctx);g.gain.setValueAtTime(cue.noise,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+cue.dur);src.connect(g);g.connect(ctx.destination);src.start(t0);src.stop(t0+cue.dur);}
  return true;
 }catch{return false;}
}
export const ARCADE_CUES=Object.freeze(Object.keys(CUES));
