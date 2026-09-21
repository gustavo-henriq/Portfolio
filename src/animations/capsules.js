import {useRef} from 'react';
import {gsap,useGSAP,debugMarkers} from './runtime';
import {animationConfig as config} from './config';
import {useReducedMotion} from './useReducedMotion';
// Actual SVG lengths avoid the non-scaling-stroke/pathLength browser dash bug.
export function drawCapsule(element,{delay=0,paused=false}={}){
 const paths=[...element.querySelectorAll('path')];const tl=gsap.timeline({paused,delay});
 paths.forEach(path=>{const length=path.getTotalLength();tl.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:config.capsuleDuration,ease:'power1.out',onComplete:()=>gsap.set(path,{strokeDasharray:'none'})},0);});return tl;
}
export function useCapsules(scope,found,playing,seed){
 const reduced=useReducedMotion(),seen=useRef(new Set()),entered=useRef(false);
 useGSAP(()=>{if(reduced)return;const root=scope.current;if(!root)return;const groups=[...root.querySelectorAll('.capsule[data-word]')];
 const fresh=groups.filter(el=>!seen.current.has(el.dataset.word));seen.current=new Set(found);
 if(!playing&&!entered.current){const mm=gsap.matchMedia();mm.add({desktop:'(min-width: 901px)',mobile:'(max-width: 900px)'},({conditions})=>{if(entered.current)return;const board=root.querySelector('.word-search-board'),scene=conditions.desktop?root.closest('.play-grid'):board;const tl=gsap.timeline({scrollTrigger:{trigger:scene,start:()=>conditions.mobile?'top 94px':'top 112px',end:()=>`+=${window.innerHeight*config.capsuleScrollVh/100}`,pin:scene,pinSpacing:true,anticipatePin:1,scrub:.45,markers:debugMarkers(),invalidateOnRefresh:true,onLeave:()=>{entered.current=true;}}});groups.forEach((el,i)=>{tl.add(drawCapsule(el),i*config.capsuleStagger);const mark=root.querySelector(`[data-skill="${el.dataset.word}"] .skill-strike`);if(mark)tl.fromTo(mark,{scaleX:0},{scaleX:1,duration:config.capsuleDuration},i*config.capsuleStagger);});});return()=>mm.revert();}
 else fresh.forEach(el=>drawCapsule(el));
 },{scope,dependencies:[found.join('|'),seed,reduced],revertOnUpdate:true});
}
