'use strict';
// Authored reference allocations; these are not claims of a unique or optimal solution.
const rooms=[[3,2,0],[5,0,4,3],[2,5,4,3,0],[0,5,1,3,2,4],[3,1,5,4,0,2]],screens=[[],[],[2],[2],[4]];
function actions(n){return[...rooms[n].map((_,guest)=>({type:'ask',guest})),...rooms[n].map((room,guest)=>({type:'place',guest,room})),...screens[n].map(room=>({type:'screen',room})),{type:'bell'}];}
module.exports={rooms,screens,actions};
