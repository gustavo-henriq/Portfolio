import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Chess } from 'chess.js';

const puzzles=JSON.parse(readFileSync(new URL('../src/chess/puzzles.json',import.meta.url),'utf8'));
const toMove=uci=>({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]||'q'});

test('every bundled Lichess puzzle is legal and ends in checkmate',()=>{
  assert.ok(puzzles.length>=3&&puzzles.length<=5);
  for(const puzzle of puzzles){
    const game=new Chess(puzzle.fen);
    puzzle.moves.forEach((uci,index)=>assert.ok(game.move(toMove(uci)),`${puzzle.id}: move ${index+1} (${uci}) must be legal`));
    assert.equal(game.isCheckmate(),true,`${puzzle.id} must end in checkmate`);
  }
});

test('the displayed position always gives White the move',()=>{
  for(const puzzle of puzzles){const game=new Chess(puzzle.fen);game.move(toMove(puzzle.moves[0]));assert.equal(game.turn(),'w',`${puzzle.id} should show White to move`);}
});
