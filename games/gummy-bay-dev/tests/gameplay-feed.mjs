import assert from 'node:assert/strict';
import {bindGameplayState,gameplaySnapshot,subscribeGameplay,emitGameplay} from '../dist/gameplay-feed.mjs';

assert.equal(gameplaySnapshot(),null);
bindGameplayState(()=>({day:1,time:1320,heat:20,curfew:true,cravings:[null]}));
assert.deepEqual(gameplaySnapshot(),{day:1,time:1320,heat:20,curfew:true,cravings:[null]});
bindGameplayState(null);
assert.equal(gameplaySnapshot(),null);

const seen=[];
const stop=subscribeGameplay(event=>seen.push(event.type));
emitGameplay({type:'curfew',active:true});
emitGameplay(null);
emitGameplay({active:true});
stop();
emitGameplay({type:'craving-ask'});
assert.deepEqual(seen,['curfew']);
const errors=[];
const report=console.error;
console.error=(...args)=>errors.push(args.join(' '));
subscribeGameplay(()=>{throw new Error('listener failed');});
assert.doesNotThrow(()=>emitGameplay({type:'craving-changed'}));
console.error=report;
assert.equal(errors.length,1);

console.log('PASS: gameplay snapshot binding and event subscription.');
