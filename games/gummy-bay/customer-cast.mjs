// v173 town cast. Thirty-six more locals on top of the original fourteen, so the
// book holds fifty. Looks are built in code from the people-kit palettes: face,
// hair, skin, outfit, hat, height and build. No two signatures match.
// Homes sit on the old-town road shoulders so the existing resident routes still
// reach the shops. `area` is the district they belong to.

const SKINS=Object.freeze([0xf6d6b8,0xf1cba6,0xeac0a0,0xe2b088,0xcf9a6c,0xb77d52,0x9a623c,0x7c4d2e,0x5e3a24,0x46291a]);
const HAIR_COLORS=Object.freeze([0x2a231d,0x45311f,0x6b4a2c,0x9a7040,0x1d1f22,0x5a3b28,0xb9b2a6,0xc8863e,0xe3c47c,0x9c3f26,0xe8e3da]);
const TOPS=Object.freeze([0x4d6b8a,0xa8473c,0x5f7a4a,0xc2a25a,0x6e5a86,0x3d4a55,0xb8673a,0x2f6f6a,0x8c8c88,0x9a3f5c,0xd9cfb8,0x56483e]);
const PANTS=Object.freeze([0x33496a,0x2b3a55,0x3b3530,0x23262b,0x5d5444,0x41506a,0x6b6250]);
const SHOES=Object.freeze([0x1f1f22,0xe8e4dc,0x5a3a24,0x2c3440,0x8a2c2c,0x3f6a8a]);
const HAIR=Object.freeze(['short','long','buzz','bald','bun','afro','mohawk','ponytail','curly','bob','fringe','spiky','combover']);
const TOP_STYLES=Object.freeze(['hoodie','jacket','tee','flannel','puffer','overalls','polo']);
const HATS=Object.freeze(['none','cap','beanie','bucket','flatcap']);
const BEARDS=Object.freeze(['none','full','goatee','moustache']);
const FEMININE=new Set(['Jules','Nina','Rosa','Ivy','Wren','Dot','Leanne','Nia','Beryl','Pam','Sable','Juniper','Rae','Cleo Caramel','Marge','Tilly','Mayor Prudence','Ada Pebble','Cass Wattle','Fern Pickle','Hattie Muffin','Jo Biscuit','Kit Sprout','Lou Button','Mabel Toffee','Quinn Crumpet','Ruby Jelly','Tess Fudge','Uma Salt','Frankie']);

const ORIGINAL=Object.freeze(['Jules','Benji','Nina','Oz','Frankie','Marlowe','Pip','Rosa','Theo','Ivy','Gus','Wren','Dot','Rocco']);

const levelGate=(level,quality)=>quality?{kind:'level',level,quality}:{kind:'level',level};
const districtGate=area=>({kind:'district',area});

