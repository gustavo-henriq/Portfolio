import { Fragment, useEffect, useRef, type MouseEvent } from "react";
import type { Language } from "../types";
import "../styles/jobHunterSection.css";

const flowCards = [
    {
        key: "bronze",
        title: "Bronze Layer",
        titlePt: "Camada Bronze",
        description: "Raw job listings scraped from multiple sources via Playwright",
        descriptionPt: "Vagas brutas coletadas de múltiplas fontes via Playwright",
    },
    {
        key: "silver",
        title: "Silver Layer",
        titlePt: "Camada Prata",
        description: "Cleaned, deduplicated and structured into consistent fields",
        descriptionPt: "Dados limpos, sem duplicatas e estruturados em campos consistentes",
    },
    {
        key: "gold",
        title: "Gold Layer",
        titlePt: "Camada Ouro",
        description: "AI-scored by Gemini, ranked by fit, ready to deliver",
        descriptionPt: "Pontuado pela Gemini, ranqueado por aderência e pronto para entrega",
    },
] as const;

function DatabaseIcon() {
    return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <ellipse cx="24" cy="12" rx="15" ry="6" />
            <path d="M9 12v20c0 3.3 6.7 6 15 6s15-2.7 15-6V12" />
            <path d="M9 22c0 3.3 6.7 6 15 6s15-2.7 15-6" />
        </svg>
    );
}

function FilterIcon() {
    return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M10 12h28L27 25v9l-6 3V25L10 12Z" />
            <path d="M17 19h14" />
        </svg>
    );
}

function SparkIcon() {
    return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M26 5 13 27h10l-2 16 14-24H25l1-14Z" />
        </svg>
    );
}

const icons = {
    bronze: <DatabaseIcon />,
    silver: <FilterIcon />,
    gold: <SparkIcon />,
};

function clamp(value: number) {
    return Math.min(1, Math.max(0, value));
}

function segment(progress: number, start: number, end: number) {
    return clamp((progress - start) / (end - start));
}

