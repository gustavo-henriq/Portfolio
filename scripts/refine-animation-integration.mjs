import fs from 'node:fs';
let app=fs.readFileSync('src/App.jsx','utf8');
app=app.replace('import { FoundPoster }','import { FoundPoster, Poster }');
app=app.replace('<article className="missing-card"><h1>{t.missing}</h1>','<Poster title={t.missing}>');
app=app.replace('</div></article><article className="lead-story">','</div></Poster><article className="lead-story">');
app=app.replace('<strong>MORE RESULTS,<br />REDUCED COSTS!</strong>','<strong className="paint-results"><Highlight>{language === "PT" ? "MAIS RESULTADOS," : language === "ES" ? "MÁS RESULTADOS," : "MORE RESULTS,"}</Highlight><br /><Highlight>{language === "PT" ? "MENOS CUSTOS!" : language === "ES" ? "¡MENOS COSTES!" : "REDUCED COSTS!"}</Highlight></strong>');
fs.writeFileSync('src/App.jsx',app);