// x along the east-west road, z on a shoulder, so pathing to the six old-town places stays short.
const T=[
 ['Milo',24,5.2,'old-town',levelGate(2),'Soil first, then something sunny.','The ovens of the garden shop smell like rain on pots.',['sunny','hearty'],[140,320],'low',1.12,'Garden shopkeeper','crowd',['Leanne','Nia']],
 ['Leanne',-80,-4.6,'old-town',levelGate(2),'Servo coffee, then a zippy chew.','Coastway Servo, late window. I notice who is in a hurry.',['zippy','zesty'],[90,220],'veryLow',.98,'Servo clerk','crowd',['Beryl']],
 ['Hank Harrow',-24,-4.8,'old-town',levelGate(3),'A solid chew for a solid day.','Hardware counter. I sell tents, not trouble.',['hearty','thunder'],[160,380],'moderate',1.15,'Hardware clerk','crowd',['Clive']],
 ['Nia',24,-4.6,'old-town',levelGate(2),'Bright wrappers, bright mood.','Corner store. If it looks tidy I will try it.',['bright','breezy'],[110,260],'low',1.05,'Corner store clerk','crowd',['Pam']],
 ['Beryl',56,5.4,'old-town',levelGate(4),'Quiet soap, quiet flavours.','Suds and Sunshine. I like things smooth.',['still','smooth'],[150,360],'high',1.18,'Laundromat keeper','crowd',[]],
 ['Clive',56,-5.1,'old-town',levelGate(3),'A calm house and a calm chew.','Cedar Bay Lettings. I read the fine print, and the flavour.',['quiet','keen'],[180,420],'high',1.2,'Lettings clerk','crowd',[]],
 ['Pam',-56,-4.4,'old-town',levelGate(3),'Helping out should taste good.','The Helping Hand. I remember who treats people kindly.',['sunny','curious'],[100,240],'moderate',1.08,'Staffing clerk','crowd',[]],
 ['Sable',-72,4.8,'westside',districtGate('westside'),'Westside likes a breeze.','I mind the westside seed stall.',['breezy','keen'],[120,280],'moderate',1.1,'Westside clerk','crowd',['Ada Pebble']],
 ['Juniper',72,-4.7,'east-market',districtGate('east-market'),'Market days should be zesty.','East Market packaging stall. Colour matters.',['zesty','peppery'],[130,300],'moderate',1.14,'East Market clerk','crowd',['Fern Pickle']],
 ['Ned',-16,5.6,'north-heights',districtGate('north-heights'),'Heights air, hearty chew.','North hardware window. I like a chew with backbone.',['hearty','still'],[170,400],'high',1.16,'Heights clerk','crowd',['Kit Sprout']],
 ['Rae',16,5.3,'north-heights',districtGate('north-heights'),'A quick stop, a bright chew.','North servo. Fast and friendly.',['zippy','bright'],[80,190],'veryLow',.96,'North servo clerk','crowd',['Mabel Toffee']],
 ['Benny Boardwalk',-40,4.4,'old-town',levelGate(3),'Boardwalk energy. Keep it sunny.','I walk the old-town loop with a pocket full of samples.',['sunny','brisk'],[200,480],'moderate',1.22,'Old Town regular','anchor',['Bo Crumb']],
 ['Mo Marmalade',40,-4.2,'east-market',districtGate('east-market'),'Orange coat, orange opinions.','East Market is my beat. Bring flavour.',['hearty','zesty'],[220,520],'moderate',1.25,'East Market regular','anchor',['Gio Noodle']],
 ['Cleo Caramel',-64,5.1,'west-harbor',districtGate('west-harbor'),'Harbor wind, smooth chew.','West Harbor. I only share what I would eat.',['smooth','hazy'],[240,560],'high',1.28,'Harbor regular','anchor',['Ivo Treacle']],
 ['Dex Dimple',-32,4.9,'north-heights',districtGate('north-heights'),'Soft voice, high standard.','North Heights. Surprise me, gently.',['quiet','luminous'],[260,600],'veryHigh',1.3,'Heights regular','anchor',['Lou Button']],
 ['Marge',32,5.8,'old-town',levelGate(6),'Pier gossip, warm chew.','Bait and tackle, and a long memory.',['still','sunny'],[140,340],'moderate',1.1,'Pier regular','anchor',['Tilly']],
 ['Tilly',40,5.2,'old-town',levelGate(6),'Overalls and a bright day.','I paint the pier rail and taste as I go.',['breezy','buoyant'],[90,220],'low',1.02,'Pier painter','anchor',[]],
 ['Lemon Larry',-48,4.6,'old-town',levelGate(4),'Lemon cap, lemon mood.','If it is zesty I am already listening.',['zesty','curious'],[80,200],'veryLow',.95,'Street regular','anchor',['Hank Harrow']],
 ['Mayor Prudence',48,5.5,'old-town',levelGate(9),'The town should taste looked-after.','I notice quality. The bay notices with me.',['quiet','smooth'],[200,480],'high',1.2,'Mayor','anchor',['Sable']],
 ['Gramps Gus',64,4.7,'old-town',{kind:'both',level:12,quality:.75,area:'old-town'},'Only the batch I would have been proud of.','The RV was mine. The standard still is.',['still','hazy'],[180,440],'veryHigh',1.15,'Retired skipper','anchor',['Mayor Prudence']],
 ['Ada Pebble',-80,5,'westside',districtGate('westside'),'Pebble-quiet, breeze-happy.','Westside walks. I stop for a good sample.',['breezy','bright'],[70,180],'low',.94,'Westside walker','crowd',['Cass Wattle']],
 ['Bo Crumb',-72,-4.3,'westside',districtGate('westside'),'Crumbs on the jersey, joy in the chew.','I deliver westside parcels.',['zippy','spry'],[60,160],'veryLow',.92,'Westside courier','crowd',[]],
 ['Cass Wattle',-64,-5.2,'westside',districtGate('westside'),'Wattle flowers, sunny chews.','I arrange the westside window boxes.',['sunny','keen'],[100,240],'moderate',1.04,'Westside gardener','crowd',[]],
 ['Fern Pickle',72,4.4,'east-market',districtGate('east-market'),'Sour-sweet is a compliment.','East Market pickle stall. I know a sharp flavour.',['zesty','buoyant'],[110,260],'moderate',1.06,'Market stallholder','crowd',['Hattie Muffin']],
 ['Gio Noodle',80,-4.5,'east-market',districtGate('east-market'),'A hearty bowl, a hearty chew.','Noodle window at the market.',['hearty','smooth'],[130,300],'moderate',1.12,'Noodle cook','crowd',[]],
 ['Hattie Muffin',80,5.3,'east-market',districtGate('east-market'),'Muffins in the morning, chews after.','I bake for the market rush.',['curious','keen'],[120,280],'low',1.08,'Market baker','crowd',[]],
 ['Ivo Treacle',-48,-4.9,'west-harbor',districtGate('west-harbor'),'Slow as treacle, sure as the tide.','Harbor nets. I taste carefully.',['breezy','still'],[150,360],'high',1.14,'Harbor fisher','crowd',['Jo Biscuit']],
 ['Jo Biscuit',-40,-5.3,'west-harbor',districtGate('west-harbor'),'Tea and a sunny chew.','Harbor kiosk. Regulars know my tin.',['sunny','luminous'],[90,210],'low',1.0,'Harbor kiosk','crowd',[]],
 ['Kit Sprout',-16,-4.5,'north-heights',districtGate('north-heights'),'New shoots, new flavours.','I tend the heights planters.',['zippy','hearty'],[100,240],'moderate',1.05,'Heights gardener','crowd',['Mabel Toffee']],
 ['Lou Button',16,-5.4,'north-heights',districtGate('north-heights'),'Small buttons, bright taste.','I mend coats up on the heights.',['bright','buoyant'],[80,200],'low',.97,'Heights tailor','crowd',[]],
 ['Mabel Toffee',-32,-4.7,'north-heights',districtGate('north-heights'),'Toffee-sweet, never sloppy.','Heights sweet window. I am picky on purpose.',['hazy','smooth'],[180,420],'high',1.18,'Heights confectioner','crowd',[]],
 ['Quinn Crumpet',64,-4.4,'east-coast',districtGate('east-coast'),'Coast wind, crumpet calm.','East Coast path. I walk it every morning.',['peppery','zesty'],[140,340],'moderate',1.1,'Coast walker','crowd',['Ruby Jelly']],
 ['Ruby Jelly',48,-5,'east-coast',districtGate('east-coast'),'Wobbly name, steady taste.','East Coast kiosk. Colour first, then flavour.',['brisk','keen'],[120,300],'moderate',1.08,'Coast kiosk','crowd',['Sid Waffle']],
 ['Sid Waffle',32,-4.8,'east-coast',districtGate('east-coast'),'Crisp outside, soft middle.','I grill on the coast path.',['sunny','breezy'],[110,260],'low',1.02,'Coast griller','crowd',[]],
 ['Tess Fudge',-8,5.4,'northgate',districtGate('northgate'),'Northgate fudge, no shortcuts.','The gate kiosk. I can tell a rushed batch.',['hearty','bright'],[200,480],'high',1.22,'Northgate kiosk','crowd',['Uma Salt']],
 ['Uma Salt',8,-5.2,'northgate',districtGate('northgate'),'A pinch of salt makes the sweet honest.','Northgate lookout. Bring your best.',['still','curious'],[220,520],'veryHigh',1.26,'Northgate lookout','crowd',[]]
];

