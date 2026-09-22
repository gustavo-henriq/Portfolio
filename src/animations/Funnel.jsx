import {useRef} from 'react';
import {gsap,useGSAP,playOnce} from './runtime';
import {animationConfig as config,animationCopy} from './config';
import {useReducedMotion} from './useReducedMotion';
export function Funnel({language}){
 const ref=useRef(null),reduced=useReducedMotion(),t=animationCopy[language];
 useGSAP(()=>{if(reduced)return;const mm=gsap.matchMedia();mm.add({desktop:'(min-width: 901px) and (prefers-reduced-motion: no-preference)',mobile:'(max-width: 900px) and (prefers-reduced-motion: no-preference)'},({conditions})=>{
 const root=ref.current,scene=conditions.desktop?root.closest('.jobhunter-project'):root,slips=[...root.querySelectorAll('.listing-slip')],bubble=root.querySelector('.match-bubble');
 const tl=gsap.timeline({paused:true});
 slips.forEach((slip,i)=>{const accepted=i<3;tl.fromTo(slip,{x:(i%8)*38+8,y:8+Math.floor(i/8)*24,opacity:1,scale:1},{x:accepted?145+i*13:(i%2?275:20),y:accepted?164:103,scale:accepted?.65:.3,opacity:accepted?1:0,duration:.6,ease:'none'},(i%8)*.025);});
 tl.fromTo(bubble,{scale:.75,opacity:0},{scale:1,opacity:1,transformOrigin:'center',duration:.2},.72);const trigger=playOnce(scene,tl,'top 82%');return()=>trigger.kill();
 });return()=>mm.revert();},{scope:ref,dependencies:[reduced,language],revertOnUpdate:true});
 return <figure className="job-funnel" ref={ref}><svg viewBox="0 0 340 230" role="img" aria-label={t.funnel}><path className="funnel-outline" d="M60 85H280L190 145V166H150V145Z"/>{Array.from({length:config.funnelSlips},(_,i)=><g key={i} className="listing-slip" opacity={i<3?1:0} transform={`translate(${145+i%3*13} 164) scale(.65)`}><rect width="22" height="27"/><path d="M4 7h14M4 12h10M4 17h12"/>{i>=3&&<path className="reject-x" d="M5 5l12 14M17 5L5 19"/>}</g>)}<g className="match-bubble"><rect x="62" y="194" width="218" height="29" rx="2"/><path d="m75 203 16-4-6 15-3-7-7-4 7 4 9-8"/><text x="100" y="213">{t.match}</text></g></svg><figcaption>{t.demo}</figcaption></figure>;
}
