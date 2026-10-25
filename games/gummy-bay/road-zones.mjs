const PAVEMENT_OFFSET=8.1,PAVEMENT_HALF=2;
const WORLD_MIN_Z=95-(178*171*10/560),ROAD_BOTTOM=WORLD_MIN_Z+4;

const freezeRects=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const VEHICLE_ROADS=freezeRects([
 {axis:'horizontal',x:0,z:0,w:560,d:12},
 ...[-90,-160,-230,-300,-370,-435].map(z=>({axis:'horizontal',x:0,z,w:555,d:12})),
 ...[-270,-105,105,270].map(x=>({axis:'vertical',x,z:(-7+ROAD_BOTTOM)/2,w:12,d:-7-ROAD_BOTTOM})),
 {axis:'vertical',x:0,z:(-72+ROAD_BOTTOM)/2,w:12,d:-72-ROAD_BOTTOM}
]);
export const PEDESTRIAN_WAYS=freezeRects([
 ...[-90,-160,-230,-300,-370,-435].flatMap(z=>[-1,1].map(side=>({axis:'horizontal',x:0,z:z+side*PAVEMENT_OFFSET,w:555,d:PAVEMENT_HALF*2}))),
 ...[-270,-105,105,270].flatMap(x=>[-1,1].map(side=>({axis:'vertical',x:x+side*PAVEMENT_OFFSET,z:(-7+ROAD_BOTTOM)/2,w:PAVEMENT_HALF*2,d:-7-ROAD_BOTTOM}))),
 ...[-1,1].map(side=>({axis:'vertical',x:side*PAVEMENT_OFFSET,z:(-72+ROAD_BOTTOM)/2,w:PAVEMENT_HALF*2,d:-72-ROAD_BOTTOM})),
 ...[-1,1].flatMap(side=>[-1,1].map(edge=>({axis:'horizontal',x:side*180,z:edge*PAVEMENT_OFFSET,w:180,d:PAVEMENT_HALF*2})))
]);

const finitePoint=point=>point&&Number.isFinite(point.x)&&Number.isFinite(point.z);
const contains=(rect,point)=>Math.abs(point.x-rect.x)<=rect.w/2&&Math.abs(point.z-rect.z)<=rect.d/2;
function pointSurface(point){
 const roads=VEHICLE_ROADS.filter(rect=>contains(rect,point));
 if(roads.length)return {kind:'road',junction:roads.some(rect=>rect.axis==='horizontal')&&roads.some(rect=>rect.axis==='vertical')};
 return {kind:PEDESTRIAN_WAYS.some(rect=>contains(rect,point))?'pavement':'ground',junction:false};
}
const ZONES=Object.freeze({
 road:Object.freeze({key:'road',label:'ROAD',speedLimit:16,guidance:'Keep to the lane'}),
 junction:Object.freeze({key:'junction',label:'JUNCTION',speedLimit:11,guidance:'Ease off and watch crossings'}),
 curb:Object.freeze({key:'curb',label:'CURB EDGE',speedLimit:6,guidance:'Return fully to the road'}),
 pavement:Object.freeze({key:'pavement',label:'PEDESTRIAN WAY',speedLimit:3,guidance:'Crawl and return to the road'}),
 offroad:Object.freeze({key:'offroad',label:'OFF ROAD',speedLimit:8,guidance:'Slow down on uneven ground'})
});

export function drivingSurfaceZone(pose,{halfWidth=.9,halfLength=1.6}={}){
 if(!finitePoint(pose)||!Number.isFinite(pose.angle)||!Number.isFinite(halfWidth)||halfWidth<0||halfWidth>4||!Number.isFinite(halfLength)||halfLength<0||halfLength>8)return ZONES.offroad;
 const samples=[{x:pose.x,z:pose.z}];
 for(const forward of [-halfLength,0,halfLength])for(const side of [-halfWidth,halfWidth])samples.push({x:pose.x+Math.sin(pose.angle)*forward+Math.cos(pose.angle)*side,z:pose.z+Math.cos(pose.angle)*forward-Math.sin(pose.angle)*side});
 const surfaces=samples.map(pointSurface),road=surfaces.filter(surface=>surface.kind==='road').length,pavement=surfaces.filter(surface=>surface.kind==='pavement').length;
 if(road&&surfaces.some(surface=>surface.junction))return ZONES.junction;
 if(road<surfaces.length&&road)return ZONES.curb;
 if(road===surfaces.length)return ZONES.road;
 if(pavement)return ZONES.pavement;
 return ZONES.offroad;
}

export function limitVehicleZoneSpeed(speed,zone,dt){
 if(!Number.isFinite(speed))return 0;
 const limit=Number.isFinite(zone?.speedLimit)?Math.max(0,Math.min(16,zone.speedLimit)):16;
 if(Math.abs(speed)<=limit)return speed;
 const step=Number.isFinite(dt)&&dt>0?Math.min(.06,dt)*12:0;
 return Math.sign(speed)*Math.max(limit,Math.abs(speed)-step);
}

export function roadZoneLine(zone){
 const safe=zone&&typeof zone.label==='string'&&Number.isFinite(zone.speedLimit)?zone:ZONES.offroad;
 return 'SURFACE · '+safe.label+' · '+Math.round(safe.speedLimit*3.6)+' km/h limit · '+safe.guidance;
}
