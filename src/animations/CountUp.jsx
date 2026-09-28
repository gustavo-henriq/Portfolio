import {useRef} from 'react';
import {gsap,ScrollTrigger,useGSAP,debugMarkers} from './runtime';
import {animationConfig as config,localeFor} from './config';
import {useReducedMotion} from './useReducedMotion';
export function CountUp({value,suffix='',language='EN'}){
 const ref=useRef(null),reduced=useReducedMotion(),final=new Intl.NumberFormat(localeFor(language)).format(value)+suffix;
 useGSAP(()=>{const el=ref.current;if(reduced){el.textContent=final;return;}const rect=el.getBoundingClientRect();if(rect.bottom<0){el.textContent=final;return;}
  const counter={value:0},siblings=[...el.closest('article').querySelectorAll('.count-value')],format=new Intl.NumberFormat(localeFor(language));
  el.textContent=`0${suffix}`;
  const tl=gsap.timeline({paused:true}).to(counter,{value,delay:Math.max(0,siblings.indexOf(el))*config.countStagger,duration:config.countDuration,ease:'power2.out',onUpdate:()=>{el.textContent=format.format(Math.round(counter.value))+suffix;},onComplete:()=>{el.textContent=final;}});
  const trigger=ScrollTrigger.create({trigger:el,start:config.onceStart,markers:debugMarkers(),onEnter:()=>tl.play(),onLeave:()=>tl.progress(1).pause()});
  if(rect.top<window.innerHeight*.85)tl.play();
  return()=>{trigger.kill();tl.kill();el.textContent=final;};
 },{scope:ref,dependencies:[value,suffix,language,reduced],revertOnUpdate:true});
 return <span className="count-up count-value" ref={ref} aria-label={final} style={{minWidth:`${final.length}ch`,textAlign:'right'}}>{final}</span>;
}
export function NumberedText({text,language}){return text.split(/(600\+|1,000\+|82%)/g).map((part,i)=>/^(600\+|1,000\+|82%)$/.test(part)?<CountUp key={i} value={Number(part.replace(/[^0-9]/g,''))} suffix={part.endsWith('%')?'%':'+'} language={language}/>:part);}
