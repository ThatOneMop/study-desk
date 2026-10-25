export const RESIDENT_ANIMATION_POLICY=Object.freeze({
 idleEnter:.06,
 moveEnter:.08,
 runEnter:2.25,
 runExit:1.85,
 idleMoveBlend:.2,
 gaitBlend:.24,
 gestureBlend:.16
});

const gait=name=>name==='Walk'||name==='Run';
export function residentLocomotionClip(speed=0,current='Idle'){
 speed=Number.isFinite(speed)?Math.max(0,speed):0;
 if(current==='Walk'){
  if(speed<=RESIDENT_ANIMATION_POLICY.idleEnter)return 'Idle';
  return speed>=RESIDENT_ANIMATION_POLICY.runEnter?'Run':'Walk';
 }
 if(current==='Run'){
  if(speed<=RESIDENT_ANIMATION_POLICY.idleEnter)return 'Idle';
  return speed<RESIDENT_ANIMATION_POLICY.runExit?'Walk':'Run';
 }
 return speed>RESIDENT_ANIMATION_POLICY.moveEnter?(speed>2.1?'Run':'Walk'):'Idle';
}

export function residentActionRate(clip,speed=0,scale=.86){
 speed=Number.isFinite(speed)?Math.max(0,speed):0;scale=Number.isFinite(scale)&&scale>0?scale:.86;
 if(clip==='Walk')return Math.max(.25,Math.min(2.4,speed/(1.2*scale)));
 if(clip==='Run')return Math.max(.6,Math.min(2,speed/(3.4*scale)));
 return 1;
}

export function residentTransitionPlan(from,to,fromTime=0,fromDuration=1,toDuration=1){
 from=typeof from==='string'?from:'';to=typeof to==='string'?to:'';
 fromDuration=Number.isFinite(fromDuration)&&fromDuration>0?fromDuration:1;toDuration=Number.isFinite(toDuration)&&toDuration>0?toDuration:1;
 const phaseSynced=gait(from)&&gait(to),phase=phaseSynced?((Number.isFinite(fromTime)?fromTime:0)%fromDuration+fromDuration)%fromDuration/fromDuration:0;
 const fade=phaseSynced?RESIDENT_ANIMATION_POLICY.gaitBlend:gait(from)!==gait(to)?RESIDENT_ANIMATION_POLICY.idleMoveBlend:RESIDENT_ANIMATION_POLICY.gestureBlend;
 return Object.freeze({from,to,phaseSynced,phase,targetTime:phase*toDuration,fade});
}

export function applyResidentTransition(actions,from,to){
 const previous=actions?.[from],next=actions?.[to];if(!next)return null;
 const plan=residentTransitionPlan(from,to,previous?.time,previous?.getClip?.().duration,next.getClip?.().duration);
 previous?.fadeOut(plan.fade);next.reset();if(plan.phaseSynced)next.time=plan.targetTime;next.fadeIn(plan.fade).play();return plan;
}
