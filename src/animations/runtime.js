import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {useGSAP} from '@gsap/react';
gsap.registerPlugin(ScrollTrigger,MotionPathPlugin,useGSAP);
ScrollTrigger.config({ignoreMobileResize:true});
export {gsap,ScrollTrigger,useGSAP};
export const debugMarkers=()=>typeof window!=='undefined'&&new URLSearchParams(window.location.search).get('debug')==='anim';
// Set up inside a GSAP context: fast anchor jumps always finish the animation.
export function playOnce(element,timeline,start='top 85%'){
 const trigger=ScrollTrigger.create({trigger:element,start,markers:debugMarkers(),onEnter:()=>timeline.play(),onLeave:()=>timeline.progress(1).pause(),onRefresh:self=>{if(self.progress>0||element.getBoundingClientRect().bottom<0)timeline.progress(1).pause();}});
 if(element.getBoundingClientRect().top<window.innerHeight*.85)timeline.progress(1).pause();
 return trigger;
}
