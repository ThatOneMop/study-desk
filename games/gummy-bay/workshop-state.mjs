// Pure visual projections: never mutate inventories or save data.
export function stockSlots(stock, limit=12) {
 const result=[];
 for(let type=0;type<stock.length&&result.length<limit;type++)
  for(let n=0;n<Math.min(limit,Math.max(0,Math.floor(stock[type]||0)))&&result.length<limit;n++)result.push(type);
 return result;
}
export function taskFraction(task, steps) {
 if(!task||!steps?.length)return 0;
 return Math.min(1,Math.max(0,(task.step+Math.min(1,task.progress/steps[task.step][2]))/steps.length));
}
export function restoreComfort(text){
 let saved={};try{saved=JSON.parse(text)||{}}catch{}
 return {bob:saved.bob!==false,sprintFov:saved.sprintFov!==false,stationFocus:saved.stationFocus===true};
}
