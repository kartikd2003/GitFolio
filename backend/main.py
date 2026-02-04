from typing import List
from urllib.parse import quote
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel, HttpUrl

app = FastAPI(title="ReadmeCraft Generator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    includeStats: bool = True
    includeStreak: bool = True
    includeTrophies: bool = True


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


def _sanitize_list(value: str | None) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


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

    sections: List[str] = []
    sections.append(f"## Hi, I'm {data.name}")
    if data.role:
        sections.append(f"### {data.role}")

    if typing_lines:
        sections.append(
            "![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&pause=1000&color=58A6FF&width=600&lines="
            + typing_encoded
            + ")"
        )

    if social_links:
        sections.append(" ".join(social_links))

    if skill_badges:
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

    sections.append(
        "### Featured Projects\n- Project One � Short, punchy description\n- Project Two � What problem it solves\n- Project Three � Impact and tech used"
    )

    return "\n\n".join(sections)


@app.post("/generate", response_class=PlainTextResponse)
def generate(request: GenerateRequest) -> str:
    return _build_markdown(request)

