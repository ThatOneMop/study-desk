const E=require('../games/chalkstep/engine');
module.exports=level=>{const rows=E.walls[level].rows,actions=[];for(const [hand,foot] of [[3,2],[5,4],[6,4]]){for(let i=0;i<2;i++)actions.push(E.limbs[i]+'-'+(hand*5+rows[hand][i]));if(hand!==6)for(let i=0;i<2;i++)actions.push(E.limbs[i+2]+'-'+(foot*5+rows[foot][i]));if(hand===3)actions.push('rest')}return actions};
