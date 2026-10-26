// Gummy Bay weather: a deterministic, seeded rain schedule. DOM-free so the phone forecast,
// the renderer and the dev tests all agree. Time is in game minutes (540 = 9:00 am).
export const RAIN_RAMP=25;      // minutes to fade a shower in or out
export const WET_DRY=95;        // minutes for roads to dry after rain
export const WEATHER_BUDGET=Object.freeze({
 low:Object.freeze({drops:520,splashes:32,puddles:10,umbrellas:8}),
 medium:Object.freeze({drops:1400,splashes:90,puddles:18,umbrellas:14}),
 high:Object.freeze({drops:2800,splashes:160,puddles:26,umbrellas:22})
});
export const weatherBudget=quality=>WEATHER_BUDGET[quality]||WEATHER_BUDGET.medium;
const hash=n=>{let h=(Math.imul(n|0,2654435761)^0x9e3779b9)>>>0;h^=h>>>16;h=Math.imul(h,2246822507)>>>0;h^=h>>>13;h=Math.imul(h,3266489909)>>>0;return ((h^(h>>>16))>>>0)/4294967296;};
const cache=new Map();
// One shower window per rainy day. Days 1 and 2 are always dry so the tutorial stays sunny.
export function dayWeather(day){
 const d=Math.max(1,Math.floor(Number.isFinite(day)?day:1));
 if(cache.has(d))return cache.get(d);
 let out;
 if(d<=2||hash(d*7+1)>=.32)out=Object.freeze({day:d,rain:false,kind:'clear'});
 else{
  const start=7*60+Math.floor(hash(d*7+2)*11)*60+Math.floor(hash(d*7+5)*4)*15,duration=90+Math.floor(hash(d*7+3)*9)*20,peak=.45+hash(d*7+4)*.55;
  out=Object.freeze({day:d,rain:true,kind:peak>.8?'storm':peak>.6?'rain':'showers',start,end:Math.min(start+duration,23*60+30),peak:Math.round(peak*100)/100});
 }
 if(cache.size>400)cache.clear();cache.set(d,out);return out;
}
const ramp=(t,a,b)=>Math.max(0,Math.min(1,Math.min((t-a)/RAIN_RAMP,(b-t)/RAIN_RAMP)));
export function rainAt(day,time){const w=dayWeather(day);if(!w.rain||!Number.isFinite(time))return 0;return Math.round(ramp(time,w.start,w.end)*w.peak*1000)/1000;}
// Roads soak up over ~30 minutes of rain and dry over WET_DRY minutes afterwards.
export function wetnessAt(day,time){
 const w=dayWeather(day);if(!w.rain||!Number.isFinite(time)||time<w.start)return 0;
 const soak=Math.min(1,(Math.min(time,w.end)-w.start)/30)*Math.min(1,.55+w.peak*.5);
 if(time<=w.end)return Math.round(soak*1000)/1000;
 return Math.round(Math.max(0,soak*(1-(time-w.end)/WET_DRY))*1000)/1000;
}
// Raises the coastal cloud and mist while it rains.
export function weatherSky(base,day,time){
 const r=rainAt(day,time),w=dayWeather(day),pre=w.rain&&time>w.start-90&&time<w.end+60?.35:0;
 return {...base,cloud:Math.min(1,Math.max(base?.cloud||0,pre,r*.95+.1*(r>0))),mist:Math.min(1,(base?.mist||0)+r*.35),rain:r,wet:wetnessAt(day,time)};
}
const clock=m=>{const h=Math.floor(m/60)%24,mm=m%60;return (h%12||12)+(mm?':'+String(mm).padStart(2,'0'):'')+(h<12?'am':'pm');};
export function forecast(day,count=4){
 const out=[];for(let i=0;i<count;i++){const w=dayWeather(day+i);
  out.push(w.rain?{day:w.day,kind:w.kind,icon:w.kind==='storm'?'⛈️':'🌧️',label:(w.kind==='storm'?'Heavy rain':w.kind==='rain'?'Rain':'Showers')+' '+clock(w.start)+'–'+clock(w.end),start:w.start,end:w.end,peak:w.peak}:{day:w.day,kind:'clear',icon:'☀️',label:'Dry and bright',start:null,end:null,peak:0});}
 return out;
}
export const weatherClock=clock;
