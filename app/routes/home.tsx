import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { Header } from "./header"
import { Hero } from "../routes/hero"
import { Skills } from "./skills";
import { Projects } from "./projects";
import { AboutMe } from "./aboutme";
import { Contact } from "./contact";
import type { Language } from "../types";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Gustavo H. | Portfolio" },
    { name: "description", content: "Full stack developer portfolio focused on AI and React applications" },
  ];
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("portfolio-language");

    if (storedLanguage === "en" || storedLanguage === "pt") {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "pt-BR";
  }, [language]);

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    window.localStorage.setItem("portfolio-language", nextLanguage);
  }

  return (
    <>
      <Header language={language} onLanguageChange={changeLanguage} />
      <Hero language={language} />
      <Projects language={language} />
      <Skills language={language} />
      <AboutMe language={language} />
      <Contact language={language} />
    </>
  )
}
