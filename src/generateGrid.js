export const directions = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];
function randomSource(seed) {
 let a=2166136261;for(const c of String(seed)) a=Math.imul(a^c.charCodeAt(0),16777619);
 return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};
}
export function occurrences(grid,word) {
 const found=new Set();
 for(let r=0;r<grid.length;r++)for(let c=0;c<grid[0].length;c++)for(const [dr,dc] of directions){
  if([...word].every((letter,i)=>grid[r+dr*i]?.[c+dc*i]===letter)){
   const cells=[...word].map((_,i)=>`${r+dr*i},${c+dc*i}`);found.add([cells.join('|'),[...cells].reverse().join('|')].sort()[0]);
  }
 }return found.size;
}
export function generateGrid(words,{cols=11,rows=13,seed=2026,horizontal=true}={}) {
 if(!Number.isInteger(cols)||!Number.isInteger(rows)||cols<1||rows<1)throw new Error('Invalid grid dimensions');
 words=words.map(w=>w.toUpperCase());
 if(!words.length||new Set(words).size!==words.length||words.some(w=>! /^[A-Z0-9]{2,}$/.test(w)))throw new Error('Use unique words of at least two letters or digits');
 if(words.some(w=>w.length>(horizontal?cols:Math.max(cols,rows))))throw new Error('A word is longer than the grid');
 const placementDirections=horizontal?[[0,1]]:directions;
 const random=randomSource(seed),shuffle=a=>a.map(v=>({v,n:random()})).sort((a,b)=>a.n-b.n).map(x=>x.v);
 const ordered=[...words].sort((a,b)=>b.length-a.length),alphabet=words.join('');
 if(horizontal && rows>=words.length){
  for(let attempt=0;attempt<500;attempt++){
   const grid=Array.from({length:rows},()=>Array.from({length:cols},()=>alphabet[Math.floor(random()*alphabet.length)]));
   const selectedRows=shuffle(Array.from({length:rows},(_,i)=>i));
   const placements=words.map((word,i)=>{const row=selectedRows[i],col=Math.floor(random()*(cols-word.length+1));[...word].forEach((letter,j)=>grid[row][col+j]=letter);return {word,row,col,dr:0,dc:1,endRow:row,endCol:col+word.length-1};});
   if(words.every(w=>occurrences(grid,w)===1))return {grid,placements};
  }
  throw new Error('Could not generate a unique horizontal layout');
 }
 for(let attempt=0;attempt<80;attempt++){
  const grid=Array.from({length:rows},()=>Array(cols).fill(null));const placements=[];let nodes=0;
  function place(index){
   if(++nodes>16000)return false;
   if(index===ordered.length)return words.every(w=>occurrences(grid,w)===1);
   const word=ordered[index],candidates=[];
   for(let row=0;row<rows;row++)for(let col=0;col<cols;col++)for(const [dr,dc] of placementDirections){
    const endRow=row+dr*(word.length-1),endCol=col+dc*(word.length-1);
    if(endRow<0||endRow>=rows||endCol<0||endCol>=cols)continue;
    if([...word].every((l,i)=>!grid[row+dr*i][col+dc*i]||grid[row+dr*i][col+dc*i]===l))candidates.push({word,row,col,dr,dc,endRow,endCol});
   }
   for(const p of shuffle(candidates)){
    const fresh=[];[...word].forEach((l,i)=>{const r=p.row+p.dr*i,c=p.col+p.dc*i;if(!grid[r][c])fresh.push([r,c]);grid[r][c]=l;});placements.push(p);
    if(words.every(w=>occurrences(grid,w)<=1)&&place(index+1))return true;
    placements.pop();fresh.forEach(([r,c])=>grid[r][c]=null);
   }return false;
  }
  if(!place(0))continue;
  const empty=[];grid.forEach((row,r)=>row.forEach((v,c)=>{if(!v)empty.push([r,c]);}));
  for(let fill=0;fill<500;fill++){
   empty.forEach(([r,c])=>grid[r][c]=alphabet[Math.floor(random()*alphabet.length)]);
   if(words.every(w=>occurrences(grid,w)===1))return {grid,placements};
  }
 }
 throw new Error('Could not place every word uniquely. Try a larger grid or a different seed.');
}
