export type Locale = "ru" | "en" | "zh" | "es" | "fr" | "pt-br";

export type SiteCopy = {
  title: string;
  description: string;
  language: string;
  skip: string;
  nav: { team: string; projects: string; tools: string };
  brandLabel: string;
  heroTitle: [string, string];
  heroBody: [string, string];
  heroCta: string;
  teamTitle: string;
  teamSummary: string;
  projectTitle: string;
  projectName: string;
  projectDescription: string;
  projectLink: string;
  screenLabels: [string, string, string, string];
  screenAlt: string;
  toolsTitle: string;
  toolsDescription: string;
  footerCta: string;
  backTop: string;
};

export const siteUrl = "https://hyprismteam.github.io";

export const localeOrder: Locale[] = ["ru", "en", "zh", "es", "fr", "pt-br"];

export const localeMeta: Record<
  Locale,
  {
    path: string;
    lang: string;
    hreflang: string;
    short: string;
    label: string;
    icon: string;
    ogLocale: string;
  }
> = {
  ru: {
    path: "/",
    lang: "ru",
    hreflang: "ru",
    short: "RU",
    label: "Русский",
    icon: "/assets/flags/ru.svg",
    ogLocale: "ru_RU",
  },
  en: {
    path: "/en/",
    lang: "en",
    hreflang: "en",
    short: "EN",
    label: "English",
    icon: "/assets/flags/en.svg",
    ogLocale: "en_US",
  },
  zh: {
    path: "/zh/",
    lang: "zh-CN",
    hreflang: "zh-CN",
    short: "中文",
    label: "简体中文",
    icon: "/assets/flags/zh.svg",
    ogLocale: "zh_CN",
  },
  es: {
    path: "/es/",
    lang: "es",
    hreflang: "es",
    short: "ES",
    label: "Español",
    icon: "/assets/flags/es.svg",
    ogLocale: "es_ES",
  },
  fr: {
    path: "/fr/",
    lang: "fr",
    hreflang: "fr",
    short: "FR",
    label: "Français",
    icon: "/assets/flags/fr.svg",
    ogLocale: "fr_FR",
  },
  "pt-br": {
    path: "/pt-br/",
    lang: "pt-BR",
    hreflang: "pt-BR",
    short: "PT",
    label: "Português (Brasil)",
    icon: "/assets/flags/pt-br.svg",
    ogLocale: "pt_BR",
  },
};

