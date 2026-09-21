export function buildGrid(entries) {
  const cells = {}; const errors = [];
  const key = (r,c) => `${r},${c}`;
  const words = entries.map((entry, id) => ({ ...entry, id, cells: [...entry.answer].map((letter, i) => {
    const row = entry.row + (entry.direction === 'down' ? i : 0);
    const col = entry.col + (entry.direction === 'across' ? i : 0);
    const k = key(row,col);
    if (cells[k] && cells[k].letter !== letter) errors.push(`Conflict at ${k}`);
    cells[k] ??= { row,col,letter,entries:[] };
    cells[k].entries.push(id);
    return k;
  }) }));
  const height = Math.max(...Object.values(cells).map(c => c.row)) + 1;
  const width = Math.max(...Object.values(cells).map(c => c.col)) + 1;
  let number = 0;
  for (let r=0;r<height;r++) for(let c=0;c<width;c++) {
    const cell = cells[key(r,c)]; if (!cell) continue;
    for (const [direction,dr,dc] of [['across',0,1],['down',1,0]]) {
      if (cells[key(r-dr,c-dc)] || !cells[key(r+dr,c+dc)]) continue;
      const run=[]; let rr=r,cc=c;
      while(cells[key(rr,cc)]) {run.push(key(rr,cc));rr+=dr;cc+=dc;}
      const declared=words.find(w=>w.direction===direction && w.cells.join('|')===run.join('|'));
      if (!declared) errors.push(`Undeclared ${direction} run at ${r},${c}`);
      if(!cell.number) cell.number=++number;
      if(declared) declared.number=cell.number;
    }
  }
  return {cells,words,height,width,errors};
}
