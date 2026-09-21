import {writeFileSync} from 'node:fs';
import {buildGrid} from '../src/crossword-model.js';
const data = [
 ['PYTHON','Languages','Snake-named language behind most of my automations','Linguagem com nome de cobra por trás das minhas automações','Lenguaje con nombre de serpiente detrás de mis automatizaciones','jobhunter'],
 ['PLAYWRIGHT','Automation','Writes scripts for browsers, not theaters','Escreve roteiros para navegadores, não teatros','Escribe guiones para navegadores, no teatros','jobhunter'],
 ['MONGODB','Data & AI','Document database behind JobHunter','Banco de documentos por trás do JobHunter','Base de documentos detrás de JobHunter','jobhunter'],
 ['REACT','Web','Library this very page is built with','Biblioteca usada para construir esta página','Biblioteca con la que está hecha esta página','portfolio'],
 ['FASTAPI','Web','Python framework for fast APIs','Framework Python para APIs rápidas','Framework Python para APIs rápidas','lumiere'],
 ['ESP32','Hardware','Tiny chip that listens to the soil','Pequeno chip que escuta o solo','Pequeño chip que escucha al suelo','skills'],
 ['TELEGRAM','Automation','Messenger that delivers the job alerts','Mensageiro que entrega alertas de vagas','Mensajero que entrega las alertas de empleo','jobhunter'],
 ['JAVASCRIPT','Languages','Language that brings this newspaper to life','Linguagem que dá vida a este jornal','Lenguaje que da vida a este periódico','portfolio'],
 ['GEMINI','Data & AI','AI model matching candidates and vacancies','Modelo de IA que combina candidatos e vagas','Modelo de IA que conecta candidatos y vacantes','jobhunter'],
 ['GCP','Data & AI','Google’s cloud platform, in three letters','Nuvem do Google em três letras','Nube de Google en tres letras','jobhunter'],
].map(([answer,category,en,pt,es,project])=>({answer,category,clues:{en,pt,es},projectLink:`#${project}`}));
const size=15; let best=[]; let nodes=0;
function boardOf(placed) { const board=new Map(); for(const p of placed) [...p.answer].forEach((ch,i)=>{const r=p.row+(p.direction==='down'?i:0),c=p.col+(p.direction==='across'?i:0); const k=`${r},${c}`;const old=board.get(k);board.set(k,{ch,dirs:[...(old?.dirs||[]),p.direction]});});return board; }
function valid(p,board) {
 const dr=p.direction==='down'?1:0,dc=1-dr;
 if(p.row<0||p.col<0||p.row+dr*(p.answer.length-1)>=size||p.col+dc*(p.answer.length-1)>=size)return false;
 if(board.has(`${p.row-dr},${p.col-dc}`)||board.has(`${p.row+dr*p.answer.length},${p.col+dc*p.answer.length}`))return false;
 let crossings=0;
 for(let i=0;i<p.answer.length;i++){const r=p.row+dr*i,c=p.col+dc*i,old=board.get(`${r},${c}`);if(old){if(old.ch!==p.answer[i]||old.dirs.includes(p.direction))return false;crossings++;}else if(board.has(`${r-dc},${c-dr}`)||board.has(`${r+dc},${c+dr}`))return false;}
 return crossings>0;
}
function area(placed){const b=[...boardOf(placed).keys()].map(k=>k.split(',').map(Number));return (Math.max(...b.map(x=>x[0]))-Math.min(...b.map(x=>x[0]))+1)*(Math.max(...b.map(x=>x[1]))-Math.min(...b.map(x=>x[1]))+1);}
function search(placed,remaining) {
 if(++nodes>180000)return;
 if(placed.length>best.length||(placed.length===best.length&&area(placed)<area(best)))best=placed;
 if(!remaining.length)return true;
 const board=boardOf(placed);const candidates=[];
 for(const word of remaining)for(const [k,cell]of board){const [r,c]=k.split(',').map(Number);for(let i=0;i<word.answer.length;i++)if(word.answer[i]===cell.ch)for(const direction of ['across','down']){const p={...word,row:r-(direction==='down'?i:0),col:c-(direction==='across'?i:0),direction};if(valid(p,board))candidates.push(p);}}
 candidates.sort((a,b)=>area([...placed,a])-area([...placed,b])||b.answer.length-a.answer.length);
 const seen=new Set();for(const p of candidates){const k=`${p.answer}:${p.row}:${p.col}:${p.direction}`;if(seen.has(k))continue;seen.add(k);if(search([...placed,p],remaining.filter(w=>w.answer!==p.answer)))return true;}
 return false;
}
const first=data.find(w=>w.answer==='PLAYWRIGHT');search([{...first,row:7,col:2,direction:'across'}],data.filter(w=>w!==first));
const minRow=Math.min(...best.map(p=>p.row)),minCol=Math.min(...best.map(p=>p.col));const entries=best.map(p=>({...p,row:p.row-minRow,col:p.col-minCol}));
const model=buildGrid(entries);if(model.errors.length)throw Error(model.errors.join('\n'));
writeFileSync(new URL('../src/crossword-entries.json',import.meta.url),JSON.stringify(entries,null,2)+'\n');
console.log(JSON.stringify({included:entries.length,width:model.width,height:model.height,dropped:data.filter(w=>!best.some(p=>p.answer===w.answer)).map(w=>w.answer),nodes}));
