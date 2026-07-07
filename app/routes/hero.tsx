import "../styles/hero.css"
import { Reveal } from "../components/Reveal"
import type { Language } from "../types"

export function Hero({ language }: { language: Language }) {
    function scrollToContact() {
        document.getElementById("contact")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    return (
        <Reveal id="home" className="heroContainer">
            <div className="heroText">
                <h1 className="heroHeadline">
                    {language === "en" ? "Hello, I'm " : "Olá, eu sou "}
                    <span className="bold">Gustavo</span>
                    {language === "en" ? ", a developer in Brazil" : ", desenvolvedor no Brasil"}
                </h1>
                <p className="heroDescription">
                    {language === "en"
                        ? "I build full-stack applications powered by AI — turning complex problems into clean, working software. Based in Brazil, available for remote work worldwide."
                        : "Crio aplicações full-stack com IA — transformando problemas complexos em software limpo e funcional. Do Brasil, disponível para trabalho remoto no mundo todo."}
                </p>
                <p className="heroCredibility">
                    {language === "en" ? "Open to remote roles · AI & React" : "Aberto a remoto · IA & React"}
                </p>
                <button className="heroCTA" onClick={scrollToContact}>
                    <span>{language === "en" ? "Contact Me" : "Entre em Contato"}</span>
                </button>
            </div>
            <div className="heroVisual">
                <div className="heroBackdrop" aria-hidden="true">
                    <span className="heroColorField" />
                    <span className="heroGrid" />
                    <span className="heroHorizon" />
                </div>
                <img
                    className="heroAvatar"
                    src="/images/gustavo-avatar.webp"
                    alt={language === "en" ? "3D avatar of Gustavo" : "Avatar 3D de Gustavo"}
                    width="353"
                    height="443"
                />
                <span className="heroAvatarShadow" aria-hidden="true" />
            </div>
        </Reveal>
    )
}