const OVERRIDES={
 Jules:{hairStyle:'ponytail',hat:'none',topStyle:'polo',top:0xc67562,faceStyle:4,eyewear:0,beard:'none',height:1.02,build:.96},
 Benji:{hairStyle:'curly',hat:'none',topStyle:'hoodie',top:0x80a7a8,faceStyle:0,eyewear:1,beard:'none',height:1.04,build:1.05},
 Nina:{hairStyle:'bob',hat:'none',topStyle:'jacket',top:0xb9a567,faceStyle:2,eyewear:2,beard:'none',height:1.0,build:.94},
 Oz:{hairStyle:'mohawk',hat:'none',topStyle:'puffer',top:0x9e87b4,faceStyle:3,eyewear:0,beard:'goatee',height:1.1,build:1.02},
 Frankie:{hairStyle:'spiky',hat:'bucket',topStyle:'overalls',top:0x7f9f63,faceStyle:5,eyewear:0,beard:'none',height:.98,build:.98},
 Marlowe:{hairStyle:'bun',hat:'flatcap',topStyle:'apron',top:0xd09a5c,faceStyle:1,eyewear:0,beard:'moustache',height:1.06,build:1.08},
 Pip:{hairStyle:'fringe',hat:'cap',topStyle:'track',top:0x6fa0c8,faceStyle:5,eyewear:0,beard:'none',height:.92,build:.9},
 Rosa:{hairStyle:'ponytail',hat:'none',topStyle:'apron',top:0xc96f7d,faceStyle:2,eyewear:0,beard:'none',height:1.0,build:1.0},
 Theo:{hairStyle:'short',hat:'cap',topStyle:'polo',top:0xe0c25c,faceStyle:6,eyewear:1,beard:'none',height:1.12,build:1.06},
 Ivy:{hairStyle:'bob',hat:'none',topStyle:'jacket',top:0x8a9b6e,faceStyle:4,eyewear:1,beard:'none',height:1.01,build:.92},
 Gus:{hairStyle:'buzz',hat:'beanie',topStyle:'jacket',top:0xa3765a,faceStyle:7,eyewear:0,beard:'full',height:1.08,build:1.16},
 Wren:{hairStyle:'long',hat:'none',topStyle:'flannel',top:0xb48ac7,faceStyle:5,eyewear:0,beard:'none',height:1.05,build:.95},
 Dot:{hairStyle:'combover',hat:'flatcap',topStyle:'jacket',top:0x6f8fa0,faceStyle:0,eyewear:0,beard:'none',height:.9,build:1.14},
 Rocco:{hairStyle:'curly',hat:'none',topStyle:'apron',top:0xd86f4f,faceStyle:2,eyewear:0,beard:'goatee',height:1.07,build:1.12},
 Milo:{hairStyle:'short',hat:'cap',topStyle:'overalls',top:0x5f7a4a,faceStyle:1,eyewear:0,beard:'moustache',height:1.04,build:1.1},
 Leanne:{hairStyle:'ponytail',hat:'none',topStyle:'polo',top:0x2f6f6a,faceStyle:5,eyewear:0,beard:'none',height:1.0,build:.93},
 'Hank Harrow':{hairStyle:'short',hat:'flatcap',topStyle:'overalls',top:0xe6e0d2,pants:0x5d6f3e,faceStyle:0,eyewear:0,beard:'full',height:1.09,build:1.18},
 Nia:{hairStyle:'bob',hat:'none',topStyle:'tee',top:0x829fac,faceStyle:2,eyewear:2,beard:'none',height:.97,build:.9},
 Beryl:{hairStyle:'bun',hat:'none',topStyle:'apron',top:0xb994a6,faceStyle:4,eyewear:1,beard:'none',height:.95,build:1.08},
 Clive:{hairStyle:'combover',hat:'none',topStyle:'jacket',top:0x819777,faceStyle:7,eyewear:1,beard:'moustache',height:1.06,build:1.0},
 Pam:{hairStyle:'curly',hat:'none',topStyle:'hoodie',top:0x8989a5,faceStyle:5,eyewear:0,beard:'none',height:1.01,build:1.04},
 Sable:{hairStyle:'long',hat:'beanie',topStyle:'jacket',top:0x4d6b8a,faceStyle:6,eyewear:0,beard:'none',height:1.08,build:.96},
 Juniper:{hairStyle:'afro',hat:'none',topStyle:'flannel',top:0xb8673a,faceStyle:1,eyewear:1,beard:'none',height:1.03,build:1.0},
 Ned:{hairStyle:'buzz',hat:'flatcap',topStyle:'jacket',top:0x56483e,faceStyle:3,eyewear:0,beard:'full',height:1.11,build:1.14},
 Rae:{hairStyle:'fringe',hat:'cap',topStyle:'tee',top:0x3f6a8a,faceStyle:5,eyewear:0,beard:'none',height:.96,build:.88},
 'Benny Boardwalk':{hairStyle:'short',hat:'cap',topStyle:'track',top:0x4f8fbf,faceStyle:2,eyewear:0,beard:'goatee',height:1.05,build:1.0},
 'Mo Marmalade':{hairStyle:'buzz',hat:'beanie',topStyle:'puffer',top:0xd9822b,faceStyle:5,eyewear:0,beard:'full',height:1.02,build:1.18},
 'Cleo Caramel':{hairStyle:'afro',hat:'none',topStyle:'track',top:0xb0572f,faceStyle:1,eyewear:2,beard:'none',height:1.06,build:1.02},
 'Dex Dimple':{hairStyle:'fringe',hat:'none',topStyle:'jacket',top:0x7b5fb5,faceStyle:4,eyewear:1,beard:'none',height:1.0,build:.92},
 Marge:{skin:0xf0c9a5,hair:0xe8e3da,hairStyle:'bun',hat:'none',eyewear:1,topStyle:'jacket',top:0xe0b13a,pants:0x5d5444,faceStyle:0,beard:'none',height:.93,build:1.12},
 Tilly:{skin:0xf1cba6,hair:0xc8863e,hairStyle:'ponytail',hat:'none',topStyle:'overalls',top:0xf2efe8,pants:0x2f8a8a,faceStyle:5,eyewear:0,beard:'none',height:.95,build:.94},
 'Lemon Larry':{skin:0xf6e05a,hair:0x6b4a2c,hairStyle:'short',hat:'cap',topStyle:'hoodie',top:0x3c4a24,faceStyle:3,eyewear:0,beard:'none',height:1.0,build:.95},
 'Mayor Prudence':{skin:0xeac0a0,hair:0x45311f,hairStyle:'bob',hat:'none',topStyle:'jacket',top:0x7a3f74,faceStyle:2,eyewear:1,beard:'none',height:1.02,build:1.0},
 'Gramps Gus':{skin:0xe9c3a0,hair:0xf4f1ea,hairStyle:'combover',hat:'none',beard:'full',topStyle:'flannel',top:0xb84a3a,faceStyle:0,eyewear:0,height:.94,build:1.1}
};

