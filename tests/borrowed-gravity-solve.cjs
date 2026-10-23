'use strict';const E=require('../games/borrowed-gravity/engine.js'),fs=require('node:fs'),path=require('node:path');let s=E.create(),steps=[],routes=[];
function act(a){const result=E.action(s,a);if(!result.ok)throw Error(JSON.stringify({a,reason:result.reason,run:s.run}));s=result.state;steps.push(a);}
function tick(n,input=0){if(n<1)return;for(let i=0;i<n;i++){s=E.tick(s,input);if(s.run.phase==='lost')throw Error('lost '+JSON.stringify(s.run));}steps.push({type:'tick',frames:n,input});}
function until(fn,input=0,max=800){let n=0;while(!fn(s)&&s.run.phase==='play'){s=E.tick(s,input);if(++n>max)throw Error('stalled '+JSON.stringify(s.run));if(s.run.phase==='lost')throw Error('lost '+JSON.stringify(s.run));}if(n)steps.push({type:'tick',frames:n,input});}
for(let room=0;room<4;room++){steps=[];if(room)act({type:'room',room});act({type:'start'});act({type:'borrow'});if(room===0){until(s=>s.run.y<=38);until(s=>s.run.x>=555,2);act({type:'return'});until(s=>s.run.phase==='won');}
if(room===1){until(s=>s.run.x>=614);until(s=>s.run.y<=65,4);act({type:'return'});until(s=>s.run.phase==='won',1);}
if(room===2){tick(30,4);until(s=>s.run.x<=26);until(s=>s.run.y<=65,4);act({type:'return'});until(s=>s.run.phase==='won',2);}
if(room===3){until(s=>s.run.y<=38);until(s=>s.run.x>=590,2);act({type:'select',id:1});act({type:'borrow'});until(s=>s.run.x>=614);until(s=>s.run.y>=350,8);act({type:'return'});until(s=>s.run.phase==='won',1);}
if(s.run.phase!=='won')throw Error('unfinished');routes.push({room,frames:s.run.frame,transfers:s.run.transfers,steps});console.log('Room',room+1,s.records[room],s.run.collected);}
const output=path.join(__dirname,'fixtures/borrowed-gravity-routes.json');fs.writeFileSync(output,JSON.stringify(routes,null,2)+'\n');console.log('Saved authored reference routes',output);
