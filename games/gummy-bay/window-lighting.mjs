// Existing ground-floor frontage and fitting materials only. Shops remain open;
// player-home occupation is not a claim that every other town building is vacant.
export function occupiedWindowLighting(home,state,{active=true,available=true,night=0,side=1}={}){
 const validHome=Number.isInteger(home)&&home>=0&&home<3;
 const occupied=active&&(home===null||validHome&&available&&state?.room===true&&state.house===home);
 const darkness=Number.isFinite(night)?Math.max(0,Math.min(1,night)):0;
 return {occupied,windowEmission:occupied?darkness*(home===null?.22:.18)*(side===-1?.8:1):0,fittingEmission:occupied?.45:0};
}
