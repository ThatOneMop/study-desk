// v176: slopes for the districts past the old city. Hillcrest climbs, Tin Terrace
// rolls a little, and the beach on the near edge is left alone. Heights stay
// gentle enough for the existing step (0.35 m) and 45° slope limit.
import {outerHeight} from './outer-districts.mjs?v=175';

const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};

function hillcrest(x,z){
 if(z>-500||z<-800||x<-140||x>190)return 0;
 const climb=smooth((-500-z)/270);
 const across=Math.max(0,1-Math.abs(x-25)/160);
 let h=16*climb*(.45+.55*across);
 const knolls=[[48,-640,55,5.2],[100,-720,40,3.8],[-30,-700,48,4.2]];
 for(const [kx,kz,r,amp] of knolls){
  const d=Math.hypot((x-kx)/r,(z-kz)/(r*.9));
  if(d>=1)continue;
  const u=1-d*d;h+=amp*u*u;
 }
 return h;
}

function terrace(x,z){
 if(x>-330||x<-580||z>55||z<-180)return 0;
 const nx=(x+450)/110,nz=(z+60)/90;
 return .85*(.5+.5*Math.sin(nx*Math.PI)*Math.sin(nz*Math.PI));
}

// Extra height inside the new districts. Zero in the old city and on the beach.
export function districtTerrainHeight(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return 0;
 return hillcrest(x,z)+terrace(x,z);
}

// What the outer roads, people and vans stand on: the river arch plus these slopes.
export function districtGroundHeight(x,z){
 return (outerHeight(x,z)||0)+districtTerrainHeight(x,z);
}