export function JobHunterSection({ language }: { language: Language }) {
    const sceneRef = useRef<HTMLElement | null>(null);
    const cardRef = useRef<HTMLElement | null>(null);
    const flowPanelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const scene = sceneRef.current;
        const card = cardRef.current;
        const flowPanel = flowPanelRef.current;

        if (!scene || !card || !flowPanel) {
            return;
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const mobile = window.matchMedia("(max-width: 768px)");

        if (reduceMotion.matches || mobile.matches) {
            scene.classList.remove("isFlowReady");
            card.classList.remove("isFlowReady");
            return;
        }

        let frameId = 0;
        let ticking = false;

        function setNumber(name: string, value: number) {
            card!.style.setProperty(name, value.toFixed(3));
        }

        function update() {
            ticking = false;

            const rect = scene!.getBoundingClientRect();
            const start = window.innerHeight * 0.76;
            const end = -scene!.offsetHeight + window.innerHeight * 0.42;
            const progress = clamp((start - rect.top) / (start - end));
            const flow = segment(progress, 0.06, 0.5);
            const flowHeight = Math.ceil((flowPanel!.scrollHeight + 36) * flow);

            card!.style.setProperty("--jh-flow-height", `${flowHeight}px`);
            card!.style.setProperty("--jh-flow-margin", `${flow * 1.05}rem`);
            card!.style.setProperty("--jh-flow-y", `${(1 - flow) * -18}px`);
            card!.style.setProperty("--jh-flow-clip", `${(1 - flow) * 100}%`);
            setNumber("--jh-flow-opacity", flow);

            const bronze = segment(progress, 0.24, 0.42);
            const silver = segment(progress, 0.34, 0.56);
            const gold = segment(progress, 0.46, 0.68);
            const arrowOne = segment(progress, 0.54, 0.74);
            const arrowTwo = segment(progress, 0.66, 0.86);
            const delivery = segment(progress, 0.74, 0.98);

            setNumber("--jh-card-one-opacity", bronze);
            card!.style.setProperty("--jh-card-one-y", `${(1 - bronze) * 26}px`);
            setNumber("--jh-card-one-scale", 0.97 + bronze * 0.03);

            setNumber("--jh-card-two-opacity", silver);
            card!.style.setProperty("--jh-card-two-y", `${(1 - silver) * 26}px`);
            setNumber("--jh-card-two-scale", 0.97 + silver * 0.03);

            setNumber("--jh-card-three-opacity", gold);
            card!.style.setProperty("--jh-card-three-y", `${(1 - gold) * 26}px`);
            setNumber("--jh-card-three-scale", 0.97 + gold * 0.03);

            setNumber("--jh-arrow-one-opacity", arrowOne);
            setNumber("--jh-arrow-one-scale", arrowOne);
            setNumber("--jh-arrow-two-opacity", arrowTwo);
            setNumber("--jh-arrow-two-scale", arrowTwo);

            setNumber("--jh-delivery-opacity", delivery);
            card!.style.setProperty("--jh-delivery-y", `${(1 - delivery) * 18}px`);
        }

        function scheduleUpdate() {
            if (ticking) {
                return;
            }

            ticking = true;
            frameId = window.requestAnimationFrame(update);
        }

        scene.classList.add("isFlowReady");
        card.classList.add("isFlowReady");
        update();

        const resizeObserver = "ResizeObserver" in window
            ? new ResizeObserver(scheduleUpdate)
            : null;

        resizeObserver?.observe(scene);
        resizeObserver?.observe(flowPanel);
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);

        return () => {
            window.cancelAnimationFrame(frameId);
            resizeObserver?.disconnect();
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
            scene.classList.remove("isFlowReady");
            card.classList.remove("isFlowReady");
        };
    }, [language]);

    function handleProjectMove(event: MouseEvent<HTMLElement>) {
        if (window.matchMedia("(max-width: 860px), (prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const card = event.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.setProperty("--tilt-y", `${x * 4.5}deg`);
        card.style.setProperty("--tilt-x", `${y * -3.5}deg`);
    }

    function resetProjectTilt(event: MouseEvent<HTMLElement>) {
        event.currentTarget.style.setProperty("--tilt-y", "0deg");
        event.currentTarget.style.setProperty("--tilt-x", "0deg");
    }

    return (
        <section ref={sceneRef} className="jobHunterScrollScene">
            <article
                ref={cardRef}
                className="project projectFlagship jobHunterProject"
                aria-label={language === "en" ? "Job Hunter case study" : "Estudo de caso Job Hunter"}
                onMouseMove={handleProjectMove}
                onMouseLeave={resetProjectTilt}
            >
                <div className="projectPreview jobHunterPreview" aria-hidden="true">
                    <div className="jobHunterPreviewGrid">
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className="jobHunterPreviewTerminal">
                        <div className="projectPreviewBar">
                            <span />
                            <span />
                            <span />
                        </div>
                        <div className="jobHunterPreviewRows">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                    <div className="jobHunterPreviewBadge">
                        {language === "en" ? "3 matches sent" : "3 matches enviados"}
                    </div>
                </div>

                <div className="projectContent jobHunterContent">
                    <p className="projectEyebrow">
                        {language === "en" ? "Featured Project 01" : "Projeto em Destaque 01"}
                    </p>
                    <h3 className="projectTitle">Job Hunter</h3>
                    <p className="projectProof">
                        {language === "en"
                            ? "An autonomous system that finds, filters, and delivers the right job listings."
                            : "Um sistema autônomo que encontra, filtra e entrega as vagas certas."}
                    </p>
                    <p className="projectDescription">
                        {language === "en"
                            ? "A fully automated pipeline that scrapes listings, refines them through three data layers, then uses an AI model to score each one against a candidate's profile. Only the best matches get delivered."
                            : "Um pipeline totalmente automatizado que coleta vagas, refina tudo em três camadas de dados e usa IA para pontuar cada vaga contra o perfil do candidato. Só as melhores combinações são entregues."}
                    </p>
                    <div className="projectMeta">
                        <p>
                            {language === "en"
                                ? "Python · Playwright · MongoDB Atlas · Gemini API · Medallion Architecture"
                                : "Python · Playwright · MongoDB Atlas · Gemini API · Arquitetura Medallion"}
                        </p>
                        <span>
                            {language === "en" ? "Pipeline complete · Telegram delivery in progress" : "Pipeline completo · Entrega via Telegram em andamento"}
                        </span>
                    </div>
                    <div className="projectActions">
                        <a href="https://github.com/gustavo-henriq/JobHunter" target="_blank" rel="noopener noreferrer">
                            GitHub →
                        </a>
                    </div>
                </div>

                <div ref={flowPanelRef} className="jobHunterFlowPanel">
                    <div className="jobHunterFlowIntro">
                        <span>{language === "en" ? "Data flow" : "Fluxo de dados"}</span>
                        <p>
                            {language === "en"
                                ? "Listings move from raw capture to cleaned data, AI scoring, and Telegram delivery."
                                : "As vagas passam da coleta bruta para limpeza, pontuação com IA e entrega via Telegram."}
                        </p>
                    </div>

                    <div className="jobHunterFlowTrack" aria-hidden="true">
                        {flowCards.map((card, index) => (
                            <Fragment key={card.key}>
                                <div className={`jobLayerCard ${card.key}`}>
                                    <span className="jobLayerIcon">{icons[card.key]}</span>
                                    <h4>{language === "en" ? card.title : card.titlePt}</h4>
                                    <p>{language === "en" ? card.description : card.descriptionPt}</p>
                                </div>

                                {index < flowCards.length - 1 ? (
                                    <div className={`jobFlowArrow ${index === 0 ? "first" : "second"}`}>
                                        <span />
                                    </div>
                                ) : null}
                            </Fragment>
                        ))}
                    </div>

                    <div className="jobHunterDelivery">
                        <span>{language === "en" ? "Telegram delivery" : "Entrega via Telegram"}</span>
                        <strong>{language === "en" ? "Only ranked matches reach the user." : "Apenas matches ranqueados chegam ao usuário."}</strong>
                    </div>
                </div>
            </article>
        </section>
    );
}
