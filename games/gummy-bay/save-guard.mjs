// Keep an open tab from replacing a newer copy of the same save slot.
export function createSaveGuard(storage){
 const expected=new Map(),locked=new Set();
 return {
  open(key){const raw=storage.getItem(key);expected.set(key,raw);locked.delete(key);return raw;},
  check(key){if(!expected.has(key))return true;if(storage.getItem(key)!==expected.get(key))locked.add(key);return !locked.has(key);},
  write(key,value){if(!expected.has(key))this.open(key);if(!this.check(key))return false;storage.setItem(key,value);expected.set(key,value);return true;},
  blocked(key){return locked.has(key);}
 };
}
