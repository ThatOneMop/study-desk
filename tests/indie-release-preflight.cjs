const T=require('node:test'),A=require('node:assert/strict'),{checkRelease}=require('../dev/indie-collection-three/release-preflight.cjs');
const fixture=()=>({observedSha:'fresh',expectedSha:'fresh',currentIds:['keeper'],proposedIds:['keeper'],policy:{allowedIds:['keeper']}});
T('unchanged curated slate passes without mutating input',()=>{const x=fixture(),before=JSON.stringify(x);A.equal(checkRelease(x).ok,true);A.equal(JSON.stringify(x),before)});
T('old development catalogue cannot resurrect retired games',()=>{const x=fixture();x.proposedIds.push('stencil-studio');A.equal(checkRelease(x).ok,false)});
T('new unlisted games respect the current slate',()=>{const x=fixture();x.proposedIds.push('mycelium-yard');A.equal(checkRelease(x).ok,false)});
T('concurrent kept games cannot disappear',()=>{const x=fixture();x.proposedIds=[];A.match(checkRelease(x).errors[0],/removes/)});
T('stale source lease fails',()=>{const x=fixture();x.observedSha='newer';A.equal(checkRelease(x).ok,false)});
T('missing policy or duplicate catalogue fails closed',()=>{let x=fixture();delete x.policy;A.equal(checkRelease(x).ok,false);x=fixture();x.proposedIds.push('keeper');A.equal(checkRelease(x).ok,false)});
T('future explicit policy extension permits only its named addition',()=>{const x=fixture();x.policy.allowedIds.push('approved');x.proposedIds.push('approved');A.equal(checkRelease(x).ok,true);x.proposedIds.push('other');A.equal(checkRelease(x).ok,false)});
