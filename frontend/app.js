const defaults = {
  name: "Jane Doe",
  role: "Full Stack Developer",
  github: "janedoe",
  typing: "Building cool things,Open-source contributor,Always learning",
  skills: "TypeScript,React,Node.js,Python,Docker",
  theme: "github_dark",
  linkedin: "https://linkedin.com/in/yourname",
  twitter: "https://x.com/yourhandle",
  portfolio: "https://yourdomain.com",
  includeBasics: true,
  includeTheme: true,
  includeTyping: true,
  includeSocials: true,
  includeSkills: true,
  includeStats: true,
  includeStreak: true,
  includeTrophies: true,
  includeProjects: true
};

const THEME_KEY = "gitfolio_theme";
const WAVE_GIF = "https://raw.githubusercontent.com/ABSphreak/ABSphreak/master/gifs/Hi.gif";

const el = (id) => document.getElementById(id);

const fields = [
  "name",
  "role",
  "github",
  "typing",
  "skills",
  "theme",
  "linkedin",
  "twitter",
  "portfolio"
];

function loadDefaults() {
  fields.forEach((key) => {
    el(key).value = defaults[key] ?? "";
  });
  el("includeBasics").checked = defaults.includeBasics;
  el("includeTheme").checked = defaults.includeTheme;
  el("includeTyping").checked = defaults.includeTyping;
  el("includeSocials").checked = defaults.includeSocials;
  el("includeSkills").checked = defaults.includeSkills;
  el("includeStats").checked = defaults.includeStats;
  el("includeStreak").checked = defaults.includeStreak;
  el("includeTrophies").checked = defaults.includeTrophies;
  el("includeProjects").checked = defaults.includeProjects;
}

function collectData() {
  return {
    name: el("name").value.trim(),
    role: el("role").value.trim(),
    github: el("github").value.trim(),
    typing: el("typing").value.trim(),
    skills: el("skills").value.trim(),
    theme: el("theme").value,
    linkedin: el("linkedin").value.trim(),
    twitter: el("twitter").value.trim(),
    portfolio: el("portfolio").value.trim(),
    includeBasics: el("includeBasics").checked,
    includeTyping: el("includeTyping").checked,
    includeSocials: el("includeSocials").checked,
    includeSkills: el("includeSkills").checked,
    includeStats: el("includeStats").checked,
    includeStreak: el("includeStreak").checked,
    includeTrophies: el("includeTrophies").checked,
    includeProjects: el("includeProjects").checked,
    projects: readProjects()
  };
}

function sanitizeList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function getThemeBadgeColors(theme) {
  const map = {
    github_dark: { repo: "181717", live: "1f6feb" },
    tokyonight: { repo: "1a1b27", live: "7aa2f7" },
    radical: { repo: "141321", live: "fe428e" },
    gruvbox: { repo: "3c3836", live: "fabd2f" },
    onedark: { repo: "282c34", live: "61afef" },
    dracula: { repo: "282a36", live: "bd93f9" }
  };
  return map[theme] || map.github_dark;
}

function buildProjectLine(project, theme) {
  const parts = [];
  const title = project.title || "Project";
  let line = `- **${title}**`;
  if (project.description) {
    line += ` — ${project.description}`;
  }
  parts.push(line);

  const meta = [];
  if (project.tech) meta.push(project.tech);
  if (project.impact) meta.push(project.impact);
  if (meta.length > 0) {
    parts.push(`  - _${meta.join(" | ")}_`);
  }
  const colors = getThemeBadgeColors(theme);
  const badges = [];
  if (project.repo) {
    badges.push(
      `[![Repo](https://img.shields.io/badge/Repo-${colors.repo}?style=for-the-badge&logo=github&logoColor=white)](${project.repo})`
    );
  }
  if (project.live) {
    badges.push(
      `[![Live](https://img.shields.io/badge/Live-${colors.live}?style=for-the-badge&logo=vercel&logoColor=white)](${project.live})`
    );
  }
  if (badges.length > 0) {
    parts.push(`  - ${badges.join(" ")}`);
  }
  return parts.join("\n");
}

