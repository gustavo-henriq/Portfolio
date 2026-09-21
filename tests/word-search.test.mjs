import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateGrid,occurrences} from '../src/generateGrid.js';
import {stack} from '../src/stack.js';
const words=stack.map(s=>s.word);
test('deterministic seeded layout',()=>assert.deepEqual(generateGrid(words),generateGrid(words)));
test('different seeds change the layout',()=>assert.notDeepEqual(generateGrid(words,{seed:1}).grid,generateGrid(words,{seed:2}).grid));
test('every skill appears exactly once in all eight directions across 30 seeds',()=>{
 for(let seed=0;seed<30;seed++){
  const {grid,placements}=generateGrid(words,{seed});assert.equal(grid.length,13);assert.ok(grid.every(r=>r.length===11));assert.equal(placements.length,10);
  for(const word of words)assert.equal(occurrences(grid,word),1,`${seed}: ${word}`);
  for(const p of placements)assert.equal([...p.word].map((_,i)=>grid[p.row+p.dr*i][p.col+p.dc*i]).join(''),p.word);
  assert.ok(placements.every(p=>p.dr===0&&p.dc===1),'All skills read horizontally, left to right');
 }
});
test('digits and configurable dimensions',()=>{const result=generateGrid(['ESP32','REACT'],{cols:7,rows:8,seed:'test'});assert.equal(result.grid.length,8);assert.equal(occurrences(result.grid,'ESP32'),1);});
test('invalid input is rejected explicitly',()=>{assert.throws(()=>generateGrid(['PLAYWRIGHT'],{cols:3,rows:3}));assert.throws(()=>generateGrid(['REACT','REACT']));});
