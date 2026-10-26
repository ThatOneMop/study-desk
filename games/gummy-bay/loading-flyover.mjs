import {createTimeline} from './cinematics.mjs?v=129';
// Loading-screen and title backdrop: a slow golden-hour tour of Gummy Bay.
// Six shots: a city overview, then districts and landmarks, each a short Catmull-Rom glide, joined by dip-to-black
// cuts. Time of day is locked to 17:20: a warm late-afternoon sun.
export const FLYOVER_MINUTES=17*60+20;
export const FLYOVER_SHOTS=Object.freeze([
 {district:'Gummy Bay',line:'Population: suspiciously sweet',duration:6,cam:[[-44,30,78],[-30,27,56],[-18,25,36]],look:[[4,0,-50],[6,0,-60],[8,0,-70]],fov:[52,50],fadeIn:.8,fadeOut:.5},
 {district:'Old Town',line:'Corner shops and a nine o’clock curfew',duration:6,cam:[[6,4.5,62],[5,5,46],[4,5.5,30]],look:[[-2,4,-10],[-3,4.5,-20],[-4,5,-30]],fov:50,fadeIn:.5,fadeOut:.5},
 {district:'Main Street',line:'Where it all started',duration:6,cam:[[30,18,40],[16,15.5,28],[4,14,18]],look:[[-30,6,-38],[-36,6,-42],[-42,6,-46]],fov:[50,48],fadeIn:.5,fadeOut:.5},
 {district:'Palm Court',line:'Rent due Sunday. Every Sunday.',duration:6,cam:[[14,7,46],[2,8,48],[-10,9,49]],look:[[-25,1.5,19],[-25,1.5,18],[-25,1.5,17]],fov:50,fadeIn:.5,fadeOut:.5},
 {district:'Bay Road',line:'Every delivery starts somewhere',duration:6,cam:[[72,4,3],[54,4.5,2],[38,5,1]],look:[[-20,4,-6],[-26,4.2,-7],[-32,4.4,-8]],fov:50,fadeIn:.5,fadeOut:.5},
 {district:'Driftwood Campsite',line:'Home, for now',duration:6,cam:[[-104,11,52],[-94,8,46],[-84,6,41]],look:[[-58,2.4,27],[-58,2.2,27],[-58,2,27]],fov:[50,46],fadeIn:.5,fadeOut:.6}
]);
export const FLYOVER=createTimeline(FLYOVER_SHOTS,{loop:true});
export function flyoverAt(seconds){const at=FLYOVER.at(seconds);return {...at,district:at.shot.district,line:at.shot.line};}
