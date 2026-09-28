import { useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import puzzles from './puzzles.json';
import { chessProfile } from './chessConfig';
import './chess-column.css';
import './newspaper-pieces.css';

const files=['a','b','c','d','e','f','g','h'];
const pieceNames={p:'pawn',n:'knight',b:'bishop',r:'rook',q:'queen',k:'king'};
const confettiPieces=Array.from({length:76},(_,i)=>{const lane=Math.floor(i/2),side=i%2===0?1:-1;return {'--origin':side===1?'3%':'97%','--bottom':`${3+(lane*7)%13}%`,'--travel-x':`${Math.round(side*(24+((lane*29)%37)/36*275))}px`,'--travel-y':`${-Math.round(75+((lane*13)%31)/30*255)}px`,'--spin':`${side*(100+(lane*41)%380)}deg`,'--delay':`${(lane*31)%190}ms`,'--duration':`${1450+(lane*43)%550}ms`,'--w':`${3+(lane*3)%6}px`,'--h':`${5+(lane*5)%8}px`};});
const uciMove=uci=>({from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]||'q'});
const moveUci=move=>`${move.from}${move.to}${move.promotion||''}`;

function createPuzzleGame(puzzle){const game=new Chess(puzzle.fen);const opponent=game.move(uciMove(puzzle.moves[0]));if(!opponent)throw new Error(`Invalid setup move in puzzle ${puzzle.id}`);return game;}

