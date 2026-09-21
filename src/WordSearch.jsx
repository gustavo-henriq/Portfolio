import {useMemo,useRef,useState} from 'react';
import {stack} from './stack';
import {generateGrid} from './generateGrid';
import './word-search.css';
import './word-search-font.css';
import {useCapsules} from './animations/capsules';
const messages={EN:['DISCOVER MY STACK!','PLAY','Reset','Reveal all','Shuffle','FOUND','Skip puzzle','Drag across a word. Keyboard: arrows to move, Space to start and finish.','Congratulations! Now let’s talk','Word search containing my ten technology skills'],PT:['DESCUBRA MINHA STACK!','JOGAR','Reiniciar','Revelar tudo','Embaralhar','ENCONTRADAS','Pular jogo','Arraste sobre uma palavra. Teclado: setas para mover, Espaço para iniciar e terminar.','Parabéns! Vamos conversar','Caça-palavras com minhas dez tecnologias'],ES:['¡DESCUBRE MI STACK!','JUGAR','Reiniciar','Revelar todo','Mezclar','ENCONTRADAS','Saltar juego','Arrastra sobre una palabra. Teclado: flechas para mover, Espacio para iniciar y terminar.','¡Felicidades! Hablemos','Sopa de letras con mis diez tecnologías']};
function snap(start,end,cols,rows){
 const dx=end.col-start.col,dy=end.row-start.row,angle=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4;
 const dc=Math.round(Math.cos(angle)),dr=Math.round(Math.sin(angle));let length=Math.round((dx*dc+dy*dr)/(dc*dc+dr*dr));
 while(length>0&&(start.col+dc*length<0||start.col+dc*length>=cols||start.row+dr*length<0||start.row+dr*length>=rows))length--;
 return {...start,dr,dc,endRow:start.row+dr*length,endCol:start.col+dc*length,length:length+1};
}
function Capsule({p,invalid=false}){const distance=Math.hypot(p.endCol-p.col,p.endRow-p.row),angle=Math.atan2(p.endRow-p.row,p.endCol-p.col)*180/Math.PI,d=`M0 -.42 H${distance} A.42 .42 0 0 1 ${distance} .42 H0 A.42 .42 0 0 1 0 -.42Z`;return <g data-word={p.word} className={invalid?'capsule rejected':'capsule'} transform={`translate(${p.col+.5} ${p.row+.5}) rotate(${angle})`}><path className="registration" d={d}/><path d={d}/></g>;}
export function WordSearch({language='EN',cols=11,rows=13}){
 const t=messages[language]||messages.EN,board=useRef(null),scope=useRef(null),drag=useRef(null),timer=useRef(null);
 const [seed,setSeed]=useState(2026),[found,setFound]=useState(stack.map(s=>s.word)),[playing,setPlaying]=useState(false),[preview,setPreview]=useState(null),[invalid,setInvalid]=useState(false),[cursor,setCursor]=useState({row:0,col:0}),[start,setStart]=useState(null),[announcement,setAnnouncement]=useState('');
 const {grid,placements}=useMemo(()=>generateGrid(stack.map(s=>s.word),{cols,rows,seed}),[cols,rows,seed]);
 useCapsules(scope,found,playing,seed);
 function position(event){const b=board.current.getBoundingClientRect();return {row:Math.max(0,Math.min(rows-1,Math.floor((event.clientY-b.top)/b.height*rows))),col:Math.max(0,Math.min(cols-1,Math.floor((event.clientX-b.left)/b.width*cols)))};}
 function finish(p){if(!p)return;const letters=Array.from({length:p.length},(_,i)=>grid[p.row+p.dr*i][p.col+p.dc*i]).join('');const match=stack.find(s=>s.word===letters||s.word===[...letters].reverse().join(''));
  if(match&&!found.includes(match.word)){setFound(v=>[...v,match.word]);setAnnouncement(`${match.word} — ${t[5]}`);setPreview(null);}else{setInvalid(true);clearTimeout(timer.current);timer.current=setTimeout(()=>{setPreview(null);setInvalid(false);},400);}setStart(null);
 }
 function reset(){clearTimeout(timer.current);drag.current=null;setFound([]);setPlaying(true);setPreview(null);setInvalid(false);setStart(null);setCursor({row:0,col:0});setAnnouncement('');}
 function key(e){if(!playing)return;if(e.key.startsWith('Arrow')){e.preventDefault();const next={row:Math.max(0,Math.min(rows-1,cursor.row+(e.key==='ArrowDown'?1:e.key==='ArrowUp'?-1:0))),col:Math.max(0,Math.min(cols-1,cursor.col+(e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0)))};setCursor(next);if(start)setPreview(snap(start,next,cols,rows));}else if(e.key===' '){e.preventDefault();if(start)finish(snap(start,cursor,cols,rows));else{setStart(cursor);setPreview(snap(cursor,cursor,cols,rows));}}else if(e.key==='Escape'){setStart(null);setPreview(null);}}
 return <section ref={scope} className="word-search-card" id="skills" aria-labelledby="word-search-title"><h2 id="word-search-title">{t[0]}</h2><a className="skip-puzzle" href="#stack-answers">{t[6]}</a><p className="puzzle-help" id="puzzle-help">{t[7]}</p><div className="word-search-board" ref={board} style={{'--cols':cols}} tabIndex="0" role="group" aria-label={t[9]} aria-describedby="puzzle-help" onKeyDown={key}
 onPointerDown={e=>{if(!playing||e.button>0)return;clearTimeout(timer.current);setInvalid(false);e.currentTarget.focus({preventScroll:true});e.currentTarget.setPointerCapture(e.pointerId);drag.current=position(e);setCursor(drag.current);setPreview(snap(drag.current,drag.current,cols,rows));}}
 onPointerMove={e=>{if(drag.current)setPreview(snap(drag.current,position(e),cols,rows));}}
 onPointerUp={e=>{if(drag.current){finish(snap(drag.current,position(e),cols,rows));drag.current=null;}if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}}
 onPointerCancel={()=>{drag.current=null;setPreview(null);}}>
 {grid.flatMap((row,r)=>row.map((letter,c)=><span aria-hidden="true" key={`${r}-${c}`} className={playing&&cursor.row===r&&cursor.col===c?'word-search-letter cursor':'word-search-letter'}>{letter}</span>))}
 <svg aria-hidden="true" viewBox={`0 0 ${cols} ${rows}`} className="word-search-overlay">{placements.filter(p=>found.includes(p.word)).map(p=><Capsule key={p.word} p={p}/>)}{preview&&<Capsule p={preview} invalid={invalid}/>}</svg></div>
 <div className="word-search-key"><ul id="stack-answers" tabIndex="-1">{stack.map(s=><li data-skill={s.word} key={s.word} className={found.includes(s.word)?'found':''}>{s.projects.length?<a href={`#${s.projects[0]}`} title={s.category}>{s.word}</a>:<span title={s.category}>{s.word}</span>}<span className="skill-strike" aria-hidden="true"/></li>)}</ul><div className="found-badge" aria-label={`${found.length}/${stack.length} ${t[5]}`}><span>{found.length}/{stack.length}<small>{t[5]}</small></span></div></div>
 <div className="word-search-controls"><button className="hand-note" onClick={reset}>{playing?t[2]:t[1]}</button><button onClick={()=>{setFound(stack.map(s=>s.word));setPreview(null);setStart(null);}}>{t[3]}</button><button onClick={()=>{reset();setSeed(s=>s+1);}}>{t[4]}</button></div><div className="puzzle-status" aria-live="polite">{playing&&found.length===stack.length?<a href="#contact">{t[8]} →</a>:announcement}</div></section>;
}
