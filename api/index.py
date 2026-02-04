from typing import List
from urllib.parse import quote

from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel, HttpUrl

app = FastAPI(title="GitFolio Generator", version="1.0.0")


class GenerateRequest(BaseModel):
    name: str
    role: str | None = None
    github: str
    typing: str | None = None
    skills: str | None = None
    theme: str = "github_dark"
    linkedin: HttpUrl | None = None
    twitter: HttpUrl | None = None
    portfolio: HttpUrl | None = None
    includeBasics: bool = True
    includeTyping: bool = True
    includeSocials: bool = True
    includeSkills: bool = True
    includeStats: bool = True
    includeStreak: bool = True
    includeTrophies: bool = True
    includeProjects: bool = True
    projects: list[dict] | None = None


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


def _sanitize_list(value: str | None) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def _build_project_line(project: dict, theme: str) -> str:
    colors = {
        "github_dark": {"repo": "181717", "live": "1f6feb"},
        "tokyonight": {"repo": "1a1b27", "live": "7aa2f7"},
        "radical": {"repo": "141321", "live": "fe428e"},
        "gruvbox": {"repo": "3c3836", "live": "fabd2f"},
        "onedark": {"repo": "282c34", "live": "61afef"},
        "dracula": {"repo": "282a36", "live": "bd93f9"},
    }.get(theme, {"repo": "181717", "live": "1f6feb"})

    parts: list[str] = []
    title = project.get("title") or "Project"
    line = f"- **{title}**"
    if project.get("description"):
        line += f" — {project['description']}"
    parts.append(line)

    meta: list[str] = []
    if project.get("tech"):
        meta.append(project["tech"])
    if project.get("impact"):
        meta.append(project["impact"])
    if meta:
        parts.append(f"  - _{' | '.join(meta)}_")

    badges: list[str] = []
    if project.get("repo"):
        badges.append(
            f"[![Repo](https://img.shields.io/badge/Repo-{colors['repo']}?style=for-the-badge&logo=github&logoColor=white)]({project['repo']})"
        )
    if project.get("live"):
        badges.append(
            f"[![Live](https://img.shields.io/badge/Live-{colors['live']}?style=for-the-badge&logo=vercel&logoColor=white)]({project['live']})"
        )
    if badges:
        parts.append(f"  - {' '.join(badges)}")

    return "\n".join(parts)


def _build_markdown(data: GenerateRequest) -> str:
    typing_lines = _sanitize_list(data.typing)
    skills = _sanitize_list(data.skills)
    typing_encoded = quote(";".join(typing_lines))
    theme = data.theme or "github_dark"

    social_links = []
    if data.github:
        social_links.append(
            f"[![GitHub](https://img.shields.io/badge/GitHub-{data.github}-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/{data.github})"
        )
    if data.linkedin:
        social_links.append(
            "[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)]"
            f"({data.linkedin})"
        )
    if data.twitter:
        social_links.append(
            "[![X](https://img.shields.io/badge/X-Profile-000000?style=for-the-badge&logo=x&logoColor=white)]"
            f"({data.twitter})"
        )
    if data.portfolio:
        social_links.append(
            "[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-111111?style=for-the-badge&logo=vercel&logoColor=white)]"
            f"({data.portfolio})"
        )

    skill_badges = [
        f"![{skill}](https://img.shields.io/badge/{quote(skill)}-0f172a?style=for-the-badge&logo={quote(skill)}&logoColor=white)"
        for skill in skills
    ]

    sections: list[str] = []

    if data.includeBasics:
        sections.append(
            f'# <img src="https://raw.githubusercontent.com/ABSphreak/ABSphreak/master/gifs/Hi.gif" height="32" alt="Wave" style="vertical-align: middle;" /> Hi, I\'m {data.name}'
        )
        if data.role:
            sections.append(f"### {data.role}")

    if data.includeTyping and typing_lines:
        sections.append(
            "![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&pause=1000&color=58A6FF&width=600&lines="
            + typing_encoded
            + ")"
        )

    if data.includeSocials and social_links:
        sections.append(" ".join(social_links))

    if data.includeSkills and skill_badges:
        sections.append("### Skills\n" + " ".join(skill_badges))

    if data.includeStats and data.github:
        sections.append(
            "### GitHub Stats\n"
            f"![GitHub Stats](https://github-readme-stats.vercel.app/api?username={data.github}&show_icons=true&theme={theme}&hide_border=true)"
        )

    if data.includeStreak and data.github:
        sections.append(
            "### Streak\n"
            f"![GitHub Streak](https://streak-stats.demolab.com?user={data.github}&theme={theme}&hide_border=true)"
        )

    if data.includeTrophies and data.github:
        sections.append(
            "### Trophies\n"
            f"![Trophies](https://github-profile-trophy.vercel.app/?username={data.github}&theme={theme}&no-frame=true&margin-w=10)"
        )

    if data.includeProjects:
        projects = data.projects or []
        lines = "\n".join(_build_project_line(p, theme) for p in projects) if projects else "- Add your first project"
        sections.append("### Featured Projects\n" + lines)

    return "\n\n".join(sections)


@app.post("/generate", response_class=PlainTextResponse)
def generate(request: GenerateRequest) -> str:
    return _build_markdown(request)
