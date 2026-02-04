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
  includeStats: true,
  includeStreak: true,
  includeTrophies: true
};

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
  el("includeStats").checked = defaults.includeStats;
  el("includeStreak").checked = defaults.includeStreak;
  el("includeTrophies").checked = defaults.includeTrophies;
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
    includeStats: el("includeStats").checked,
    includeStreak: el("includeStreak").checked,
    includeTrophies: el("includeTrophies").checked
  };
}

function sanitizeList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
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

  sections.push(`## Hi, I'm ${data.name}`);
  if (data.role) {
    sections.push(`### ${data.role}`);
  }

  if (typingLines.length > 0) {
    sections.push(
      `![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&pause=1000&color=58A6FF&width=600&lines=${typingEncoded})`
    );
  }

  if (socialLinks.length > 0) {
    sections.push(socialLinks.join(" "));
  }

  if (skillBadges.length > 0) {
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

  sections.push("### Featured Projects\n- Project One — Short, punchy description\n- Project Two — What problem it solves\n- Project Three — Impact and tech used");

  return sections.join("\n\n");
}

async function generate() {
  const data = collectData();

  try {
    const res = await fetch("http://127.0.0.1:8000/generate", {
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

function bindEvents() {
  el("generateBtn").addEventListener("click", handleGenerate);
  el("copyBtn").addEventListener("click", handleCopy);
  fields.forEach((id) => el(id).addEventListener("input", handleGenerate));
  ["includeStats", "includeStreak", "includeTrophies"].forEach((id) =>
    el(id).addEventListener("change", handleGenerate)
  );
}

loadDefaults();
bindEvents();
handleGenerate();
