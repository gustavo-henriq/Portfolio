import {animationConfig as config,animationCopy} from './config';
function Layer({depth=0}){const r=config.drosteWindow;return <div className={`droste-layer droste-level-${depth}`}><img src="/assets/portfolio-front-preview.png" alt=""/>{depth<config.drosteLevels-1&&<div className="droste-window" style={{left:`${r.x}%`,top:`${r.y}%`,width:`${r.w}%`,height:`${r.h}%`}}><Layer depth={depth+1}/></div>}</div>;}
export function Droste({language}){
 return <div className="droste-frame droste-static" role="img" aria-label={animationCopy[language].preview}><div className="droste-zoom"><Layer/></div></div>;
}
