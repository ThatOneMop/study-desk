// Read-only ownership projection; this never installs, purchases or moves stock.
export function workshopEquipment(state={}){
 const home=Number.isInteger(state.house)&&state.house>=0&&state.house<3?state.house:-1;
 const capacity=home<0?0:[2,4,8][home];
 const owned=Number.isInteger(state.tents)?Math.max(0,Math.min(capacity,state.tents)):0;
 const installed=new Set((Array.isArray(state.installed)?state.installed:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<owned));
 const slots=Array.from({length:8},(_,index)=>({index,owned:index<owned,installed:installed.has(index),pending:!!state.room&&index<owned&&!installed.has(index)}));
 return {home,capacity,owned,installed:installed.size,pending:slots.filter(t=>t.pending).length,next:slots.find(t=>t.pending)?.index??null,room:!!state.room,slots};
}

export function assemblyWording(index){
 if(!Number.isInteger(index)||index<0||index>7)return null;
 return {heading:'TENT '+String(index+1).padStart(2,'0')+' · SET UP HERE',detail:'Owned frame · E to install'};
}
