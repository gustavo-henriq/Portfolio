import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LuLightbulb } from "react-icons/lu";
import type { Language } from "../types";
import "../styles/header.css"

const navSections = [
    { sectionId: "projects", labels: { en: "Projects", pt: "Projetos" } },
    { sectionId: "skills", labels: { en: "Skills", pt: "Habilidades" } },
    { sectionId: "about", labels: { en: "Who am I", pt: "Quem sou eu" } },
    { sectionId: "contact", labels: { en: "Contact", pt: "Contato" } },
] as const;

type HeaderProps = {
    language: Language;
    onLanguageChange: (language: Language) => void;
};

export function Header({ language, onLanguageChange }: HeaderProps) {
    const [activeSection, setActiveSection] = useState("");
    const [isDark, setIsDark] = useState(false);
    const [isDocked, setIsDocked] = useState(false);
    const [themeTransition, setThemeTransition] = useState<"toDark" | "toLight" | null>(null);
    const headerRef = useRef<HTMLElement | null>(null);
    const themeToggleRef = useRef<HTMLButtonElement | null>(null);
    const transitionTimersRef = useRef<number[]>([]);
    const navRef = useRef<HTMLUListElement | null>(null);
    const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
    const navItems = navSections.map((item) => ({
        sectionId: item.sectionId,
        label: item.labels[language],
    }));

    useEffect(() => {
        const storedTheme = window.localStorage.getItem("portfolio-theme");
        const initialDark = storedTheme
            ? storedTheme === "dark"
            : window.matchMedia("(prefers-color-scheme: dark)").matches;

        setIsDark(initialDark);
        document.documentElement.classList.toggle("dark-theme", initialDark);

        return () => {
            transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
        };
    }, []);

    function toggleTheme() {
        if (themeTransition) {
            return;
        }

        const nextTheme = !isDark;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reducedMotion) {
            setIsDark(nextTheme);
            document.documentElement.classList.toggle("dark-theme", nextTheme);
            window.localStorage.setItem("portfolio-theme", nextTheme ? "dark" : "light");
            return;
        }

        const transition = nextTheme ? "toDark" : "toLight";
        const buttonRect = themeToggleRef.current?.getBoundingClientRect();
        const originX = buttonRect ? buttonRect.left + buttonRect.width / 2 : window.innerWidth / 2;
        const originY = buttonRect ? buttonRect.top + buttonRect.height / 2 : 0;
        const coverRadius = Math.max(
            Math.hypot(originX, originY),
            Math.hypot(window.innerWidth - originX, originY),
            Math.hypot(originX, window.innerHeight - originY),
            Math.hypot(window.innerWidth - originX, window.innerHeight - originY),
        );

        document.documentElement.style.setProperty("--theme-origin-x", `${originX}px`);
        document.documentElement.style.setProperty("--theme-origin-y", `${originY}px`);
        document.documentElement.style.setProperty("--theme-cover-scale", `${(coverRadius / 24) * 1.04}`);
        setThemeTransition(transition);

        const switchTimer = window.setTimeout(() => {
            setIsDark(nextTheme);
            document.documentElement.classList.toggle("dark-theme", nextTheme);
            window.localStorage.setItem("portfolio-theme", nextTheme ? "dark" : "light");
        }, 490);

        const unlockTimer = window.setTimeout(() => {
            setThemeTransition(null);
            transitionTimersRef.current = [];
        }, 850);

        transitionTimersRef.current = [switchTimer, unlockTimer];
    }

    useEffect(() => {
        const header = headerRef.current;

        if (!header) {
            return;
        }

        const activeHeader = header;
        let frameId = 0;
        let wasDocked = false;

        function updateHeaderPosition() {
            const isMobile = window.matchMedia("(max-width: 780px)").matches;

            if (isMobile) {
                activeHeader.style.setProperty("--header-y", "0px");
                activeHeader.style.setProperty("--header-inset", "0px");
                activeHeader.style.setProperty("--header-radius", "0px");
                activeHeader.style.setProperty("--header-bg-alpha", "0.9");
                activeHeader.style.setProperty("--header-blur", "18px");
                activeHeader.style.setProperty("--header-border-alpha", "0.12");
                activeHeader.style.setProperty("--header-shadow-alpha", "0.08");
                activeHeader.style.setProperty("--header-opacity", "1");
                activeHeader.style.pointerEvents = "auto";

                if (!wasDocked) {
                    wasDocked = true;
                    setIsDocked(true);
                }

                return;
            }

            const headerHeight = activeHeader.getBoundingClientRect().height;
            const bottomInset = window.innerHeight <= 820 ? 48 : 32;
            const travel = Math.max(0, window.innerHeight - headerHeight - bottomInset);
            const dockingDistance = Math.min(window.innerHeight * 0.24, 220);
            const progress = Math.min(1, Math.max(0, window.scrollY / dockingDistance));
            const easedProgress = progress * progress * (3 - 2 * progress);
            const docked = progress >= 0.82;
            const visibleHoldDistance = 18;
            const fadeOutEnd = 58;
            const fadeInDistance = 30;
            const opacity = window.scrollY <= visibleHoldDistance
                ? 1
                : window.scrollY <= fadeOutEnd
                    ? 1 - (window.scrollY - visibleHoldDistance) / (fadeOutEnd - visibleHoldDistance)
                : window.scrollY >= dockingDistance - fadeInDistance
                    ? (window.scrollY - (dockingDistance - fadeInDistance)) / fadeInDistance
                    : 0;

            activeHeader.style.setProperty("--header-y", docked ? "0px" : `${travel}px`);
            activeHeader.style.setProperty("--header-inset", `${docked ? 0 : 20}px`);
            activeHeader.style.setProperty("--header-radius", `${docked ? 0 : 8}px`);
            activeHeader.style.setProperty("--header-bg-alpha", `${0.68 + easedProgress * 0.22}`);
            activeHeader.style.setProperty("--header-blur", `${10 + easedProgress * 8}px`);
            activeHeader.style.setProperty("--header-border-alpha", `${0.08 + easedProgress * 0.04}`);
            activeHeader.style.setProperty("--header-shadow-alpha", `${0.05 + easedProgress * 0.03}`);
            activeHeader.style.setProperty("--header-opacity", `${opacity}`);
            activeHeader.style.pointerEvents = opacity > 0.35 ? "auto" : "none";

            if (docked !== wasDocked) {
                wasDocked = docked;
                setIsDocked(docked);
            }
        }

        function scheduleUpdate() {
            window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(updateHeaderPosition);
        }

        updateHeaderPosition();
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
        };
    }, []);

    useEffect(() => {
        function updateActiveSection() {
            const marker = window.innerHeight * 0.34;
            const hero = document.getElementById("home");

            if (!hero || hero.getBoundingClientRect().bottom > marker) {
                setActiveSection("");
                return;
            }

            const jobHunterSection = document.querySelector(".jobHunterSection");

            if (jobHunterSection) {
                const jobHunterRect = jobHunterSection.getBoundingClientRect();

                if (jobHunterRect.top <= marker && jobHunterRect.bottom >= marker) {
                    setActiveSection("projects");
                    return;
                }
            }

            const currentSection = navItems.reduce<string>((activeId, item) => {
                const section = document.getElementById(item.sectionId);

                if (section && section.getBoundingClientRect().top <= marker) {
                    return item.sectionId;
                }

                return activeId;
            }, "");

            setActiveSection(currentSection);
        }

        updateActiveSection();
        window.addEventListener("scroll", updateActiveSection, { passive: true });
        window.addEventListener("resize", updateActiveSection);

        return () => {
            window.removeEventListener("scroll", updateActiveSection);
            window.removeEventListener("resize", updateActiveSection);
        };
    }, []);

    useEffect(() => {
        function updateUnderline() {
            const activeButton = navRef.current?.querySelector<HTMLButtonElement>(".activeNavItem");

            if (!activeButton || !navRef.current) {
                setUnderlineStyle({ width: 0, left: 0 });
                return;
            }

            const navRect = navRef.current.getBoundingClientRect();
            const buttonRect = activeButton.getBoundingClientRect();

            setUnderlineStyle({
                width: buttonRect.width,
                left: buttonRect.left - navRect.left,
            });
        }

        updateUnderline();
        window.addEventListener("resize", updateUnderline);

        return () => window.removeEventListener("resize", updateUnderline);
    }, [activeSection, language]);

    function scrollToSection(sectionId: string) {
        document.getElementById(sectionId)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    return (
        <>
        <header ref={headerRef} className={`headerContainer ${isDocked ? "isDocked" : "isBottom"}`}>
            <button className="logo" onClick={() => scrollToSection("home")} aria-label="Scroll to home">
                <img
                    className="logoImg"
                    src="/images/gustavo-header-icon.png"
                    alt=""
                    aria-hidden="true"
                    width="48"
                    height="48"
                />
                <span className="logoText">Gustavo</span>
            </button>
            <nav className="headerRoutes" aria-label="Primary navigation">
                <ul ref={navRef} className={`headerList ${activeSection ? "hasActiveSection" : ""}`}>
                    {navItems.map((item) => (
                        <li key={item.sectionId}>
                            <button
                                className={activeSection === item.sectionId ? "activeNavItem" : ""}
                                onClick={() => scrollToSection(item.sectionId)}
                                aria-current={activeSection === item.sectionId ? "location" : undefined}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                    <span
                        className="activeNavUnderline"
                        style={{
                            width: `${underlineStyle.width}px`,
                            transform: `translateX(${underlineStyle.left}px)`,
                        }}
                    />
                </ul>
            </nav>
            <div className="headerUtilities">
                <button
                    ref={themeToggleRef}
                    className={`themeToggle ${isDark ? "isDark" : "isLight"}`}
                    onClick={toggleTheme}
                    disabled={Boolean(themeTransition)}
                    aria-label={isDark ? "Turn on the light" : "Turn off the light"}
                    title={isDark ? "Light mode" : "Dark mode"}
                >
                    <LuLightbulb />
                </button>

                <div className="languageToggle" aria-label="Language">
                    {(["en", "pt"] as const).map((option) => (
                        <button
                            key={option}
                            className={language === option ? "activeLanguage" : ""}
                            onClick={() => onLanguageChange(option)}
                            aria-pressed={language === option}
                        >
                            {option.toUpperCase()}
                        </button>
                    ))}
                </div>

                <a
                    className="cvDownload"
                    href="/files/00%20Curriculo%20-%20Gustavo%20Henrique.pdf"
                    download
                >
                    <span className="cvDownloadFull">
                        {language === "en" ? "Download CV" : "Baixar CV"}
                    </span>
                    <span className="cvDownloadShort">CV</span>
                </a>
            </div>
        </header>
        {themeTransition && typeof document !== "undefined"
            ? createPortal(
                <div className={`themeTransitionLayer ${themeTransition}`} aria-hidden="true" />,
                document.body,
            )
            : null}
        </>
    )
}
