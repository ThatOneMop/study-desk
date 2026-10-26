export const PHONE_SCREENS=Object.freeze({phone:'MESSAGES',thread:'CONVERSATION',listing:'MARKET LISTING',deals:'DELIVERY ROUND',wallet:'ONLINE CARD',contacts:'CONTACTS'});

const freeze=o=>Object.freeze(o);
export function phoneDeviceStatus(state={},network={},screen='phone'){
 const label=Object.hasOwn(PHONE_SCREENS,screen)?PHONE_SCREENS[screen]:null;if(!label)return null;
 state=state&&typeof state==='object'?state:{};network=network&&typeof network==='object'?network:{};
 const day=Number.isFinite(state.day)&&state.day>=1?Math.min(9999,Math.floor(state.day)):1;
 const minute=Number.isFinite(state.time)?Math.max(0,Math.min(1439,Math.floor(state.time))):0;
 const clock=String(Math.floor(minute/60)).padStart(2,'0')+':'+String(minute%60).padStart(2,'0');
 const role=['host','guest'].includes(network.role)?network.role:'solo',connected=!!network.connected;
 const link=role==='solo'?'LOCAL':connected?'LINK '+role.toUpperCase():'LINK LOST';
 return freeze({model:'GBM-04',carrier:'COASTLINE CELL',screen:label,day,clock,link,signal:role==='solo'?2:connected?4:0});
}
