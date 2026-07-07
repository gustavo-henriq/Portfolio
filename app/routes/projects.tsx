import "../styles/projects.css";
import { JobHunterSection } from "../components/JobHunterSection";
import { Reveal } from "../components/Reveal";
import type { Language } from "../types";
import type { MouseEvent } from "react";


const secondaryProjects = [
    {
        name: "Lumiere",
        oneLiner: "A web app that recommends films you'll actually want to watch — powered by real-time data from a global movie database.",
        oneLinerPt: "Um app web que recomenda filmes que você realmente vai querer assistir — com dados em tempo real de uma base global de cinema.",
        description: "Built with React and a REST API integration, Lumiere lets users discover movies based on genre, mood, and popularity — with a clean interface that makes browsing feel effortless.",
        descriptionPt: "Construído com React e integração REST API, o Lumiere permite descobrir filmes por gênero, clima e popularidade — com uma interface limpa que deixa a navegação leve.",
        stack: "React · REST API · JavaScript",
        image: "/images/American-Psycho.avif",
        logo: "/images/LogoLumiere.svg",
        liveLink: "https://gustavo-henriq.github.io/Lumiere/",
        sourceLink: "https://github.com/gustavo-henriq/Lumiere",
    },
];

export function Projects({ language }: { language: Language }) {
    function handleProjectMove(event: MouseEvent<HTMLDivElement>) {
        if (window.matchMedia("(max-width: 860px), (prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const card = event.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.setProperty("--tilt-y", `${x * 5}deg`);
        card.style.setProperty("--tilt-x", `${y * -4}deg`);
    }

    function resetProjectTilt(event: MouseEvent<HTMLDivElement>) {
        event.currentTarget.style.setProperty("--tilt-y", "0deg");
        event.currentTarget.style.setProperty("--tilt-x", "0deg");
    }

    return (
        <section id="projects" className="projectsContainer">
            <h2 className="projectsHeadliner"><span className="bold">{language === "en" ? "Projects" : "Projetos"}</span></h2>
            <div className="projects">
                <JobHunterSection language={language} />

                <div className="secondaryProjects">
                    {secondaryProjects.map((project, index) => (
                        <Reveal
                            key={project.name}
                            className="project secondaryProject lumiereProject"
                            delay={(index + 1) * 120}
                            onMouseMove={handleProjectMove}
                            onMouseLeave={resetProjectTilt}
                        >
                            <div className="projectPreview lumierePreview" aria-hidden="true">
                                <img
                                    className="lumiereBlurBackdrop"
                                    src={project.image}
                                    alt=""
                                    width="1365"
                                    height="629"
                                />
                                <img
                                    className="lumiereSceneImage"
                                    src={project.image}
                                    alt=""
                                    width="1365"
                                    height="629"
                                />
                            </div>

                            <div className="projectContent">
                                <img
                                    className="lumiereTitleLogo"
                                    src={project.logo}
                                    alt={project.name}
                                    width="167"
                                    height="72"
                                />
                                <p className="projectProof">
                                    {language === "en" ? project.oneLiner : project.oneLinerPt}
                                </p>
                                <p className="projectDescription">
                                    {language === "en" ? project.description : project.descriptionPt}
                                </p>
                                <div className="projectMeta compact">
                                    <p>{project.stack}</p>
                                </div>
                                <div className="projectActions">
                                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                        {language === "en" ? "Live →" : "Abrir →"}
                                    </a>
                                    <a href={project.sourceLink} target="_blank" rel="noopener noreferrer">GitHub →</a>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
