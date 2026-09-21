import {useRef} from 'react';
import {gsap,useGSAP,playOnce} from './runtime';
import {animationConfig as config,animationCopy} from './config';
import {useReducedMotion} from './useReducedMotion';
// The compact poster uses the same photo and newspaper heading as the hero.
export function Poster({compact=false,title,children}){const Heading=compact?'h2':'h1';return <article className={compact?'missing-card compact-poster':'missing-card'}><Heading>{title}</Heading>{children}</article>;}
export function FoundPoster({language,title}){
 const root=useRef(null),reduced=useReducedMotion(),t=animationCopy[language];
 useGSAP(()=>{if(reduced)return;const el=root.current,tl=gsap.timeline({paused:true});tl.fromTo(el.querySelector('.found-stamp'),{scale:3,opacity:0},{scale:1,opacity:1,duration:config.stampDuration,ease:'power4.in'}).to(el.querySelector('.compact-poster'),{x:2,rotation:1,duration:.045,repeat:3,yoyo:true}).set(el.querySelector('.compact-poster'),{clearProps:'transform'}).fromTo(el.querySelector('.ink-splat'),{opacity:.35,scale:.9},{opacity:0,scale:1.1,duration:.25},config.stampDuration);playOnce(el,tl,config.foundStart);},{scope:root,dependencies:[reduced],revertOnUpdate:true});
 return <div className="found-poster" ref={root}><Poster compact title={title}><img src="/assets/gustavo-portrait-large-pixels.png" alt={t.poster}/><strong>GUTO</strong></Poster><span className="found-stamp" aria-hidden="true">{t.found}</span><span className="ink-splat" aria-hidden="true"/><span className="sr-only">{t.found}</span></div>;
}
