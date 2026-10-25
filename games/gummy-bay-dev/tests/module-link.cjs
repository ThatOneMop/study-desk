// Parse AND link the browser module graph. Unlike a stripped-import VM harness,
// this catches import/local declaration collisions and missing named exports.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../dist');const modules=new Map();
function read(file){if(modules.has(file))return modules.get(file);const m=new vm.SourceTextModule(fs.readFileSync(file,'utf8'),{identifier:file});modules.set(file,m);return m;}
(async()=>{const entry=read(path.join(root,'game.js'));await entry.link((specifier,parent)=>{if(!specifier.startsWith('.'))throw Error('Nonlocal module '+specifier);const file=path.resolve(path.dirname(parent.identifier),specifier.split('?')[0]);if(!file.startsWith(root+path.sep))throw Error('Module outside dist');return read(file);});console.log('PASS: '+modules.size+' browser ES modules parse and link with imports intact. No DOM/WebGL execution.');})().catch(e=>{console.error(e);process.exitCode=1;});
