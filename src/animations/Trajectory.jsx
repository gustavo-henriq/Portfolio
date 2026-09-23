import {useRef} from 'react';
import {gsap,useGSAP,debugMarkers} from './runtime';
import {animationConfig as config} from './config';
import {useReducedMotion} from './useReducedMotion';
import {links} from '../links';
export const milestones=[
 {id:'study',progress:.08,year:2024,headline:{EN:'Information Systems',PT:'Sistemas de Informação',ES:'Sistemas de Información'},postmark:'RECIFE, PE'},
 {id:'lumiere',progress:.25,year:2025,headline:{EN:'Lumière',PT:'Lumière',ES:'Lumière'},postmark:'LUMIÈRE'},
 {id:'move',progress:.42,year:2026,headline:{EN:'Moved to São Paulo',PT:'Mudança para São Paulo',ES:'Mudanza a São Paulo'},postmark:'SÃO PAULO, SP'},
 {id:'jobhunter',progress:.59,year:2026,headline:{EN:'Released JobHunter',PT:'Lançamento do JobHunter',ES:'Lanzamiento de JobHunter'},postmark:'JOBHUNTER',href:links.jobhunter},
 {id:'hughes',progress:.76,year:2026,headline:{EN:'Joined Hughes Telecom',PT:'Ingresso na Hughes Telecom',ES:'Ingreso en Hughes Telecom'},postmark:'HUGHES TELECOM'},
 {id:'ai',progress:.94,year:2026,headline:{EN:'Artificial Intelligence',PT:'Inteligência Artificial',ES:'Inteligencia Artificial'},postmark:'UNIVESP'},
];
const routes={desktop:'M40 400 C170 270 240 345 360 280 S540 280 625 200 S780 160 950 45',mobile:'M180 45 C48 105 48 150 180 190 S312 270 180 350 S48 445 180 520 S312 600 180 675 S78 745 180 800'};
export function Trajectory({t,language}){
 const root=useRef(null),reduced=useReducedMotion();
 useGSAP(()=>{const mm=gsap.matchMedia();mm.add({desktop:`(min-width: ${config.desktopMin}px)`,mobile:`(max-width: ${config.desktopMin-1}px)`},({conditions})=>{
 const mobile=conditions.mobile,svg=root.current.querySelector(mobile?'.route-mobile':'.route-desktop'),path=svg.querySelector('.route-line'),plane=svg.querySelector('.paper-plane'),length=path.getTotalLength();
 const cards=[...root.current.querySelectorAll('.route-milestone')];cards.forEach((card,i)=>{
  const point=path.getPointAtLength(length*milestones[i].progress);
  let left=point.x/(mobile?360:1000)*100,top=point.y/(mobile?900:450)*100;
  // Give the six mobile captions their own rows inside the fixed paper stage.
  if(mobile)top=[4,20,36,52,68,84][i];
  if(mobile&&i===4)left=Math.min(left,55); // Clear the persistent contact shortcut.
  if(i===milestones.length-1){left=Math.min(left,mobile?72:89);if(!mobile)top=Math.min(top,76);}
  card.style.left=`${left}%`;card.style.top=`${top}%`;
 });
 if(reduced)return;
 const state={progress:0},stage=root.current.querySelector('.route-stage');const tl=gsap.timeline({scrollTrigger:{trigger:stage,start:()=>window.innerWidth<700?'top 18%':'top 20%',end:()=>`+=${window.innerHeight*config.trajectoryScrollVh/100}`,pin:stage,pinSpacing:true,anticipatePin:1,scrub:config.trajectoryScrub,markers:debugMarkers(),invalidateOnRefresh:true}});
 tl.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:1,ease:'none'},0);
 tl.to(state,{progress:1,duration:1,ease:'none',onUpdate:()=>{const distance=length*state.progress,p=path.getPointAtLength(distance),q=path.getPointAtLength(Math.min(length,distance+1)),angle=Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI;plane.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${angle})`);}},0);
 cards.forEach((card,i)=>{tl.fromTo(card.querySelector('.route-pin'),{scale:1.6,rotation:-12,opacity:0},{scale:1,rotation:0,opacity:1,duration:.08,ease:config.stampEase},milestones[i].progress-.04);tl.fromTo(card.querySelector('.route-postmark'),{scale:1.4,rotation:8,opacity:0},{scale:1,rotation:-3,opacity:1,duration:.08,ease:config.stampEase},milestones[i].progress-.04);});
 return()=>{cards.forEach(c=>{c.style.left='';c.style.top='';});};
 });return()=>mm.revert();},{scope:root,dependencies:[reduced,language],revertOnUpdate:true});
 return <section className="trajectory-section animated-trajectory" id="trajectory" ref={root}><header><h2>{t.trajectoryTitle}</h2></header><div className="route-stage"><img src="/assets/recife-stamp.png" alt="" className="stamp recife" aria-hidden="true"/>{Object.entries(routes).map(([kind,d])=><svg key={kind} className={`route-svg route-${kind}`} viewBox={kind==='mobile'?'0 0 360 900':'0 0 1000 450'} preserveAspectRatio="none" aria-hidden="true"><path className="route-guide" d={d}/><path className="route-line" d={d}/><g className="paper-plane" transform={kind==='mobile'?'translate(180 870)':'translate(950 45)'}><path d="M-12-7 13 0-12 7-5 0Z"/></g></svg>)}{milestones.map((event,i)=><article className={`route-milestone route-event-${i}`} key={event.id}><span className="route-pin" aria-hidden="true">⌖</span><time>{event.year}</time><h3>{event.href?<a href={event.href} target="_blank" rel="noreferrer">{event.headline[language]}</a>:event.headline[language]}</h3><p className="route-postmark">{event.postmark}</p></article>)}</div></section>;
}