function buildMarkdown(data) {
  const typingLines = sanitizeList(data.typing);
  const skills = sanitizeList(data.skills);
  const typingEncoded = encodeURIComponent(typingLines.join(";"));
  const theme = data.theme || "github_dark";

  const socialLinks = [
    data.github ? `[![GitHub](https://img.shields.io/badge/GitHub-${data.github}-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${data.github})` : "",
    data.linkedin ? `[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](${data.linkedin})` : "",
    data.twitter ? `[![X](https://img.shields.io/badge/X-Profile-000000?style=for-the-badge&logo=x&logoColor=white)](${data.twitter})` : "",
    data.portfolio ? `[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-111111?style=for-the-badge&logo=vercel&logoColor=white)](${data.portfolio})` : ""
  ].filter(Boolean);

  const skillBadges = skills.map((skill) => {
    const label = encodeURIComponent(skill);
    return `![${skill}](https://img.shields.io/badge/${label}-0f172a?style=for-the-badge&logo=${label}&logoColor=white)`;
  });

  const sections = [];

  if (data.includeBasics) {
    sections.push(`# <img src="${WAVE_GIF}" height="32" alt="Wave" style="vertical-align: middle;" /> Hi, I'm ${data.name}`);
    if (data.role) {
      sections.push(`### ${data.role}`);
    }
  }

  if (data.includeTyping && typingLines.length > 0) {
    sections.push(
      `![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&pause=1000&color=58A6FF&width=600&lines=${typingEncoded})`
    );
  }

  if (data.includeSocials && socialLinks.length > 0) {
    sections.push(socialLinks.join(" "));
  }

  if (data.includeSkills && skillBadges.length > 0) {
    sections.push("### Skills\n" + skillBadges.join(" "));
  }

  if (data.includeStats && data.github) {
    sections.push(
      `### GitHub Stats\n![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${data.github}&show_icons=true&theme=${theme}&hide_border=true)`
    );
  }

  if (data.includeStreak && data.github) {
    sections.push(
      `### Streak\n![GitHub Streak](https://streak-stats.demolab.com?user=${data.github}&theme=${theme}&hide_border=true)`
    );
  }

  if (data.includeTrophies && data.github) {
    sections.push(
      `### Trophies\n![Trophies](https://github-profile-trophy.vercel.app/?username=${data.github}&theme=${theme}&no-frame=true&margin-w=10)`
    );
  }

  if (data.includeProjects) {
    const lines = data.projects.map((project) => buildProjectLine(project, theme)).join("\n");
    sections.push("### Featured Projects\n" + (lines || "- Add your first project"));
  }

  return sections.join("\n\n");
}

function readProjects() {
  const cards = document.querySelectorAll(".project-card");
  return Array.from(cards).map((card) => ({
    title: card.querySelector("[data-field='title']").value.trim(),
    description: card.querySelector("[data-field='description']").value.trim(),
    tech: card.querySelector("[data-field='tech']").value.trim(),
    impact: card.querySelector("[data-field='impact']").value.trim(),
    repo: card.querySelector("[data-field='repo']").value.trim(),
    live: card.querySelector("[data-field='live']").value.trim()
  }));
}