function hash(n){let x=Math.imul((n|0)^0x9e3779b9,0x85ebca6b);x=Math.imul(x^(x>>>13),0xc2b2ae35);return (x^(x>>>16))>>>0;}
function pick(list,n){return list[(n>>>0)%list.length];}

export function lookSignature(look){
 if(!look)return '';
 return [look.faceStyle,look.hairStyle,look.hair,look.skin,look.topStyle,look.top,look.pants,look.hat,look.eyewear,look.beard,look.height,look.build,look.shoes].join('|');
}

function baseLook(index,name){
 const h=hash(index*97+13),g=hash(h^0x51ed);
 const feminine=FEMININE.has(name);
 const beardRoll=(g>>>4)%5;
 return {
  faceStyle:(h>>>1)%8,
  hairStyle:pick(HAIR,h>>>3),
  hair:pick(HAIR_COLORS,h>>>6),
  skin:pick(SKINS,h>>>9),
  topStyle:pick(TOP_STYLES,h>>>12),
  top:pick(TOPS,h>>>15),
  pants:pick(PANTS,h>>>18),
  hat:(g>>>21)%4===0?pick(HATS,1+(g>>>24)%(HATS.length-1)):'none',
  eyewear:(h>>>27)%6===0?1:(h>>>27)%9===0?2:0,
  beard:feminine?'none':beardRoll===0?'full':beardRoll===1?'goatee':beardRoll===2?'moustache':'none',
  height:+(.88+((g>>>8)%15)/14*.28).toFixed(3),
  build:+(.86+((g>>>11)%13)/12*.38).toFixed(3),
  shoes:pick(SHOES,h>>>16),
  shoeStyle:'sneaker'
 };
}

