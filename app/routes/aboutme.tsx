import "../styles/aboutme.css"
import { Reveal } from "../components/Reveal"
import type { Language } from "../types"

export function AboutMe({ language }: { language: Language }) {
    return (
        <Reveal id="about" className="aboutmeContainer">
            <div className="aboutmeImage">
                <img
                    src="/images/gustavo-about-device.png"
                    alt={language === "en" ? "3D avatar of Gustavo holding a small device" : "Avatar 3D de Gustavo segurando um pequeno dispositivo"}
                    width="1024"
                    height="1536"
                />
            </div>
            <div className="aboutmeContent">
                <h2 className="aboutmeHeadliner">
                    {language === "en" ? "Who " : "Quem "}<span className="bold">{language === "en" ? "am I" : "sou eu"}</span>
                </h2>
                <div className="aboutmeText">
                    <p>
                        {language === "en"
                            ? "I'm a fullstack developer from Brazil focused on building thoughtful web experiences with React, AI, and practical backend systems."
                            : "Sou desenvolvedor fullstack do Brasil, focado em criar experiências web cuidadosas com React, IA e sistemas backend práticos."}
                    </p>
                </div>
            </div>
        </Reveal>
    )
}
