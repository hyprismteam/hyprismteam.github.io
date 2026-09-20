import { useEffect, useState } from "react";
import { Prism } from "./components/Prism";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { getLocale, localeMeta, siteUrl, translations } from "./content";
import "./styles.css";

const github = "https://github.com/hyprismteam";
const members = [
  { name: "Aarav2709", display: "Aarav Gupta" },
  { name: "eoYuzi", display: "eoYuzi" },
  { name: "freakdaniel", display: "Daniel Freak" },
  { name: "XargonWan", display: "XargonWan" },
  { name: "yyyumeniku", display: "Gabriel Hernandez" },
];
const screens = ["instances", "news", "profiles", "settings"] as const;

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      className={`arrow${down ? " arrow-down" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function App() {
  const locale = getLocale();
  const copy = translations[locale];
  const localeInfo = localeMeta[locale];
  const [screen, setScreen] = useState(0);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [section, setSection] = useState("home");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "off" : "on";
    document.documentElement.lang = localeInfo.lang;
    document.title = copy.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", copy.description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", copy.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", copy.description);
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute("content", localeInfo.ogLocale);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", `${siteUrl}${localeInfo.path}`);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", `${siteUrl}${localeInfo.path}`);
  }, [
    copy.description,
    copy.title,
    localeInfo.lang,
    localeInfo.ogLocale,
    localeInfo.path,
    reduced,
  ]);

  useEffect(() => {
    const reveals = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            reveals.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => reveals.observe(element));
    const sections = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setSection(entry.target.id);
        }),
      { rootMargin: "-15% 0px -65% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((element) => sections.observe(element));
    return () => {
      reveals.disconnect();
      sections.disconnect();
    };
  }, []);

  return (
    <div className="site">
      <a className="skip-link" href="#main">
        {copy.skip}
      </a>
      <header className="header">
        <a href="#home" className="brand" aria-label={copy.brandLabel}>
          <img src="/assets/team-logo.svg" alt="" width="32" height="32" />
          <span>
            hyprism<span className="brand-team"> team</span>
          </span>
        </a>
        <nav aria-label={copy.nav.team}>
          <a
            href="#team"
            aria-current={section === "team" ? "location" : undefined}
          >
            {copy.nav.team}
          </a>
          <a
            href="#projects"
            aria-current={section === "projects" ? "location" : undefined}
          >
            {copy.nav.projects}
          </a>
          <a
            href="#about"
            aria-current={section === "about" ? "location" : undefined}
          >
            {copy.nav.tools}
          </a>
        </nav>
        <div className="header-actions">
          <LanguageSwitcher locale={locale} label={copy.language} />
          <a
            className="github-link"
            href={github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow />
          </a>
        </div>
      </header>

      <main id="main">
        <section id="home" className="hero">
          <div className="hero-wordmark" aria-hidden="true">
            hyprism<span>+</span>
          </div>
          <div className="hero-bottom">
            <div className="hero-copy">
              <h1>
                <span className="line">
                  <span>{copy.heroTitle[0]}</span>
                </span>
                <span className="line">
                  <span>{copy.heroTitle[1]}</span>
                </span>
              </h1>
              <p>
                {copy.heroBody[0]}
                <br />
                {copy.heroBody[1]}
              </p>
              <a className="round-link" href="#team">
                <span className="round-icon">
                  <Arrow down />
                </span>
                <span>{copy.heroCta}</span>
              </a>
            </div>
            <div className="sculpture">
              <Prism paused={reduced} />
            </div>
          </div>
        </section>

        <section id="team" className="team section-pad">
          <div className="team-heading" data-reveal>
            <h2>{copy.teamTitle}</h2>
            <p>{copy.teamSummary}</p>
          </div>
          <div className="team-list">
            {members.map((member) => (
              <a
                className="member"
                href={`https://github.com/${member.name}`}
                target="_blank"
                rel="noreferrer"
                key={member.name}
              >
                <div className="member-portrait">
                  <img
                    src={`/assets/team/${member.name}.png`}
                    alt={`${member.display} — GitHub`}
                    loading="lazy"
                    width="160"
                    height="160"
                  />
                  <span className="member-arrow">
                    <Arrow />
                  </span>
                </div>
                <h3>{member.display}</h3>
                <span className="member-handle">@{member.name}</span>
              </a>
            ))}
          </div>
        </section>

        <section id="projects" className="work section-pad">
          <div className="project-heading" data-reveal>
            <div>
              <h2>{copy.projectTitle}</h2>
            </div>
            <div className="project-summary">
              <h3>{copy.projectName}</h3>
              <p>{copy.projectDescription}</p>
              <a
                className="underline-link"
                href={`${github}/Hyprism`}
                target="_blank"
                rel="noreferrer"
              >
                {copy.projectLink} <Arrow />
              </a>
            </div>
          </div>
          <div className="project-showcase" data-reveal>
            <div
              className="screen-stack"
              id="project-screen"
              role="tabpanel"
              aria-labelledby={`screen-tab-${screen}`}
              tabIndex={0}
            >
              {screens.map((image, index) => (
                <img
                  key={image}
                  className={screen === index ? "screen active" : "screen"}
                  src={`/assets/hyprism-${image}.png`}
                  alt={`${copy.screenAlt} — ${copy.screenLabels[index]}`}
                  aria-hidden={screen !== index}
                  loading="lazy"
                  width="2560"
                  height="1600"
                />
              ))}
            </div>
            <div className="preview-bottom">
              <div
                className="screen-tabs"
                role="tablist"
                aria-label={copy.projectName}
              >
                {screens.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    role="tab"
                    id={`screen-tab-${index}`}
                    aria-selected={screen === index}
                    aria-controls="project-screen"
                    tabIndex={screen === index ? 0 : -1}
                    onClick={() => setScreen(index)}
                    onKeyDown={(event) => {
                      const next =
                        event.key === "ArrowRight"
                          ? (index + 1) % screens.length
                          : event.key === "ArrowLeft"
                            ? (index + screens.length - 1) % screens.length
                            : event.key === "Home"
                              ? 0
                              : event.key === "End"
                                ? screens.length - 1
                                : null;
                      if (next !== null) {
                        event.preventDefault();
                        setScreen(next);
                        document.getElementById(`screen-tab-${next}`)?.focus();
                      }
                    }}
                  >
                    <span className="tab-dot" />
                    {copy.screenLabels[index]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about section-pad">
          <div className="tools-heading" data-reveal>
            <h2>{copy.toolsTitle}</h2>
            <p>{copy.toolsDescription}</p>
          </div>
          <div className="stack-line" data-reveal>
            <div>
              {[
                ["csharp", "C#"],
                ["cplusplus", "C++"],
                ["rust", "Rust"],
                ["react", "React"],
                ["typescript", "TypeScript"],
              ].map(([icon, name]) => (
                <span key={icon}>
                  <img
                    src={`/assets/stack/${icon}.svg`}
                    alt=""
                    width="26"
                    height="26"
                  />
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <footer className="footer section-pad">
          <a
            className="footer-cta"
            href={github}
            target="_blank"
            rel="noreferrer"
            data-reveal
          >
            <span>
              {copy.footerCta}
              <span className="accent">.</span>
            </span>
            <Arrow />
          </a>
          <div className="footer-bottom">
            <a className="brand" href="#home">
              <img src="/assets/team-logo.svg" alt="" width="25" height="25" />
              <span>hyprism team</span>
            </a>
            <a href="#home" className="back-top" aria-label={copy.backTop}>
              ↑
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
