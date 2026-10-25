export const COOP_PING_TTL=120000;

const finitePoint=value=>value&&Number.isFinite(value.x)&&Number.isFinite(value.z);

export function acceptCoopPing(message,remote,world,now,lastSequence=0,requireRemote=false){
 if(!message||message.type!=='ping'||!Number.isSafeInteger(message.seq)||message.seq<=lastSequence)return Object.freeze({ok:false,reason:'sequence'});
 if(!finitePoint(message)||!world||![world.minX,world.maxX,world.minZ,world.maxZ].every(Number.isFinite)||world.minX>world.maxX||world.minZ>world.maxZ)return Object.freeze({ok:false,reason:'bounds'});
 if(message.x<world.minX||message.x>world.maxX||message.z<world.minZ||message.z>world.maxZ)return Object.freeze({ok:false,reason:'bounds'});
 if(!Number.isFinite(now)||now<0)return Object.freeze({ok:false,reason:'clock'});
 if(requireRemote&&(!finitePoint(remote)||Math.hypot(message.x-remote.x,message.z-remote.z)>8))return Object.freeze({ok:false,reason:'pose'});
 const ping=Object.freeze({x:message.x,z:message.z,receivedAt:now,sequence:message.seq});
 return Object.freeze({ok:true,sequence:message.seq,ping});
}

export function coopPingStatus(ping,viewer,now,ttl=COOP_PING_TTL){
 if(!finitePoint(ping)||!finitePoint(viewer)||!Number.isFinite(ping.receivedAt)||!Number.isFinite(now)||!Number.isFinite(ttl)||ttl<=0)return Object.freeze({active:false,distance:null,remainingSeconds:0});
 const age=Math.max(0,now-ping.receivedAt),active=age<=ttl;
 return Object.freeze({active,distance:active?Math.hypot(ping.x-viewer.x,ping.z-viewer.z):null,remainingSeconds:active?Math.max(0,Math.ceil((ttl-age)/1000)):0});
}
