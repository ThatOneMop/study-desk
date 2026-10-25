// Shared presentation only. Commands and stock remain owned by the host.
const REMOTE_STATES=new Set(['Not hired','Carried-stock automation','Assignment paused','Missing packaging station','Station occupied','Storage full','Route blocked','Carrying finished pack','Carrying supplies','Walking to supplies','Missing wrappers','Missing ingredients','Supplies collected','Shaping and packaging','Storage full · holding finished pack','Pack stored']);
export function remoteWorkerStatus(worker,connected,age){
 if(!connected)return 'Host unavailable';
 if(!Number.isFinite(age)||age<0||age>5000)return 'Host update stale';
 return REMOTE_STATES.has(worker?.status)?worker.status:'Awaiting host status';
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
 if(/Route blocked/.test(status))return {text:'Clear the route between the supply trolley, worktable and stockroom. Moving tents preserves crops.',target:'craft'};
 if(/Station occupied/.test(status))return {text:'Finish or cancel manual work or placement, then close this panel to resume.'};
 if(/soil|assigned seeds/.test(status))return {text:'Bring soil and unlocked seeds matching this assignment, or choose another product.',target:'dealer'};
 if(/watering can|trimmers/.test(status))return {text:'Get the reusable tools from Hank’s Hardware.',target:'hardware'};
 if(/property stock full/.test(status))return {text:'Sell goods or expand the property. Moving packs to a shelf does not reduce total goods.',target:'property'};
 if(/install an assigned tent/.test(status))return {text:'Install the selected tent, or choose All installed tents.'};
 if(/Missing ingredients|harvested or loose gummies/.test(status))return {text:'Harvest ingredients, bring loose gummies, or choose an available product.',target:'craft'};
 if(/unreserved/.test(status))return {text:'Provide packs in the selected stock location. Promised deliveries are never sold by the assistant.',target:'stockroom'};
 if(/Carrying|Supplies collected|Shaping/.test(status))return {text:'One real batch is in transit. It is not available inventory until the worker delivers it.'};
 if(/Starting/.test(status))return {text:'Close the roster and resume play to start the assignment.'};
 return {text:'This is a status snapshot. Local work resumes when you close the panel; shared work is host-controlled.'};
}
