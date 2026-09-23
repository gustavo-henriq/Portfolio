import {useRef} from 'react';
import {gsap,useGSAP,playOnce} from './runtime';
import {animationConfig as config,localeFor} from './config';
import {useReducedMotion} from './useReducedMotion';
export function CountUp({value,suffix='',language='EN'}){
 const ref=useRef(null),reduced=useReducedMotion(),final=new Intl.NumberFormat(localeFor(language)).format(value)+suffix;
 useGSAP(()=>{const el=ref.current;if(reduced){el.textContent=final;return;}const counter={value:0},siblings=[...el.closest('article').querySelectorAll('.count-value')];const tl=gsap.timeline({paused:true}).to(counter,{value,delay:Math.max(0,siblings.indexOf(el))*config.countStagger,duration:config.countDuration,ease:'power2.out',onUpdate:()=>{el.textContent=new Intl.NumberFormat(localeFor(language)).format(Math.round(counter.value))+suffix;},onComplete:()=>{el.textContent=final;}});playOnce(el,tl,config.onceStart);return()=>{el.textContent=final;};},{scope:ref,dependencies:[value,suffix,language,reduced],revertOnUpdate:true});
 return <span className="count-up count-value" ref={ref}>{final}</span>;
}
export function NumberedText({text,language}){return text.split(/(600\+|1,000\+|82%)/g).map((part,i)=>/^(600\+|1,000\+|82%)$/.test(part)?<CountUp key={i} value={Number(part.replace(/[^0-9]/g,''))} suffix={part.endsWith('%')?'%':'+'} language={language}/>:part);}
