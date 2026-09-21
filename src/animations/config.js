export const animationConfig = {
  headerScroll: 200, headerScale: .82,
  countDuration: 1.2, countStagger: .12, onceStart: 'top 85%',
  capsuleDuration: .55, capsuleStagger: .15, capsuleScrollVh: 105,
  trajectoryScrub: .6, trajectoryScrollVh: 135,
  stampDuration: .25, stampEase: 'back.out(1.5)',
  funnelScrollVh: 80, funnelSlips: 24,
  drosteLevels: 4, drosteWindow: {x:56,y:52,w:38,h:38},
  desktopMin: 1024, foundStart: 'center 75%',
};
export const localeFor = language => ({PT:'pt-BR',EN:'en-US',ES:'es-ES'}[language] || 'en-US');
export const animationCopy={
 EN:{page:'PAGE',index:'Section index',sections:['PROJECTS','STACK','TRAJECTORY','CONTACT'],theme:'Change color mode',funnel:'JobHunter filters job listings and delivers a match',match:'New match · 92%',demo:'Illustrated workflow',duplicate:'duplicate',found:'FOUND!',poster:'Compact missing poster',top:'Front page',preview:'Nested preview of this portfolio'},
 PT:{page:'PÁG.',index:'Índice de seções',sections:['PROJETOS','STACK','TRAJETÓRIA','CONTATO'],theme:'Alterar tema',funnel:'JobHunter filtra vagas e entrega uma correspondência',match:'Nova vaga · 92%',demo:'Fluxo ilustrativo',duplicate:'duplicada',found:'ENCONTRADO!',poster:'Cartaz compacto',top:'Primeira página',preview:'Prévia recursiva deste portfólio'},
 ES:{page:'PÁG.',index:'Índice de secciones',sections:['PROYECTOS','STACK','TRAYECTORIA','CONTACTO'],theme:'Cambiar tema',funnel:'JobHunter filtra ofertas y entrega una coincidencia',match:'Nueva oferta · 92%',demo:'Flujo ilustrativo',duplicate:'duplicada',found:'¡ENCONTRADO!',poster:'Cartel compacto',top:'Primera página',preview:'Vista recursiva de este portafolio'},
};