export const translations: Record<Locale, SiteCopy> = {
  ru: {
    title: "Hyprism Team — открытые проекты и команда разработчиков",
    description:
      "Hyprism Team — небольшая команда разработчиков. Открытый лаунчер Hyprism для Hytale и инструменты на C#, C++, Rust, React и TypeScript.",
    language: "Выбрать язык",
    skip: "К содержимому",
    nav: { team: "Команда", projects: "Проекты", tools: "Инструменты" },
    brandLabel: "Hyprism Team — главная",
    heroTitle: ["Небольшая команда", "с общими интересами"],
    heroBody: [
      "Пишем код, пробуем новое",
      "и работаем над открытыми проектами",
    ],
    heroCta: "Познакомиться с нами",
    teamTitle: "Команда",
    teamSummary: "Пять человек за Hyprism Team",
    projectTitle: "Наш проект",
    projectName: "Hyprism",
    projectDescription:
      "Неофициальный лаунчер для Hytale с открытым исходным кодом, предоставляющий управление экземплярами игры, модами и профилями.",
    projectLink: "Репозиторий Hyprism",
    screenLabels: ["Экземпляры", "Новости", "Профили", "Настройки"],
    screenAlt: "Экран Hyprism",
    toolsTitle: "Инструменты",
    toolsDescription: "То, с чем работаем и что мы любим",
    footerCta: "Мы на GitHub",
    backTop: "Наверх",
  },
  en: {
    title: "Hyprism Team — open source projects and developers",
    description:
      "Hyprism Team is a small developer team building open source projects, including Hyprism, an unofficial Hytale launcher.",
    language: "Choose language",
    skip: "Skip to content",
    nav: { team: "Team", projects: "Projects", tools: "Tools" },
    brandLabel: "Hyprism Team — home",
    heroTitle: ["A small team", "with shared interests"],
    heroBody: [
      "We write code, try new things",
      "and build open source projects",
    ],
    heroCta: "Meet the team",
    teamTitle: "Team",
    teamSummary: "Five people behind Hyprism Team",
    projectTitle: "Our project",
    projectName: "Hyprism",
    projectDescription:
      "An unofficial open source Hytale launcher for managing game instances, mods, and profiles.",
    projectLink: "Hyprism repository",
    screenLabels: ["Instances", "News", "Profiles", "Settings"],
    screenAlt: "Hyprism screen",
    toolsTitle: "Tools",
    toolsDescription: "What we work with and enjoy",
    footerCta: "Find us on GitHub",
    backTop: "Back to top",
  },
  zh: {
    title: "Hyprism Team — 开源项目与开发者团队",
    description:
      "Hyprism Team 是一个小型开发者团队，致力于开源项目，包括非官方的 Hytale 启动器 Hyprism。",
    language: "选择语言",
    skip: "跳转到内容",
    nav: { team: "团队", projects: "项目", tools: "工具" },
    brandLabel: "Hyprism Team — 首页",
    heroTitle: ["一支小团队", "因为共同的兴趣"],
    heroBody: ["编写代码，尝试新事物", "一起打造开源项目"],
    heroCta: "认识团队",
    teamTitle: "团队",
    teamSummary: "Hyprism Team 背后的五个人",
    projectTitle: "我们的项目",
    projectName: "Hyprism",
    projectDescription:
      "一个非官方的 Hytale 开源启动器，用于管理游戏实例、模组和配置文件。",
    projectLink: "Hyprism 代码仓库",
    screenLabels: ["游戏实例", "新闻", "配置文件", "设置"],
    screenAlt: "Hyprism 界面",
    toolsTitle: "工具",
    toolsDescription: "我们使用并喜欢的技术",
    footerCta: "在 GitHub 上找到我们",
    backTop: "返回顶部",
  },
  es: {
    title: "Hyprism Team — proyectos de código abierto y desarrolladores",
    description:
      "Hyprism Team es un pequeño equipo de desarrolladores que crea proyectos de código abierto, incluido el launcher no oficial de Hytale Hyprism.",
    language: "Elegir idioma",
    skip: "Ir al contenido",
    nav: { team: "Equipo", projects: "Proyectos", tools: "Herramientas" },
    brandLabel: "Hyprism Team — inicio",
    heroTitle: ["Un equipo pequeño", "con intereses comunes"],
    heroBody: [
      "Escribimos código y probamos cosas nuevas",
      "mientras construimos proyectos abiertos",
    ],
    heroCta: "Conocer al equipo",
    teamTitle: "Equipo",
    teamSummary: "Cinco personas detrás de Hyprism Team",
    projectTitle: "Nuestro proyecto",
    projectName: "Hyprism",
    projectDescription:
      "Un launcher no oficial y de código abierto para Hytale que gestiona instancias, mods y perfiles.",
    projectLink: "Repositorio de Hyprism",
    screenLabels: ["Instancias", "Noticias", "Perfiles", "Ajustes"],
    screenAlt: "Pantalla de Hyprism",
    toolsTitle: "Herramientas",
    toolsDescription: "Con qué trabajamos y qué nos gusta",
    footerCta: "Estamos en GitHub",
    backTop: "Volver arriba",
  },
  fr: {
    title: "Hyprism Team — projets open source et développeurs",
    description:
      "Hyprism Team est une petite équipe de développeurs qui crée des projets open source, dont le launcher Hytale non officiel Hyprism.",
    language: "Choisir la langue",
    skip: "Aller au contenu",
    nav: { team: "Équipe", projects: "Projets", tools: "Outils" },
    brandLabel: "Hyprism Team — accueil",
    heroTitle: ["Une petite équipe", "des intérêts communs"],
    heroBody: [
      "Nous écrivons du code et essayons de nouvelles idées",
      "pour construire des projets ouverts",
    ],
    heroCta: "Rencontrer l’équipe",
    teamTitle: "Équipe",
    teamSummary: "Cinq personnes derrière Hyprism Team",
    projectTitle: "Notre projet",
    projectName: "Hyprism",
    projectDescription:
      "Un launcher Hytale non officiel et open source pour gérer les instances de jeu, les mods et les profils.",
    projectLink: "Dépôt Hyprism",
    screenLabels: ["Instances", "Actualités", "Profils", "Paramètres"],
    screenAlt: "Écran Hyprism",
    toolsTitle: "Outils",
    toolsDescription: "Ce avec quoi nous travaillons",
    footerCta: "Nous trouver sur GitHub",
    backTop: "Retour en haut",
  },
  "pt-br": {
    title: "Hyprism Team — projetos open source e desenvolvedores",
    description:
      "A Hyprism Team é uma pequena equipe de desenvolvedores que cria projetos open source, incluindo o launcher não oficial de Hytale Hyprism.",
    language: "Escolher idioma",
    skip: "Ir para o conteúdo",
    nav: { team: "Equipe", projects: "Projetos", tools: "Ferramentas" },
    brandLabel: "Hyprism Team — início",
    heroTitle: ["Uma equipe pequena", "com interesses em comum"],
    heroBody: [
      "Escrevemos código e experimentamos ideias",
      "enquanto construímos projetos abertos",
    ],
    heroCta: "Conheça a equipe",
    teamTitle: "Equipe",
    teamSummary: "Cinco pessoas por trás da Hyprism Team",
    projectTitle: "Nosso projeto",
    projectName: "Hyprism",
    projectDescription:
      "Um launcher não oficial e open source para Hytale, com gerenciamento de instâncias, mods e perfis.",
    projectLink: "Repositório do Hyprism",
    screenLabels: ["Instâncias", "Notícias", "Perfis", "Configurações"],
    screenAlt: "Tela do Hyprism",
    toolsTitle: "Ferramentas",
    toolsDescription: "Com o que trabalhamos e gostamos",
    footerCta: "Estamos no GitHub",
    backTop: "Voltar ao topo",
  },
};

export function getLocale(pathname = window.location.pathname): Locale {
  const segment = pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  return localeOrder.includes(segment as Locale) ? (segment as Locale) : "ru";
}
