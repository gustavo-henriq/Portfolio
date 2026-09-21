import {useEffect,useState} from 'react';
export function useReducedMotion(){
 const [reduced,setReduced]=useState(true);
 useEffect(()=>{const query=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{const value=query.matches||new URLSearchParams(window.location.search).get('motion')==='reduce';setReduced(value);document.documentElement.dataset.reducedMotion=String(value);};update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
 return reduced;
}
