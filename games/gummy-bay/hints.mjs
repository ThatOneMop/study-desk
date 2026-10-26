// Thirty original loading-screen tips. Short, practical and a little deadpan.
export const HINTS=Object.freeze([
 'Answer the payphone first. Gramps hates waiting, and he’s calling collect.',
 'Room 04 at Palm Court is $75. A roof beats a camper with a parking ticket.',
 'Keep $50 aside on your first morning. The corner store doesn’t do credit.',
 'Hold Shift to jog. Your stamina bar refills when you walk.',
 'Press E on anything with a prompt. Most of the town is hands-on.',
 'Tents grow faster when you water on time. Soggy roots grow nothing.',
 'Wrap every gummy before you sell it. Loose sweets look suspicious.',
 'The Sugar Squad patrols on foot. If an officer stops you, H means comply.',
 'Curfew starts at 9 PM. Be indoors, or be very good at hiding.',
 'Customers text you. Reply fast and they come back with friends.',
 'Set your own price, but greedy offers get “seen” and no reply.',
 'A night’s sleep in Room 04 clears your heat. A quiet day is a cheap day.',
 'Mixing a servo ingredient can turn a $30 gummy into a $90 one. Or into soup.',
 'Some flavour combos are brilliant. Some are Expired Marshmallow.',
 'Your card pays at shops; your wallet pays at the door. Keep both topped up.',
 'Hire a gardener once you can afford one. Your time is worth more than watering.',
 'Sleep skips to 8 AM tomorrow. Tents keep growing while you snore.',
 'Your phone holds texts, contacts and deals. The town doesn’t stop while you scroll.',
 'Mayor Plum’s Sugar-Free Bay Act bans unlicensed sweets. Every single one.',
 'Nobody in Gummy Bay talks about the Great Jelly Incident. Everybody remembers it.',
 'Jules works the late shift and always wants something sweet. Remember regulars.',
 'Press M for the street guide. Old Town is the place to start.',
 'The pier is lovely at golden hour, and terrible for hiding anything.',
 'Officers lose interest if they can’t see you. Corners are your friends.',
 'Upgrade the press to make batches of four. Bigger batches, fewer trips.',
 'A tidy workshop is a fast workshop. Place your tent where you can reach it.',
 'Co-op: share a code with a friend and run the business together.',
 'Your save lives in this browser. Export it from Settings to keep a copy.',
 'Gramps’ rule: never sell to a seagull. They don’t pay and they tell everyone.',
 'Gramps’s notebook (J) has his equipment list. Keep fifty dollars aside.'
]);

export const HINT_SECONDS=6;

// Stable rotation: the same seconds and offset always show the same tip.
export function hintAt(seconds,offset=0){
 const n=HINTS.length,i=Math.floor((Number.isFinite(seconds)?Math.max(0,seconds):0)/HINT_SECONDS)+(Number.isFinite(offset)?Math.floor(offset):0);
 return {index:((i%n)+n)%n,text:HINTS[((i%n)+n)%n]};
}