function addProjectCard(project = {}) {
  const list = el("projectList");
  const card = document.createElement("div");
  card.className = "project-card";
  card.innerHTML = `
    <div class="project-row">
      <label>
        <span>Title</span>
        <input data-field="title" type="text" placeholder="Project name" value="${project.title || ""}" />
      </label>
      <label>
        <span>One-line Description</span>
        <input data-field="description" type="text" placeholder="What it does" value="${project.description || ""}" />
      </label>
    </div>
    <div class="project-row">
      <label>
        <span>Tech Stack</span>
        <input data-field="tech" type="text" placeholder="React, FastAPI" value="${project.tech || ""}" />
      </label>
      <label>
        <span>Impact Metric</span>
        <input data-field="impact" type="text" placeholder="+20% conversions" value="${project.impact || ""}" />
      </label>
    </div>
    <div class="project-row">
      <label>
        <span>Repo Link</span>
        <input data-field="repo" type="text" placeholder="https://github.com/you/project" value="${project.repo || ""}" />
      </label>
      <label>
        <span>Live Link</span>
        <input data-field="live" type="text" placeholder="https://project.com" value="${project.live || ""}" />
      </label>
    </div>
    <div class="project-actions">
      <button class="mini-btn" type="button" data-action="up">Move Up</button>
      <button class="mini-btn" type="button" data-action="down">Move Down</button>
      <button class="mini-btn" type="button" data-action="remove">Remove</button>
    </div>
  `;

  card.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", handleGenerate);
  });

  card.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => handleProjectAction(card, btn.dataset.action));
  });

  list.appendChild(card);
}

function handleProjectAction(card, action) {
  const list = el("projectList");
  if (action === "remove") {
    card.remove();
    handleGenerate();
    return;
  }
  if (action === "up") {
    const prev = card.previousElementSibling;
    if (prev) list.insertBefore(card, prev);
  }
  if (action === "down") {
    const next = card.nextElementSibling;
    if (next) list.insertBefore(next, card);
  }
  handleGenerate();
}

function syncSectionVisibility() {
  document.querySelectorAll("input[data-target]").forEach((input) => {
    const target = document.getElementById(input.dataset.target);
    if (!target) return;
    target.style.display = input.checked ? "" : "none";
  });
}

async function generate() {
  const data = collectData();

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error("Backend unavailable");
    }

    const markdown = await res.text();
    return markdown;
  } catch (err) {
    return buildMarkdown(data);
  }
}

function renderPreview(markdown) {
  const preview = el("preview");
  preview.innerHTML = marked.parse(markdown, { breaks: true });
}

async function handleGenerate() {
  const markdown = await generate();
  el("output").value = markdown;
  renderPreview(markdown);
}

async function handleCopy() {
  const markdown = el("output").value;
  if (!markdown) {
    return;
  }
  await navigator.clipboard.writeText(markdown);
  const btn = el("copyBtn");
  const previous = btn.textContent;
  btn.textContent = "Copied";
  setTimeout(() => {
    btn.textContent = previous;
  }, 1500);
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  const btn = el("themeToggle");
  if (btn) {
    btn.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const theme = saved || (prefersLight ? "light" : "dark");
  applyTheme(theme);
}

function toggleTheme() {
  const current = document.body.dataset.theme === "light" ? "light" : "dark";
  const next = current === "light" ? "dark" : "light";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

function setActiveTab(tab) {
  const preview = el("preview");
  const output = el("output");
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  if (tab === "markdown") {
    preview.classList.add("hidden");
    output.classList.remove("hidden");
  } else {
    output.classList.add("hidden");
    preview.classList.remove("hidden");
  }
}

function bindTabToggle() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });
}

function bindEvents() {
  el("generateBtn").addEventListener("click", handleGenerate);
  el("copyBtn").addEventListener("click", handleCopy);
  const toggleBtn = el("themeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleTheme);
  }
  el("addProjectBtn").addEventListener("click", () => {
    addProjectCard();
    handleGenerate();
  });
  fields.forEach((id) => el(id).addEventListener("input", handleGenerate));
  [
    "includeBasics",
    "includeTheme",
    "includeTyping",
    "includeSocials",
    "includeSkills",
    "includeStats",
    "includeStreak",
    "includeTrophies",
    "includeProjects"
  ].forEach((id) => {
    el(id).addEventListener("change", () => {
      syncSectionVisibility();
      handleGenerate();
    });
  });
}

loadDefaults();
initTheme();
bindTabToggle();
bindEvents();
if (document.querySelectorAll(".project-card").length === 0) {
  addProjectCard();
}
syncSectionVisibility();
handleGenerate();
