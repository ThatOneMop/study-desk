// Shared presentation only. Commands and stock remain owned by the host.
const REMOTE_STATES=new Set(['Not hired','Carried-stock automation','Assignment paused','Missing packaging station','Station occupied','Storage full','Route blocked','Garden route blocked','Delivery route blocked','Carrying finished pack','Carrying supplies','Walking to supplies','Missing wrappers','Missing ingredients','Supplies collected','Shaping and packaging','Storage full · holding finished pack','Pack stored']);
export function remoteWorkerStatus(worker,connected,age){
 if(!connected)return 'Host unavailable';
 if(!Number.isFinite(age)||age<0||age>5000)return 'Host update stale';
 return REMOTE_STATES.has(worker?.status)?worker.status:'Awaiting host status';
}
// A gummy maker with no saved stock mode walks the workshop. An explicit
// carried or stored choice already in a version-3 save is left alone.
export function normalizeStaffRole(role,incoming,strainCount){
 const stockDefault=role==='crafter'?'stored':'carried';
 const strain=Number.isInteger(incoming?.strain)&&incoming.strain>=-1&&incoming.strain<strainCount?incoming.strain:-1;
 const tent=Number.isInteger(incoming?.tent)&&incoming.tent>=-1&&incoming.tent<=7?incoming.tent:-1;
 const stock=['carried','stored'].includes(incoming?.stock)?incoming.stock:stockDefault;
 // A missing route stays on the timer. New games set walk explicitly in fresh().
 const route=['walk','timer'].includes(incoming?.route)?incoming.route:'timer';
 return {strain,tent,stock,route};
}
export function staffAssignment(role,config,products){
 const product=config.strain>=0?products[config.strain]?.name||'Unknown product':'Any product';
 return product+' · '+(role==='gardener'?(config.tent>=0?'Tent '+(config.tent+1):'All installed tents'):(config.stock==='stored'?'Stockroom packs':'Carried packs'));
}
export function workerAdvice(status){
 if(/Host unavailable|Host update stale|Awaiting host/.test(status))return {text:'Wait for a fresh host update or reconnect. Your local worker is not the shared simulation.',screen:'network'};
 if(/Not hired/.test(status))return {text:'Hire this role at the Helping Hand. Hiring stays at the shop.',target:'helpers'};
 if(/paused|Paused/.test(status))return {text:'Resume this assignment below. Any carried worker stock is retained.'};
 if(/packaging station/.test(status))return {text:'Buy a packaging station at Hank’s Hardware.',target:'hardware'};
 if(/wrappers/.test(status))return {text:'Buy wrappers at the Corner Store. Each finished pack uses one.',target:'store'};
 if(/Storage full|stockroom full/.test(status))return {text:'Collect or sell stored packs to make shelf space. A carried finished pack stays with the worker.',target:'stockroom'};
 if(/^Garden route blocked/.test(status))return {text:'The gardener cannot reach that tent. Clear a path inside the property. The crop stays where it is.',target:'tent'};
 if(/^Delivery route blocked/.test(status))return {text:'The seller walks a straight line and has stopped. Agreed packs stay in the bag until the way to that customer is clear.'};
 if(/^Route blocked/.test(status))return {text:'Clear the route between the supply trolley, worktable and stockroom. Moving tents preserves crops.',target:'craft'};
 if(/Station occupied/.test(status))return {text:'Finish or cancel manual work or placement, then close this panel to resume.'};
 if(/soil|assigned seeds/.test(status))return {text:'Bring soil and unlocked seeds matching this assignment, or choose another product.',target:'dealer'};
 if(/fill the watering can/.test(status))return {text:'Fill the can at the room sink. A walking gardener spends one real charge and does not refill it.',target:'sink'};
 if(/watering can|trimmers/.test(status))return {text:'Get the reusable tools from Hank’s Hardware.',target:'hardware'};
 if(/property stock full/.test(status))return {text:'Sell goods or expand the property. Moving packs to a shelf does not reduce total goods.',target:'property'};
 if(/install an assigned tent/.test(status))return {text:'Install the selected tent, or choose All installed tents.'};
 if(/Missing ingredients|harvested or loose gummies/.test(status))return {text:'Harvest ingredients, bring loose gummies, or choose an available product.',target:'craft'};
 if(/unreserved/.test(status))return {text:'Provide packs in the selected stock location. Promised deliveries are never sold by the assistant.',target:'stockroom'};
 if(/agreed deal/.test(status))return {text:'Text a customer and agree a price. This seller walks that order over and does not sell unnamed packs.'};
 if(/Walking to harvest|Walking to water|Walking to plant|Harvesting|Watering|Planting/.test(status))return {text:'The gardener is on the way. The crop changes when the job finishes at the tent.'};
 if(/Handing over the order|^Walking to (?!supplies)/.test(status))return {text:'The seller is carrying the agreed order. Packs and cash change at the handoff.'};
 if(/Carrying|Supplies collected|Shaping/.test(status))return {text:'One real batch is in transit. It is not available inventory until the worker delivers it.'};
 if(/Starting/.test(status))return {text:'Close the roster and resume play to start the assignment.'};
 return {text:'This is a status snapshot. Local work resumes when you close the panel; shared work is host-controlled.'};
}