const names=[...ORIGINAL,...T.map(row=>row[0])];
const used=new Set();
function bake(index,name){
 let look=baseLook(index,name);
 const over=OVERRIDES[name];
 if(over)look={...look,...over};
 if(FEMININE.has(name))look.beard='none';
 if(look.hat==='police'||look.topStyle==='uniform'){look.hat='cap';look.topStyle='jacket';}
 for(let attempt=0;attempt<48;attempt++){
  const sig=lookSignature(look);
  if(!used.has(sig)){used.add(sig);return Object.freeze(look);}
  const bump=(attempt%3);
  if(bump===0)look={...look,height:+Math.min(1.16,look.height+.004).toFixed(3)};
  else if(bump===1)look={...look,faceStyle:(look.faceStyle+1)%8};
  else look={...look,hair:HAIR_COLORS[(HAIR_COLORS.indexOf(look.hair)+1)%HAIR_COLORS.length],build:+Math.min(1.24,look.build+.01).toFixed(3)};
 }
 used.add(lookSignature(look)+'#'+index);
 return Object.freeze(look);
}

export const CUSTOMER_LOOKS=Object.freeze(names.map((name,index)=>bake(index,name)));

const town=T.map(row=>{
 const [name,x,z,area,gate,personality,line,effects,spend,standard,budget,role,visual,introduces]=row;
 return {name,x,z,area,gate,personality,line,effects,spend,standard,budget,role,visual,introduces};
});

export const TOWN_CUSTOMERS=Object.freeze(town.map((raw,i)=>{
 const look=CUSTOMER_LOOKS[ORIGINAL.length+i];
 const introduces=Object.freeze(raw.introduces.map(who=>ORIGINAL.length+town.findIndex(row=>row.name===who)).filter(index=>index>=ORIGINAL.length));
 return Object.freeze({
  name:raw.name,x:raw.x,z:raw.z,color:look.top,skin:look.skin,budget:raw.budget,line:raw.line,
  effects:Object.freeze(raw.effects.slice()),spend:Object.freeze(raw.spend.slice()),standard:raw.standard,
  knows:introduces,role:raw.role,area:raw.area,gate:Object.freeze({...raw.gate}),
  introduces,personality:raw.personality,visual:raw.visual
 });
}));
