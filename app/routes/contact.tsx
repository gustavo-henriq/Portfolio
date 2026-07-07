import { MdEmail } from "react-icons/md";
import { FaGithub, FaWhatsapp } from "react-icons/fa";
import "../styles/contact.css";
import { Reveal } from "../components/Reveal";
import type { Language } from "../types";
import type { FormEvent } from "react";

const contactEmail = "gustavo.hs369@gmail.com";
const githubUrl = "https://github.com/gustavo-henriq";
const whatsappUrl = "https://wa.me/5581995154915";

export function Contact({ language }: { language: Language }) {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const product = String(formData.get("product") ?? "").trim();
        const message = String(formData.get("message") ?? "").trim();
        const defaultSubject = language === "en" ? "Portfolio contact" : "Contato pelo portfólio";
        const subject = product ? `${defaultSubject}: ${product}` : defaultSubject;
        const body = [
            name ? `${language === "en" ? "Name" : "Nome"}: ${name}` : "",
            email ? `Email: ${email}` : "",
            product ? `${language === "en" ? "Product" : "Projeto"}: ${product}` : "",
            "",
            message ? `${language === "en" ? "Message" : "Mensagem"}: ${message}` : "",
        ].filter(Boolean).join("\n");

        window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    return (
        <Reveal id="contact" className="contactContainer">
            <form className="contactForm" onSubmit={handleSubmit}>
                <label className="srOnly" htmlFor="contact-name">{language === "en" ? "Your Name" : "Seu Nome"}</label>
                <input id="contact-name" name="name" autoComplete="name" type="text" placeholder={language === "en" ? "Your Name" : "Seu Nome"} required />

                <label className="srOnly" htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" autoComplete="email" type="email" placeholder="Email" required />

                <label className="srOnly" htmlFor="contact-product">{language === "en" ? "Your Product" : "Seu Produto"}</label>
                <input id="contact-product" name="product" type="text" placeholder={language === "en" ? "Your Product (if it exists)" : "Seu Produto (se existir)"} />

                <label className="srOnly" htmlFor="contact-message">{language === "en" ? "How can I help?" : "Como posso ajudar?"}</label>
                <textarea id="contact-message" name="message" placeholder={language === "en" ? "How can I help?" : "Como posso ajudar?"} required></textarea>

                <div className="contactButtons">
                    <button type="submit"><span>{language === "en" ? "Send" : "Enviar"}</span></button>
                    <a href={`mailto:${contactEmail}`} className="contactIcon" aria-label={language === "en" ? "Send an email" : "Enviar email"}>
                        <MdEmail />
                    </a>
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="contactIcon" aria-label="GitHub">
                        <FaGithub />
                    </a>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contactIcon" aria-label="WhatsApp">
                        <FaWhatsapp />
                    </a>
                </div>
            </form>

            <div className="contactDescription">
                <p className="contactHeadliner">{language === "en" ? "Let's get in touch!" : "Vamos conversar!"}</p>
                <p>
                    <a className="contactTextLink bold" href={`mailto:${contactEmail}`}>
                        {contactEmail}
                    </a>
                </p>
                <p>
                    <a className="contactTextLink bold" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        WhatsApp →
                    </a>
                </p>
            </div>
            <footer className="siteFooter">
                <span>Gustavo H.</span>
                <span>{language === "en" ? "Developer focused on AI and React." : "Desenvolvedor focado em IA e React."}</span>
                <span>2026</span>
            </footer>
        </Reveal>
    )
}
