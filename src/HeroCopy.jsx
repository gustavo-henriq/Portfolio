import { NumberedText } from './animations/CountUp';

const heroCopy = {
  EN: {
    intro: "I'm Guto, a developer in São Paulo, Brazil, working with teams and clients around the world. I build software and automations, with or without AI, mostly in Python and JavaScript, and I like problems where a good script gives people hours of their week back.",
    bridge: "Here's what that looks like in practice:",
    services: [
      ["AUTOMATION.", "Repetitive work, gone. I build bots that monitor, collect and report on their own."],
      ["AI INTEGRATION.", "Language models where they actually earn their keep: scoring, classifying and summarizing. JobHunter uses the Gemini API to rate job matches, and its data pipeline cut the requests to the AI API by 82%."],
      ["SOFTWARE.", "Web apps from the interface to the back end, with JavaScript and React on the front and Python (FastAPI) behind it."],
    ],
    process: "I like to start with the boring question: what is slowing you down? Then I build a small working piece early, so you can see it, test it and tell me what to change.",
    cta: "FIND MY STACK ↓",
  },
  PT: {
    intro: "Sou Guto, desenvolvedor em São Paulo, Brasil, trabalhando com equipes e clientes ao redor do mundo. Construo softwares e automações, com ou sem IA, principalmente em Python e JavaScript, e gosto de problemas em que um bom script devolve horas da semana às pessoas.",
    bridge: "Na prática, isso funciona assim:",
    services: [
      ["AUTOMAÇÃO.", "Trabalho repetitivo, eliminado. Construo bots que monitoram, coletam e geram relatórios por conta própria."],
      ["INTEGRAÇÃO COM IA.", "Modelos de linguagem onde realmente fazem diferença: pontuação, classificação e resumo. O JobHunter usa a API Gemini para avaliar a compatibilidade de vagas, e seu pipeline de dados reduziu as requisições à API de IA em 82%."],
      ["SOFTWARE.", "Aplicações web da interface ao back-end, com JavaScript e React no front-end e Python (FastAPI) por trás."],
    ],
    process: "Gosto de começar pela pergunta mais simples: o que está atrasando você? Depois construo uma pequena parte funcional desde cedo, para você ver, testar e dizer o que precisa mudar.",
    cta: "ENCONTRE MINHA STACK ↓",
  },
  ES: {
    intro: "Soy Guto, desarrollador en São Paulo, Brasil, y trabajo con equipos y clientes de todo el mundo. Construyo software y automatizaciones, con o sin IA, principalmente en Python y JavaScript, y me gustan los problemas en los que un buen script devuelve horas de la semana a las personas.",
    bridge: "En la práctica, esto se ve así:",
    services: [
      ["AUTOMATIZACIÓN.", "El trabajo repetitivo desaparece. Construyo bots que supervisan, recopilan y generan informes por sí solos."],
      ["INTEGRACIÓN CON IA.", "Modelos de lenguaje donde realmente son útiles: puntuación, clasificación y resumen. JobHunter utiliza la API de Gemini para valorar la compatibilidad de las vacantes, y su pipeline de datos redujo las solicitudes a la API de IA en un 82%."],
      ["SOFTWARE.", "Aplicaciones web desde la interfaz hasta el back-end, con JavaScript y React en el front-end y Python (FastAPI) detrás."],
    ],
    process: "Me gusta empezar con la pregunta sencilla: ¿qué te está haciendo perder tiempo? Luego construyo pronto una pequeña parte funcional para que puedas verla, probarla y decirme qué cambiar.",
    cta: "DESCUBRE MI STACK ↓",
  },
};

export function HeroCopy({ language }) {
  const content = heroCopy[language] || heroCopy.EN;

  return (
    <div className="lead-copy hero-service-copy">
      <p>{content.intro}</p>
      <p className="hero-bridge">{content.bridge}</p>
      <dl className="hero-services">
        {content.services.map(([label, description]) => (
          <div key={label}>
            <dt>{label}</dt>{' '}
            <dd><NumberedText language={language} text={description} /></dd>
          </div>
        ))}
      </dl>
      <p>{content.process}</p>
      <a className="hero-stack-link" href="#skills">[ {content.cta} ]</a>
    </div>
  );
}