export default function ChessColumn({t,onChallenge}){
  const [index,setIndex]=useState(0),[revision,setRevision]=useState(0),[selected,setSelected]=useState(null),[hint,setHint]=useState(null),[step,setStep]=useState(0),[status,setStatus]=useState(''),[solved,setSolved]=useState(false),[wrong,setWrong]=useState(false),[cursor,setCursor]=useState(0),[dragging,setDragging]=useState(null);
  const gameRef=useRef(createPuzzleGame(puzzles[0])),timers=useRef([]),cellRefs=useRef([]),dragRef=useRef(null),suppressClick=useRef(false),boardRef=useRef(null);
  const puzzle=puzzles[index],game=gameRef.current;
  const mateCount=puzzle.themes.includes('mateIn2')?2:1;
  const orientation=game.turn();
  const legal=useMemo(()=>selected?game.moves({square:selected,verbose:true}).map(move=>move.to):[],[selected,revision,index]);

  function clearTimers(){timers.current.forEach(clearTimeout);timers.current=[];}
  function loadPuzzle(next=index){clearTimers();gameRef.current=createPuzzleGame(puzzles[next]);dragRef.current=null;setDragging(null);setSelected(null);setHint(null);setStep(0);setSolved(false);setWrong(false);setStatus('');setCursor(0);setRevision(value=>value+1);}
  useEffect(()=>()=>clearTimers(),[]);

  function announce(message){setStatus(message);}
  function failMove(undo=false){if(undo)gameRef.current.undo();setWrong(true);announce(t.tryAgain);setSelected(null);setRevision(value=>value+1);const timer=setTimeout(()=>setWrong(false),360);timers.current.push(timer);}
  function finish(){setSolved(true);setSelected(null);setHint(null);announce(t.checkmate);setRevision(value=>value+1);}
  function attemptMove(from,to){
    if(solved||!from||!to||from===to)return;
    let move;try{move=gameRef.current.move({from,to,promotion:'q'});}catch{return failMove();}
    if(!move)return failMove();
    const expected=puzzle.moves.slice(1)[step];
    const finalTurn=step>=puzzle.moves.length-2;
    if(finalTurn&&gameRef.current.isCheckmate())return finish();
    if(moveUci(move)!==expected)return failMove(true);
    announce(`${t.correct}: ${move.san}`);setSelected(null);setHint(null);setRevision(value=>value+1);
    const reply=puzzle.moves.slice(1)[step+1];
    if(!reply){if(gameRef.current.isCheckmate())finish();else setStep(value=>value+1);return;}
    const timer=setTimeout(()=>{const response=gameRef.current.move(uciMove(reply));if(!response)return;setStep(value=>value+2);announce(`${t.opponent}: ${response.san}`);setRevision(value=>value+1);},500);timers.current.push(timer);
  }

  function choose(square){
    if(solved)return;
    const piece=gameRef.current.get(square);
    if(!selected){if(piece?.color===gameRef.current.turn()){setSelected(square);announce(`${t.selected}: ${square}`);}return;}
    if(piece?.color===gameRef.current.turn()){setSelected(square);announce(`${t.selected}: ${square}`);return;}
    attemptMove(selected,square);
  }
  function showHint(){const expected=puzzle.moves.slice(1)[step];if(!expected)return;setHint(expected.slice(0,2));setSelected(expected.slice(0,2));announce(`${t.hint}: ${expected.slice(0,2)}`);}
  function showSolution(){
    clearTimers();loadPuzzle(index);const line=puzzle.moves.slice(1);line.forEach((uci,i)=>{const timer=setTimeout(()=>{const move=gameRef.current.move(uciMove(uci));if(move){setRevision(value=>value+1);announce(`${t.move}: ${move.san}`);}if(i===line.length-1)finish();},240+i*520);timers.current.push(timer);});
  }
  function nextPuzzle(){const next=(index+1)%puzzles.length;setIndex(next);loadPuzzle(next);}
  function keyMove(event,position,square){
    const row=Math.floor(position/8),col=position%8;let next=position;
    if(event.key==='ArrowLeft')next=row*8+Math.max(0,col-1);else if(event.key==='ArrowRight')next=row*8+Math.min(7,col+1);else if(event.key==='ArrowUp')next=Math.max(0,row-1)*8+col;else if(event.key==='ArrowDown')next=Math.min(7,row+1)*8+col;else if(event.key==='Enter'||event.key===' '){event.preventDefault();choose(square);return;}else return;
    event.preventDefault();setCursor(next);cellRefs.current[next]?.focus();
  }
  function squareAtPoint(x,y){const cell=document.elementFromPoint(x,y)?.closest('[data-square]');return cell&&boardRef.current?.contains(cell)?cell.dataset.square:null;}
  function pointerDown(event){const square=event.target.closest('[data-square]')?.dataset.square,piece=square&&gameRef.current.get(square);if(solved||piece?.color!==gameRef.current.turn())return;dragRef.current={from:square,piece,startX:event.clientX,startY:event.clientY,moved:false};setSelected(square);event.currentTarget.setPointerCapture(event.pointerId);}
  function pointerMove(event){const drag=dragRef.current;if(!drag)return;const moved=drag.moved||Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)>5;if(!moved)return;drag.moved=true;setDragging({from:drag.from,piece:drag.piece,x:event.clientX,y:event.clientY,over:squareAtPoint(event.clientX,event.clientY)});}
  function pointerUp(event){const drag=dragRef.current;if(!drag)return;dragRef.current=null;setDragging(null);if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);if(!drag.moved)return;suppressClick.current=true;window.setTimeout(()=>{suppressClick.current=false;},0);const to=squareAtPoint(event.clientX,event.clientY);if(to&&to!==drag.from)attemptMove(drag.from,to);}
  function pointerCancel(){dragRef.current=null;setDragging(null);}

  const rows=game.board();
  const positionText=rows.flatMap((row,rowIndex)=>row.map((piece,col)=>piece?`${files[col]}${8-rowIndex}: ${piece.color==='w'?t.white:t.black} ${t.pieces[piece.type]}`:null)).filter(Boolean).join(', ');
  return <div className="chess-column">
    <header className="chess-column-header"><div><strong>{t.column}</strong><span>{t.by} · {chessProfile.mode} {chessProfile.rating}</span></div><p>{orientation==='w'?t.white:t.black} {t.toMove} · {t.mateIn} {mateCount}</p></header>
    <div ref={boardRef} className={`mini-chess-board${wrong?' is-wrong':''}`} role="grid" aria-label={`${t.column}. ${orientation==='w'?t.white:t.black} ${t.toMove}.`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerCancel}>
      {rows.flatMap((row,rowIndex)=>row.map((piece,col)=>{const square=`${files[col]}${8-rowIndex}`,position=rowIndex*8+col,isLight=(rowIndex+col)%2===0,isSelected=selected===square,isLegal=legal.includes(square),isHint=hint===square,isCapture=isLegal&&Boolean(piece),isDragSource=dragging?.from===square;return <button ref={node=>{cellRefs.current[position]=node;}} key={square} data-square={square} type="button" role="gridcell" tabIndex={cursor===position?0:-1} className={`chess-square ${isLight?'light':'dark'}${isSelected?' selected':''}${isLegal?' legal':''}${isCapture?' capture':''}${isHint?' hint':''}${isDragSource?' drag-source':''}${dragging?.over===square?' drag-over':''}`} aria-label={`${square}${piece?`, ${piece.color==='w'?t.white:t.black} ${t.pieces[piece.type]}`:`, ${t.empty}`}${isCapture?', capture available':''}`} onFocus={()=>setCursor(position)} onKeyDown={event=>keyMove(event,position,square)} onClick={()=>{if(suppressClick.current){suppressClick.current=false;return;}choose(square);}}>{col===0&&<span className="board-coordinate rank-coordinate" aria-hidden="true">{8-rowIndex}</span>}{rowIndex===7&&<span className="board-coordinate file-coordinate" aria-hidden="true">{files[col]}</span>}{piece&&<img className={`chess-piece ${piece.color==='w'?'white':'black'}`} draggable="false" src={`/assets/chess/engraved-${piece.color==='w'?'light':'dark'}-${pieceNames[piece.type]}.png`} alt=""/>}{isLegal&&!piece&&<span className="legal-dot" aria-hidden="true"/>}</button>;}))}
      {solved&&<div className="chess-win-overlay" role="status"><div className="chess-confetti" aria-hidden="true">{confettiPieces.map((style,i)=><i key={i} style={style}/>)}</div><strong>{t.checkmate}</strong></div>}
    </div>
    {dragging&&<img className="chess-drag-piece" src={`/assets/chess/engraved-${dragging.piece.color==='w'?'light':'dark'}-${pieceNames[dragging.piece.type]}.png`} alt="" aria-hidden="true" style={{left:dragging.x,top:dragging.y}}/>}
    <div className="chess-controls"><button type="button" onClick={showHint}>{t.hint}</button><button type="button" onClick={showSolution}>{t.solution}</button><button type="button" onClick={nextPuzzle}>{t.next}</button></div>
    <details className="chess-position"><summary>{t.position}</summary><p>{positionText}</p><small>Lichess puzzle {puzzle.id} · CC0 · {puzzle.rating}</small></details>
    <div className="chess-status" aria-live="polite">{solved?'':status}</div>
    <p className="chess-challenge"><strong>{t.think}</strong> <span>{t.start}</span> <a href="#contact" onClick={onChallenge}>{t.challenge} →</a></p>
    <p className="also-likes"><strong>{t.also}</strong> {t.interests}</p>
  </div>;
}
