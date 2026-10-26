// Curfew and heat change how far a patrol notices the player.
export const DAY_NOTICE=11,HEAT_NOTICE=26,CURFEW_NOTICE=45;
export const DAY_SUSPICION=24,HEAT_SUSPICION=65,CURFEW_SUSPICION=48;
export function policeNotice(heat,curfew){
 const hot=(heat||0)>=40;
 return {
  range:curfew?Math.max(HEAT_NOTICE,CURFEW_NOTICE):(hot?HEAT_NOTICE:DAY_NOTICE),
  suspicion:Math.max(DAY_SUSPICION,hot?HEAT_SUSPICION:0,curfew?CURFEW_SUSPICION:0)
 };
}
